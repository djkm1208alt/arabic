#!/usr/bin/env python3
"""
generate-ai-audio.py — M15.6 AI-voice audio generation (local, offline, dev-time only)
=======================================================================================

NOT part of the shipped app. Not run by any CI/build step in this repo. Run by
hand, on your own machine, to produce .mp3 files under audio-ai/ that get
listened to, reviewed, and only then committed — see the "Listening-QA gate"
in m15.6_ai_generated_audio_scope.md and AUDIO.md's "AI-generated audio
(M15.6)" section. This script never touches index.html or any content/*.json
file; it only reads tools/audio-manifest.json (the same authoritative
inventory build-audio-manifest.js already produces) and writes audio files.

WARNING — this script was authored against openbmb/VoxCPM2's documented
usage but has NOT been run in the sandbox that wrote it (no torch/pip there).
Expect to debug on first run. Read the error messages; they're written to be
actionable.

Setup (on your own machine, not this dev sandbox):
    python3 -m venv .venv && source .venv/bin/activate   # optional but recommended
    pip install voxcpm soundfile
    # ffmpeg must be on PATH separately (not a pip package):
    #   macOS:   brew install ffmpeg
    #   Ubuntu:  sudo apt install ffmpeg
    #   Windows: https://ffmpeg.org/download.html

Usage:
    python tools/generate-ai-audio.py --pilot
        Generate the recommended first-look pilot batch (~52 items spanning
        every target type — see m15.6_ai_generated_audio_scope.md §4).

    python tools/generate-ai-audio.py --tier 1
        Generate everything in Tier 1 (foundation) not already present.

    python tools/generate-ai-audio.py --types word,sentence --limit 20
        Generate the first 20 not-yet-present targets of the given types.

    python tools/generate-ai-audio.py --force
        Regenerate even targets that already have an audio-ai/ file.

Every run is idempotent by default: a target whose output file already exists
is skipped, so an interrupted run can simply be re-invoked to resume.

No Hugging Face token is required — openbmb/VoxCPM2 is a public, non-gated
model; huggingface_hub downloads it anonymously on first use and caches it
locally. (The "Inference Providers" token created earlier isn't the right
credential for this local-download path anyway — that token is for calling
HF's hosted router API, which doesn't support text-to-speech at all today.)
"""

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_JSON = ROOT / "tools" / "audio-manifest.json"
AUDIO_AI_DIR = ROOT / "audio-ai"

# Matches AUDIO.md's "Recording spec" section exactly, so an AI-voice file and
# a later human recording are format-interchangeable with zero drift.
TARGET_SAMPLE_RATE = 44100
TARGET_BITRATE = "192k"
SILENCE_TRIM_MS = 150
PEAK_DBFS = -3

# A style prefix leaning on VoxCPM2's documented "(description) text" voice-
# design convention, aimed at AUDIO.md's own spec: "Neutral, clear, unhurried,
# declarative. No regional-dialect features." This is a best-effort nudge, not
# a guarantee — the listening-QA gate is what actually decides if a batch
# ships, not this string. Override with --style if you want to experiment.
DEFAULT_STYLE_PREFIX = "(A calm, neutral Modern Standard Arabic voice, clear and unhurried)"

# Pilot set: deliberately spans every item TYPE in the manifest (isolated
# letter-sounds are the riskiest case for a general TTS model — see
# m15.6_ai_generated_audio_scope.md §4/§5 — so the pilot surfaces that risk
# early rather than only after a large batch is already generated).
PILOT_TYPES = {
    "mark": None,          # all of them (6)
    "letter-name": None,   # all of them (28)
    "letter": 6,           # a handful, not all — the riskiest category
    "word": 15,
    "sentence": 3,
}


def load_manifest():
    if not MANIFEST_JSON.exists():
        sys.exit(
            f"error: {MANIFEST_JSON} not found.\n"
            "Run `node tools/build-audio-manifest.js` first (from the repo root, "
            "with Node — not this script) to generate it."
        )
    data = json.loads(MANIFEST_JSON.read_text(encoding="utf-8"))
    # Only real recording targets carry an aiFile path; aliases/tts-only don't.
    return [t for t in data["targets"] if t["role"] == "recording" and t.get("aiFile")]


def select_targets(all_targets, args):
    targets = all_targets
    if not args.force:
        targets = [t for t in targets if not t.get("aiFilePresent")]

    if args.pilot:
        chosen = []
        by_type = {}
        for t in targets:
            by_type.setdefault(t["type"], []).append(t)
        for typ, limit in PILOT_TYPES.items():
            pool = sorted(by_type.get(typ, []), key=lambda t: t["id"])
            chosen.extend(pool if limit is None else pool[:limit])
        return chosen

    if args.tier is not None:
        targets = [t for t in targets if t["tier"] == args.tier]
    if args.types:
        wanted = set(args.types.split(","))
        targets = [t for t in targets if t["type"] in wanted]
    if args.limit is not None:
        targets = targets[: args.limit]
    return targets


def check_ffmpeg():
    try:
        subprocess.run(
            ["ffmpeg", "-version"], capture_output=True, check=True, text=True
        )
    except (FileNotFoundError, subprocess.CalledProcessError):
        sys.exit(
            "error: ffmpeg not found on PATH.\n"
            "This script shells out to ffmpeg for resampling/mono-mixing/MP3 "
            "encoding/silence-trim/loudness-normalize — see AUDIO.md's Recording "
            "spec for why those exact numbers. Install it (macOS: `brew install "
            "ffmpeg`; Ubuntu: `sudo apt install ffmpeg`) and re-run."
        )


def load_model():
    try:
        from voxcpm import VoxCPM
    except ImportError:
        sys.exit(
            "error: the `voxcpm` package isn't installed.\n"
            "Run: pip install voxcpm soundfile\n"
            "(Needs Python >= 3.10, PyTorch >= 2.5.0. See this script's own "
            "module docstring for full setup.)"
        )
    print("Loading openbmb/VoxCPM2 (first run downloads and caches it — no HF "
          "token needed, it's a public model)...", file=sys.stderr)
    return VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=False)


def synth_to_wav(model, text, style_prefix, tmp_wav_path):
    import soundfile as sf

    prompt = f"{style_prefix} {text}" if style_prefix else text
    wav = model.generate(text=prompt, cfg_value=2.0, inference_timesteps=10)
    sf.write(str(tmp_wav_path), wav, model.tts_model.sample_rate)


def postprocess_to_mp3(tmp_wav_path, out_mp3_path):
    """Resample -> mono -> trim leading/trailing near-silence -> loudness/peak
    normalize -> MP3 encode, all in one ffmpeg pass. Matches AUDIO.md's spec
    (44.1kHz mono ~192kbps CBR, ~150ms trimmed silence, peak around -3dBFS) —
    best-effort via ffmpeg's filters, not a guarantee; spot-check a few files'
    actual levels before trusting a whole batch."""
    out_mp3_path.parent.mkdir(parents=True, exist_ok=True)
    silence_s = SILENCE_TRIM_MS / 1000.0
    af = (
        f"silenceremove=start_periods=1:start_silence={silence_s}:start_threshold=-50dB:"
        f"detection=peak,"
        f"areverse,"
        f"silenceremove=start_periods=1:start_silence={silence_s}:start_threshold=-50dB:"
        f"detection=peak,"
        f"areverse,"
        f"loudnorm=I=-16:TP={PEAK_DBFS}:LRA=11"
    )
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(tmp_wav_path),
        "-ar", str(TARGET_SAMPLE_RATE),
        "-ac", "1",
        "-af", af,
        "-b:a", TARGET_BITRATE,
        str(out_mp3_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed for {out_mp3_path}:\n{result.stderr}")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--pilot", action="store_true", help="Generate the recommended first-look pilot batch (~52 items).")
    parser.add_argument("--tier", type=int, choices=[1, 2], help="Restrict to a tier (Tier 3 stays TTS by design — not selectable here).")
    parser.add_argument("--types", type=str, help="Comma-separated target types, e.g. word,sentence.")
    parser.add_argument("--limit", type=int, help="Cap the number of targets generated this run.")
    parser.add_argument("--force", action="store_true", help="Regenerate even targets that already have a file under audio-ai/.")
    parser.add_argument("--style", type=str, default=DEFAULT_STYLE_PREFIX, help="Override the voice-design style prefix (empty string to omit it).")
    parser.add_argument("--dry-run", action="store_true", help="List what would be generated without calling the model.")
    args = parser.parse_args()

    all_targets = load_manifest()
    targets = select_targets(all_targets, args)

    if not targets:
        print("Nothing to do — no targets matched your filters (or everything already has a file; use --force to regenerate).")
        return

    print(f"{len(targets)} target(s) selected.")
    if args.dry_run:
        for t in targets:
            print(f"  {t['aiFile']}  —  {t['arabic']}  ({t['type']}, tier {t['tier']})")
        return

    check_ffmpeg()
    model = load_model()

    ok, failed = 0, []
    for i, t in enumerate(targets, 1):
        out_path = ROOT / t["aiFile"]
        print(f"[{i}/{len(targets)}] {t['aiFile']}  —  {t['arabic']}")
        try:
            with tempfile.TemporaryDirectory() as tmp:
                tmp_wav = Path(tmp) / "raw.wav"
                synth_to_wav(model, t["arabic"], args.style, tmp_wav)
                postprocess_to_mp3(tmp_wav, out_path)
            ok += 1
        except Exception as e:  # noqa: BLE001 — batch job, one bad item shouldn't kill the run
            print(f"    FAILED: {e}", file=sys.stderr)
            failed.append(t["id"])

    print(f"\nDone: {ok} generated, {len(failed)} failed.")
    if failed:
        print("Failed targets (re-run with --types/--limit to retry just these, or investigate):")
        for fid in failed:
            print(f"  - {fid}")
    print(
        "\nNEXT STEP — do not skip: listen to every file in audio-ai/ before "
        "committing anything. See AUDIO.md's 'AI-generated audio (M15.6)' "
        "section for the listening-QA checklist. Files that don't pass stay "
        "out of the commit; their targets keep using live TTS."
    )


if __name__ == "__main__":
    main()
