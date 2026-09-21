"""Generate the M28 Unit 01-02 seed data into content/seed/m28/.

Every Arabic string comes from the pair table below (the spec's §4 matrix,
as corrected by decisions 1-5) or from existing app objects. The script
validates as it writes: object ids resolve, audio keys exist (or are new
`pairs/` keys), exactly one correct option per item, correct-answer
positions vary, and every Arabic word carries harakat.
"""
import json, os, re, sys, unicodedata

# Usage: python3 tools/m28-seed-generator.py   (rewrites content/seed/m28/, exits 1 on any failed check)

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "content/seed/m28")
os.makedirs(os.path.join(OUT, "lessons"), exist_ok=True)

def load(p):
    with open(os.path.join(REPO, p), encoding="utf-8") as f:
        return json.load(f)

LETTERS = {x["id"]: x for x in load("content/letters.json")}
MARKS = {x["id"]: x for x in load("content/marks.json")}
SYLS = {x["id"]: x for x in load("content/syllables.json")}
LEX = {x["id"]: x for x in load("content/lexemes.json")}
MANIFEST = {x["id"] for x in load("tools/audio-manifest.json")["targets"]}
PROPOSED = {"mrk:hamza"}
KNOWN = set(LETTERS) | set(MARKS) | set(SYLS) | PROPOSED

errors = []
def check(cond, msg):
    if not cond:
        errors.append(msg)

# French typography: narrow no-break handling before ? ! : ; and inside guillemets.
NBSP = " "
def fr(s):
    s = re.sub(r" ([?!:;])", NBSP + r"\1", s)
    s = s.replace("« ", "«" + NBSP).replace(" »", NBSP + "»")
    return s

HARAKAT = re.compile("[ً-ْ]")

# ---------------------------------------------------------------------------
# Phoneme symbols shown as answer options, with plain-language hints.
# ---------------------------------------------------------------------------
PHON = {
    "let:ha1":   ("ح", "the strong throat h", "le h fort de la gorge"),
    "let:ha2":   ("ه", "the light h", "le h léger"),
    "let:ayn":   ("ع", "the tight throat sound, with your voice on", "le son serré de la gorge, avec la voix"),
    "mrk:hamza": ("ء", "the throat catch (hamza), written here on an alif (أ)", "le coup de glotte (hamza), écrit ici sur un alif (أ)"),
    "let:sad":   ("ص", "the heavy s", "le s lourd"),
    "let:sin":   ("س", "the light s", "le s léger"),
    "let:ta2":   ("ط", "the heavy t", "le t lourd"),
    "let:ta1":   ("ت", "the light t", "le t léger"),
    "let:dad":   ("ض", "the heavy d", "le d lourd"),
    "let:dal":   ("د", "the light d", "le d léger"),
    "let:qaf":   ("ق", "the deep k", "le k profond"),
    "let:kaf":   ("ك", "the light k", "le k léger"),
}

# ---------------------------------------------------------------------------
# The 11 minimal pairs: spec §4 as corrected by decisions 1-5.
# member = (phoneme id, ar, translit, en, fr, lexemeId, quranic (ref, form) | None, note)
# ---------------------------------------------------------------------------
PAIRS = [
    ("mp:ha1-ha2-haram", "haram", [
        ("let:ha1", "حَرَم", "ḥaram", "sanctuary", "sanctuaire", None, ("28:57", "حَرَمًا"), None),
        ("let:ha2", "هَرَم", "haram", "pyramid", "pyramide", None, None, None)]),
    ("mp:ha1-ha2-habba", "habba", [
        ("let:ha1", "حَبَّ", "ḥabba", "to love", "aimer", None, None,
         "Classical form; everyday MSA says أَحَبَّ. Kept for the sound contrast only (decision 1-5)."),
        ("let:ha2", "هَبَّ", "habba", "to blow (of wind)", "souffler (le vent)", None, None, None)]),
    ("mp:ayn-hamza-alima", "alima", [
        ("let:ayn", "عَلِمَ", "ʿalima", "to know", "savoir", None, ("2:60", "عَلِمَ"), None),
        ("mrk:hamza", "أَلِمَ", "alima", "to feel pain", "souffrir", None, ("4:104", "يَأْلَمُونَ"), None)]),
    ("mp:ayn-hamza-amal", "amal", [
        ("let:ayn", "عَمَل", "ʿamal", "work / job", "travail", "lex:wrk-11", ("18:110", "عَمَلًا"), None),
        ("mrk:hamza", "أَمَل", "amal", "hope", "espoir", None, ("15:3", "الْأَمَلُ"), None)]),
    ("mp:sad-sin-sayf", "sayf", [
        ("let:sad", "صَيْف", "ṣayf", "summer", "été", None, ("106:2", "وَالصَّيْفِ"), None),
        ("let:sin", "سَيْف", "sayf", "sword", "épée", None, None, None)]),
    ("mp:sad-sin-sara", "sara", [
        ("let:sad", "صَارَ", "ṣāra", "to become", "devenir", None, ("42:53", "تَصِيرُ"), None),
        ("let:sin", "سَارَ", "sāra", "to walk, to travel", "marcher, voyager", None, ("28:29", "وَسَارَ"), None)]),
    ("mp:ta2-ta1-taba", "taba", [
        ("let:ta2", "طَابَ", "ṭāba", "to be good, pleasant", "être bon, agréable", None, ("4:3", "طَابَ"), None),
        ("let:ta1", "تَابَ", "tāba", "to repent", "se repentir", None, ("2:37", "فَتَابَ"), None)]),
    ("mp:ta2-ta1-tin", "tin", [
        ("let:ta2", "طِين", "ṭīn", "clay", "argile", None, ("6:2", "طِينٍ"), None),
        ("let:ta1", "تِين", "tīn", "figs", "figues", "lex:foo-14", ("95:1", "وَالتِّينِ"), None)]),
    ("mp:dad-dal-dalla", "dalla", [
        ("let:dad", "ضَلَّ", "ḍalla", "to go astray", "s'égarer", None, ("53:2", "ضَلَّ"), None),
        ("let:dal", "دَلَّ", "dalla", "to guide, to point the way", "guider, indiquer le chemin", None, ("34:14", "دَلَّهُمْ"), None)]),
    ("mp:qaf-kaf-qalb", "qalb", [
        ("let:qaf", "قَلْب", "qalb", "heart", "cœur", None, ("26:89", "بِقَلْبٍ"), None),
        ("let:kaf", "كَلْب", "kalb", "dog", "chien", None, ("18:18", "وَكَلْبُهُم"), None)]),
    ("mp:qaf-kaf-qala", "qala", [
        ("let:qaf", "قَالَ", "qāla", "to say", "dire", None, ("2:30", "قَالَ"), None),
        ("let:kaf", "كَالَ", "kāla", "to measure out (by volume)", "mesurer (en volume)", None, ("83:3", "كَالُوهُمْ"),
         "كَيْل (measuring by volume) is distinct from وَزْن (weighing); 83:3 uses both: كَالُوهُمْ أَو وَّزَنُوهُمْ.")]),
]

def ascii_tl(tl):
    base = "".join(c for c in unicodedata.normalize("NFD", tl) if not unicodedata.combining(c))
    return re.sub(r"[^a-z]", "", base.replace("ʿ", "").replace("ʾ", ""))

def slug(pid):
    return pid.split(":")[1].split("-")[0] if pid.startswith("let:") else pid.split(":")[1]

pair_objs, WORD = [], {}
for pid, stem, members in PAIRS:
    words = []
    for m in members:
        ph, ar, tl, en, frg, lexid, q, note = m
        check(ph in KNOWN, f"{pid}: phoneme {ph} unknown")
        check(bool(HARAKAT.search(ar)), f"{pid}: {ar} has no harakat")
        if lexid:
            check(lexid in LEX and LEX[lexid]["ar"] == ar, f"{pid}: {ar} does not match {lexid}")
            akey = "words/" + lexid.split(":")[1]
            check(akey in MANIFEST, f"{pid}: audio key {akey} missing from manifest")
        else:
            akey = f"pairs/{ascii_tl(tl)}-{ph.split(':')[1]}"
        w = {"phoneme": ph, "ar": ar, "translit": tl, "en": en, "fr": fr(frg),
             "emphasisTag": "both", "audioKey": akey, "frequencyRank": None}
        if lexid: w["lexemeId"] = lexid
        w["quranic"] = {"ref": q[0], "form": q[1]} if q else None
        if note: w["notes"] = note
        words.append(w)
        WORD[(pid, ph)] = w
    check(len({w["phoneme"] for w in words}) == 2, f"{pid}: needs two different phonemes")
    pair_objs.append({"id": pid, "kind": "minimal-pair", "contrastPhonemes": [w["phoneme"] for w in words],
                      "position": "initial", "level": "A0", "emphasisTag": "both",
                      "skills": ["listening", "pronunciation"], "words": words})

# ---------------------------------------------------------------------------
# Item builders
# ---------------------------------------------------------------------------
correct_positions = []

def options(labels, correct_label, correct_index):
    check(labels[correct_index] == correct_label, f"option order wrong for {correct_label}")
    correct_positions.append(correct_index)
    return [{"label": l, "correct": l == correct_label} for l in labels]

def letter_item(pid, heard_ph, correct_index):
    pair = next(p for p in pair_objs if p["id"] == pid)
    phs = pair["contrastPhonemes"]
    other = [p for p in phs if p != heard_ph][0]
    w = WORD[(pid, heard_ph)]
    L, hint_en, hint_fr = PHON[heard_ph]
    labels = [PHON[heard_ph][0], PHON[other][0]] if correct_index == 0 else [PHON[other][0], PHON[heard_ph][0]]
    return {
        "type": "exercise",
        "title": "Which sound?",
        "fr": {"title": fr("Quel son ?")},
        "exercise": {
            "kind": "choice",
            "drillType": "minimal-pair",
            "skill": "listening",
            "objectIds": [heard_ph, other],
            "contrastPhonemes": phs,
            "pairRef": {"pairId": pid, "heard": heard_ph},
            "audioText": w["ar"],
            "audioKey": w["audioKey"],
            "prompt": "Listen. Which sound does this word start with?",
            "options": options(labels, L, correct_index),
            "explanation": f"{w['ar']} ({w['translit']}), “{w['en']}”, starts with {L}: {hint_en}.",
            "fr": {
                "prompt": fr("Écoutez. Par quel son ce mot commence-t-il ?"),
                "explanation": fr(f"{w['ar']} ({w['translit']}), « {w['fr']} », commence par {L} : {hint_fr}."),
            },
        },
    }

def word_item(pid, heard_ph, correct_index):
    pair = next(p for p in pair_objs if p["id"] == pid)
    phs = pair["contrastPhonemes"]
    other = [p for p in phs if p != heard_ph][0]
    w, w2 = WORD[(pid, heard_ph)], WORD[(pid, other)]
    labels = [w["ar"], w2["ar"]] if correct_index == 0 else [w2["ar"], w["ar"]]
    return {
        "type": "exercise",
        "title": "Which word?",
        "fr": {"title": fr("Quel mot ?")},
        "exercise": {
            "kind": "choice",
            "drillType": "minimal-pair",
            "skill": "listening",
            "objectIds": [heard_ph, other],
            "contrastPhonemes": phs,
            "pairRef": {"pairId": pid, "heard": heard_ph},
            "audioText": w["ar"],
            "audioKey": w["audioKey"],
            "prompt": "Listen, then choose the word you hear.",
            "options": options(labels, w["ar"], correct_index),
            "explanation": f"You heard {w['ar']} ({w['translit']}), “{w['en']}”. Its twin {w2['ar']} ({w2['translit']}) means “{w2['en']}”.",
            "fr": {
                "prompt": fr("Écoutez, puis choisissez le mot que vous entendez."),
                "explanation": fr(f"Vous avez entendu {w['ar']} ({w['translit']}), « {w['fr']} ». Son jumeau {w2['ar']} ({w2['translit']}) signifie « {w2['fr']} »."),
            },
        },
    }

# Short vowels on the existing consonant x harakah grid.
CV = {  # ar: (letter slug, mark id, translit)
    "بَ": ("ba", "mrk:fatha", "ba"), "بِ": ("ba", "mrk:kasra", "bi"), "بُ": ("ba", "mrk:damma", "bu"),
    "مَ": ("mim", "mrk:fatha", "ma"), "مِ": ("mim", "mrk:kasra", "mi"), "مُ": ("mim", "mrk:damma", "mu"),
    "تَ": ("ta1", "mrk:fatha", "ta"), "تِ": ("ta1", "mrk:kasra", "ti"), "تُ": ("ta1", "mrk:damma", "tu"),
}
GRIDMARK = {"mrk:fatha": "fatha", "mrk:kasra": "kasra", "mrk:damma": "damma"}
VOWEL = {"mrk:fatha": ("fatḥah", "a", "a"), "mrk:kasra": ("kasrah", "i", "i"), "mrk:damma": ("ḍammah", "u", "ou")}
LONG_OF = {"mrk:fatha": ("mrk:madd-alif", "ا"), "mrk:kasra": ("mrk:madd-ya", "ي"), "mrk:damma": ("mrk:madd-waw", "و")}

def cv_audio(ar):
    s, mk, _ = CV[ar]
    key = f"grid/{s}-{GRIDMARK[mk]}"
    check(key in MANIFEST, f"audio key {key} missing")
    return key

def syl(sid):
    check(sid in SYLS, f"{sid} unknown")
    key = "syllables/" + sid.split(":")[1]
    check(key in MANIFEST, f"audio key {key} missing")
    return SYLS[sid], key

def vowel_item(heard, labels):
    s, mk, tl = CV[heard]
    name, v_en, v_fr = VOWEL[mk]
    return {
        "type": "exercise", "title": "Which vowel?", "fr": {"title": fr("Quelle voyelle ?")},
        "exercise": {
            "kind": "choice", "drillType": "minimal-pair", "skill": "listening",
            "objectIds": [mk] + [m for m in VOWEL if m != mk],
            "contrastPhonemes": ["mrk:fatha", "mrk:kasra", "mrk:damma"],
            "audioText": heard, "audioKey": cv_audio(heard),
            "prompt": "Listen. Which one did you hear?",
            "options": options(labels, heard, labels.index(heard)),
            "explanation": f"{heard} ({tl}): the {name} gives the “{v_en}” sound.",
            "fr": {"prompt": fr("Écoutez. Lequel avez-vous entendu ?"),
                   "explanation": fr(f"{heard} ({tl}) : la {name} donne le son « {v_fr} ».")},
        },
    }

def sukun_item(open_ar, sid, heard_closed, closed_first):
    s = CV[open_ar]
    mk = s[1]
    obj, key = syl(sid)
    closed_ar = obj["ar"]
    last = closed_ar.replace("ْ", "")[-1]
    heard = closed_ar if heard_closed else open_ar
    labels = [closed_ar, open_ar] if closed_first else [open_ar, closed_ar]
    if heard_closed:
        tl = obj["translit"].rstrip("-")
        en = f"{closed_ar} ({tl}): the sukūn closes the sound on {last}."
        frx = f"{closed_ar} ({tl}) : le sukūn ferme le son sur {last}."
        audio = key
    else:
        en = f"{open_ar} ({s[2]}) stays open: no sukūn, so it ends on the vowel."
        frx = f"{open_ar} ({s[2]}) reste ouvert : pas de sukūn, le son finit sur la voyelle."
        audio = cv_audio(open_ar)
    return {
        "type": "exercise", "title": "Open or closed?", "fr": {"title": fr("Ouvert ou fermé ?")},
        "exercise": {
            "kind": "choice", "drillType": "minimal-pair", "skill": "listening",
            "objectIds": ["mrk:sukun", mk, sid],
            "contrastPhonemes": [mk, "mrk:sukun"],
            "audioText": heard, "audioKey": audio,
            "prompt": "Listen. Which one did you hear?",
            "options": options(labels, heard, labels.index(heard)),
            "explanation": en,
            "fr": {"prompt": fr("Écoutez. Lequel avez-vous entendu ?"), "explanation": fr(frx)},
        },
    }

def length_item(short_ar, sid, heard_long, long_first):
    s, mk, tl = CV[short_ar]
    long_mark, lengthener = LONG_OF[mk]
    obj, key = syl(sid)
    long_ar = obj["ar"]
    check(long_ar.startswith(short_ar), f"{sid} {long_ar} does not extend {short_ar}")
    heard = long_ar if heard_long else short_ar
    labels = [long_ar, short_ar] if long_first else [short_ar, long_ar]
    if heard_long:
        en = f"{long_ar} ({obj['translit']}): the {lengthener} after the letter makes the vowel long."
        frx = f"{long_ar} ({obj['translit']}) : le {lengthener} après la lettre allonge la voyelle."
        audio = key
    else:
        en = f"{short_ar} ({tl}) is short: there is no {lengthener} after it to lengthen it."
        frx = f"{short_ar} ({tl}) est brève : aucun {lengthener} ne la suit pour l'allonger."
        audio = cv_audio(short_ar)
    return {
        "type": "exercise", "title": "Short or long?", "fr": {"title": fr("Brève ou longue ?")},
        "exercise": {
            "kind": "choice", "drillType": "minimal-pair", "skill": "listening",
            "objectIds": [long_mark if heard_long else mk, sid],
            "contrastPhonemes": [mk, long_mark],
            "audioText": heard, "audioKey": audio,
            "prompt": "Listen. Short or long?",
            "options": options(labels, heard, labels.index(heard)),
            "explanation": en,
            "fr": {"prompt": fr("Écoutez. Brève ou longue ?"), "explanation": fr(frx)},
        },
    }

def trace(letter_id):
    check(letter_id in LETTERS and LETTERS[letter_id].get("strokeOrder"), f"{letter_id}: no stroke data")
    return {"type": "trace-letter", "letterId": letter_id, "strokes": "fromLetter"}

def explain(title, title_fr, body, body_fr, preview=None):
    s = {"type": "explain", "title": title, "body": body,
         "fr": {"title": fr(title_fr), "body": [fr(b) for b in body_fr]}}
    if preview: s["previewSymbols"] = preview
    return s

def complete(title, title_fr, msg, msg_fr):
    return {"type": "complete", "title": title, "message": msg, "finishLabel": "Finish",
            "fr": {"title": fr(title_fr), "message": fr(msg_fr), "finishLabel": "Terminer"}}

AUDIO_NOTE = ("The audio uses your device's built-in voice. If two words sound the same to you, replay them: some device voices blur these sounds.",
              "L'audio utilise la voix intégrée de votre appareil. Si deux mots vous semblent identiques, réécoutez-les : certaines voix d'appareil estompent ces sons.")

def lesson(lid, unit, order, title, title_fr, blurb, blurb_fr, skills, objectives, steps):
    for o in objectives:
        check(o in KNOWN, f"{lid}: objective {o} unknown")
    L = {"id": lid, "unitId": unit, "curriculumLessonId": lid, "title": title, "level": "A0",
         "skills": skills, "objectives": objectives, "emphasisTag": "both",
         "fr": {"title": fr(title_fr)}, "steps": steps}
    node = {"id": lid, "unitId": unit, "order": order, "title": title, "blurb": blurb,
            "level": "A0", "skills": skills, "objectives": objectives, "status": "available",
            "source": f"steps:{lid}", "fr": {"title": fr(title_fr), "blurb": fr(blurb_fr)}}
    return L, node

LESSONS, NODES = [], []
def add(pair):
    LESSONS.append(pair[0]); NODES.append(pair[1])

# ---------------------------------------------------------------------------
# Unit 01 (app unit a0-u1) — hearing the hard contrasts, then tracing them
# ---------------------------------------------------------------------------
add(lesson("a0-sounds-throat", "a0-u1", 5, "Hear the Throat Sounds", "Entendre les sons de la gorge",
    "Tell ح from ه and ع from ء by ear in four real word pairs, then trace ح and ع.",
    "Distinguez ح de ه et ع de ء à l'oreille dans quatre paires de vrais mots, puis tracez ح et ع.",
    ["listening", "pronunciation", "writing"],
    ["let:ha1", "let:ha2", "let:ayn", "mrk:hamza"],
    [explain("Two h sounds and two throat sounds", "Deux « h » et deux sons de gorge",
        ["English has one “h”. Arabic has two. ه is the light h of “hello”. ح is stronger: tighten your throat and push the air through, like a loud, whispered “haa”.",
         "Arabic also has two sounds made by closing the throat. ء (hamza) is a quick catch, like the break in “uh-oh”. ع comes from the same tight place as ح, but with your voice switched on.",
         "You'll hear real Arabic words that differ only in their first sound. You don't need their meanings yet: just listen for that sound and pick its letter.",
         AUDIO_NOTE[0]],
        ["L'arabe a deux « h ». ه est un simple souffle, comme le h de l'anglais « hello ». ح est plus fort : serrez la gorge et poussez l'air, comme un « haa » chuchoté avec force.",
         "L'arabe a aussi deux sons produits en fermant la gorge. ء (hamza) est un petit coup de glotte, comme la coupure au milieu de « oh-oh ». ع vient du même endroit serré que ح, mais avec la voix.",
         "Vous allez entendre de vrais mots arabes qui ne diffèrent que par leur premier son. Inutile de connaître leur sens : écoutez ce son et choisissez sa lettre.",
         AUDIO_NOTE[1]],
        ["ح", "ه", "ع", "ء"]),
     letter_item("mp:ha1-ha2-haram", "let:ha1", 0),
     letter_item("mp:ayn-hamza-amal", "mrk:hamza", 1),
     letter_item("mp:ha1-ha2-habba", "let:ha2", 1),
     letter_item("mp:ayn-hamza-alima", "let:ayn", 0),
     letter_item("mp:ha1-ha2-haram", "let:ha2", 0),
     letter_item("mp:ayn-hamza-amal", "let:ayn", 1),
     letter_item("mp:ha1-ha2-habba", "let:ha1", 1),
     letter_item("mp:ayn-hamza-alima", "mrk:hamza", 0),
     trace("let:ha1"),
     trace("let:ayn"),
     complete("Your ear is tuning in", "Votre oreille s'affine",
        "You told ح from ه and ع from ء in four real word pairs, then wrote ح and ع. These sounds come back at every level.",
        "Vous avez distingué ح de ه et ع de ء dans quatre paires de vrais mots, puis écrit ح et ع. Ces sons reviennent à tous les niveaux.")]))

add(lesson("a0-sounds-heavy", "a0-u1", 6, "Heavy and Light Sounds", "Sons lourds et sons légers",
    "Hear ص, ط and ض against their light twins س, ت and د in five word pairs, then trace ص and ط.",
    "Entendez ص, ط et ض face à leurs jumeaux légers س, ت et د dans cinq paires de mots, puis tracez ص et ط.",
    ["listening", "pronunciation", "writing"],
    ["let:sad", "let:sin", "let:ta2", "let:ta1", "let:dad", "let:dal"],
    [explain("Three sounds with a heavy twin", "Trois sons et leur jumeau lourd",
        ["Three everyday sounds have a “heavy” twin in Arabic: ص is a heavy س, ط is a heavy ت, and ض is a heavy د.",
         "To make a heavy sound, say the light one while pulling the back of your tongue up and back. The sound gets deeper, and the vowel after it sounds darker. That darker vowel is often the easiest clue.",
         AUDIO_NOTE[0]],
        ["Trois sons courants ont un jumeau « lourd » en arabe : ص est un س lourd, ط est un ت lourd, et ض est un د lourd.",
         "Pour produire un son lourd, dites le son léger en tirant l'arrière de la langue vers le haut et vers l'arrière. Le son devient plus grave, et la voyelle qui suit paraît plus sombre. Cette voyelle plus sombre est souvent l'indice le plus facile.",
         AUDIO_NOTE[1]],
        ["ص", "س", "ط", "ت", "ض", "د"]),
     letter_item("mp:sad-sin-sayf", "let:sad", 0),
     letter_item("mp:ta2-ta1-taba", "let:ta1", 0),
     letter_item("mp:dad-dal-dalla", "let:dad", 1),
     letter_item("mp:sad-sin-sara", "let:sin", 1),
     letter_item("mp:ta2-ta1-tin", "let:ta2", 1),
     letter_item("mp:sad-sin-sayf", "let:sin", 0),
     letter_item("mp:dad-dal-dalla", "let:dal", 0),
     letter_item("mp:ta2-ta1-taba", "let:ta2", 1),
     letter_item("mp:sad-sin-sara", "let:sad", 0),
     letter_item("mp:ta2-ta1-tin", "let:ta1", 1),
     trace("let:sad"),
     trace("let:ta2"),
     complete("Heavy or light: you can hear it", "Lourd ou léger : vous l'entendez",
        "You told the heavy sounds ص ط ض from their light twins س ت د in five word pairs, then wrote ص and ط.",
        "Vous avez distingué les sons lourds ص ط ض de leurs jumeaux légers س ت د dans cinq paires de mots, puis écrit ص et ط.")]))

add(lesson("a0-sounds-back", "a0-u1", 7, "The Deep k, Then a Mixed Review", "Le k profond, puis une révision",
    "Hear ق against ك in two word pairs, trace both, then review every contrast from this unit.",
    "Entendez ق face à ك dans deux paires de mots, tracez-les, puis révisez tous les contrastes de l'unité.",
    ["listening", "pronunciation", "writing"],
    ["let:qaf", "let:kaf", "let:ha1", "let:ha2", "let:ayn", "mrk:hamza", "let:sad", "let:ta2", "let:dal"],
    [explain("Two kinds of k", "Deux sortes de k",
        ["ك is the k you already know. ق is made further back: raise the very back of your tongue against the uvula, the small soft flap hanging at the back of your mouth. It sounds deeper, almost like a knock.",
         "Like the heavy letters, ق darkens the vowel that follows it."],
        ["ك est le k que vous connaissez déjà. ق se prononce plus en arrière : levez le fond de la langue contre la luette, le petit lobe mou suspendu au fond de la bouche. Le son est plus grave, presque comme un coup frappé.",
         "Comme les lettres lourdes, ق assombrit la voyelle qui suit."],
        ["ق", "ك"]),
     letter_item("mp:qaf-kaf-qalb", "let:qaf", 0),
     letter_item("mp:qaf-kaf-qala", "let:kaf", 0),
     letter_item("mp:qaf-kaf-qalb", "let:kaf", 1),
     letter_item("mp:qaf-kaf-qala", "let:qaf", 1),
     trace("let:qaf"),
     trace("let:kaf"),
     explain("Mixed review", "Révision mélangée",
        ["Now pairs from the whole unit, mixed together. Same task: listen, then pick the first sound."],
        ["Voici maintenant des paires de toute l'unité, mélangées. Même consigne : écoutez, puis choisissez le premier son."]),
     letter_item("mp:ha1-ha2-haram", "let:ha2", 1),
     letter_item("mp:ayn-hamza-alima", "mrk:hamza", 1),
     letter_item("mp:ta2-ta1-tin", "let:ta2", 0),
     letter_item("mp:dad-dal-dalla", "let:dal", 1),
     letter_item("mp:sad-sin-sara", "let:sad", 1),
     letter_item("mp:ha1-ha2-habba", "let:ha1", 0),
     complete("All the hard contrasts, by ear", "Tous les contrastes difficiles, à l'oreille",
        "You can now hear the contrasts learners find hardest: ح/ه, ع/ء, ص/س, ط/ت, ض/د and ق/ك. They come back as soon as you start reading words.",
        "Vous entendez désormais les contrastes que les apprenants trouvent les plus difficiles : ح/ه, ع/ء, ص/س, ط/ت, ض/د et ق/ك. Ils reviennent dès que vous commencez à lire des mots.")]))

# ---------------------------------------------------------------------------
# Unit 02 (app units a0-u2 + a0-u3) — short vowels, sukun, length, word pairs
# ---------------------------------------------------------------------------
add(lesson("a0-hear-short-vowels", "a0-u2", 3, "Hear the Short Vowels", "Entendre les voyelles brèves",
    "Pick out fatḥah, kasrah and ḍammah by ear, then hear when a sukūn closes the sound.",
    "Reconnaissez à l'oreille la fatḥah, la kasrah et la ḍammah, puis entendez quand un sukūn ferme le son.",
    ["listening", "pronunciation"],
    ["mrk:fatha", "mrk:kasra", "mrk:damma", "mrk:sukun", "syl:cvc-ba", "syl:cvc-bi", "syl:cvc-mu", "syl:cvc-ti"],
    [explain("Listen for the vowel", "Écoutez la voyelle",
        ["A short-vowel mark changes the sound of its letter: بَ is “ba”, بِ is “bi”, بُ is “bu”. Here you only listen: hear a sound, then pick the letter with the matching mark.",
         "A sukūn (ـْ) means no vowel at all: the sound closes on that letter. بَ (ba) stays open; بَحْ (baḥ) closes on ح.",
         AUDIO_NOTE[0]],
        ["Une marque de voyelle brève change le son de sa lettre : بَ se lit « ba », بِ « bi », بُ « bou ». Ici, vous écoutez seulement : entendez un son, puis choisissez la lettre qui porte la bonne marque.",
         "Un sukūn (ـْ) signifie « pas de voyelle » : le son se ferme sur cette lettre. بَ (ba) reste ouvert ; بَحْ (baḥ) se ferme sur ح.",
         AUDIO_NOTE[1]],
        ["بَ", "بِ", "بُ", "بْ"]),
     vowel_item("بَ", ["بَ", "بِ", "بُ"]),
     vowel_item("مِ", ["مَ", "مُ", "مِ"]),
     vowel_item("تُ", ["تِ", "تُ", "تَ"]),
     vowel_item("بِ", ["بُ", "بِ", "بَ"]),
     vowel_item("مُ", ["مِ", "مَ", "مُ"]),
     vowel_item("تَ", ["تَ", "تِ", "تُ"]),
     explain("Open or closed?", "Ouvert ou fermé ?",
        ["Now listen for the ending: does the sound stay open on a vowel, or close with a sukūn?"],
        ["Écoutez maintenant la fin : le son reste-t-il ouvert sur une voyelle, ou se ferme-t-il avec un sukūn ?"]),
     sukun_item("بَ", "syl:cvc-ba", True, False),
     sukun_item("مُ", "syl:cvc-mu", False, False),
     sukun_item("تِ", "syl:cvc-ti", True, True),
     sukun_item("بِ", "syl:cvc-bi", False, True),
     complete("You can hear the vowels", "Vous entendez les voyelles",
        "You picked out fatḥah, kasrah and ḍammah by ear, and heard when a sukūn closes the sound.",
        "Vous avez reconnu à l'oreille la fatḥah, la kasrah et la ḍammah, et entendu quand un sukūn ferme le son.")]))

add(lesson("a0-hear-long-and-short", "a0-u3", 3, "Short or Long? Then Real Word Pairs", "Brève ou longue ? Puis de vraies paires de mots",
    "Hear short against long vowels, then read and choose real words that differ by a single sound.",
    "Entendez les voyelles brèves face aux longues, puis lisez et choisissez de vrais mots qui ne diffèrent que d'un son.",
    ["listening", "reading", "pronunciation"],
    ["mrk:madd-alif", "mrk:madd-ya", "mrk:madd-waw", "syl:cvv-ba", "syl:cvv-bu", "syl:cvv-mi", "syl:cvv-ta", "syl:cvv-tu",
     "let:ha1", "let:ha2", "let:ayn", "mrk:hamza", "let:qaf", "let:kaf"],
    [explain("Short or long", "Brève ou longue",
        ["A long vowel is held about twice as long as a short one: بَ (ba) and بَا (bā). The long vowels are written with ا, ي or و after the letter.",
         AUDIO_NOTE[0]],
        ["Une voyelle longue dure environ deux fois plus longtemps qu'une brève : بَ (ba) et بَا (bā). Les voyelles longues s'écrivent avec ا, ي ou و après la lettre.",
         AUDIO_NOTE[1]],
        ["بَ", "بَا", "بِي", "بُو"]),
     length_item("بَ", "syl:cvv-ba", True, False),
     length_item("مِ", "syl:cvv-mi", False, True),
     length_item("تُ", "syl:cvv-tu", True, True),
     length_item("بُ", "syl:cvv-bu", False, False),
     length_item("مِ", "syl:cvv-mi", True, False),
     length_item("تَ", "syl:cvv-ta", False, True),
     explain("Word pairs, now in writing", "Les paires de mots, maintenant à l'écrit",
        ["Earlier you picked only the first letter. Now you can read these words, so choose the whole word you hear.",
         "Each pair differs in its first sound only."],
        ["Tout à l'heure, vous choisissiez seulement la première lettre. Maintenant que vous savez lire ces mots, choisissez le mot entier que vous entendez.",
         "Chaque paire ne diffère que par son premier son."]),
     word_item("mp:ha1-ha2-haram", "let:ha1", 0),
     word_item("mp:qaf-kaf-qalb", "let:kaf", 1),
     word_item("mp:ayn-hamza-amal", "mrk:hamza", 1),
     word_item("mp:ayn-hamza-alima", "let:ayn", 0),
     word_item("mp:ha1-ha2-haram", "let:ha2", 1),
     word_item("mp:qaf-kaf-qalb", "let:qaf", 0),
     word_item("mp:ayn-hamza-amal", "let:ayn", 0),
     word_item("mp:ayn-hamza-alima", "mrk:hamza", 1),
     complete("Short, long, and real words", "Brèves, longues et vrais mots",
        "You heard the difference between short and long vowels, then read and chose real words that differ by a single sound.",
        "Vous avez entendu la différence entre voyelles brèves et longues, puis lu et choisi de vrais mots qui ne diffèrent que d'un seul son.")]))

# Unit 02 word-level pairs must be readable with short vowels + sukūn only
# (long vowels and shadda are taught in a0-u3's syllables-intro, spec Unit 03).
for L in LESSONS:
    if L["id"] == "a0-hear-long-and-short":
        for s in L["steps"]:
            ex = s.get("exercise") or {}
            if ex.get("prompt", "").startswith("Listen, then choose the word"):
                for o in ex["options"]:
                    check(not re.search("[ّاوي]", o["label"].replace("أ", "")),
                          f"word option {o['label']} needs long vowels/shadda (not taught yet)")

# ---------------------------------------------------------------------------
# Proposed additive objects + letter tracing metadata
# ---------------------------------------------------------------------------
hamza = {"id": "mrk:hamza", "kind": "mark", "symbol": "ء", "ar": "ء", "translit": "ʾ", "name": "hamzah",
         "markClass": "hamza",
         "fn": "A quick catch in the throat, like the break in “uh-oh”. Often written on a seat letter: أ إ ؤ ئ.",
         "fr": {"fn": fr("Un petit coup de glotte, comme la coupure au milieu de « oh-oh ». Souvent écrit sur une lettre support : أ إ ؤ ئ.")},
         "level": "A0", "skills": ["reading", "pronunciation"], "prereqs": ["let:alif"]}

# Dots, transcribed from index.html's LETTER_DOT_NOTES (M12) into structured form.
DOTS = {"ba": (1, "below"), "ta1": (2, "above"), "tha": (3, "above"), "jim": (1, "below"),
        "kha": (1, "above"), "dhal": (1, "above"), "zay": (1, "above"), "shin": (3, "above"),
        "dad": (1, "above"), "za2": (1, "above"), "ghayn": (1, "above"), "fa": (1, "above"),
        "qaf": (2, "above"), "nun": (1, "above"), "ya": (2, "below")}
index_html = open(os.path.join(REPO, "index.html"), encoding="utf-8").read()
m = re.search(r"const LETTER_DOT_NOTES = \{(.*?)\};", index_html, re.S)
for k, cnt, pos in re.findall(r'(\w+): "It has (\d) dots? (above|below)', m.group(1)):
    check(DOTS.get(k) == (int(cnt), pos), f"dots for {k} disagree with LETTER_DOT_NOTES")
check(len(re.findall(r'(\w+): "It has', m.group(1))) == len(DOTS), "dot count mismatch vs LETTER_DOT_NOTES")

tracing = []
for lid, L in LETTERS.items():
    s = lid.split(":")[1]
    d = DOTS.get(s)
    tracing.append({"letterId": lid, "ar": L["ar"], "strokeCount": len(L["strokeOrder"]),
                    "strokeSource": "content/letters.json#strokeOrder",
                    "dots": {"count": d[0], "position": d[1], **({"form": "isolated"} if s == "ya" else {})} if d else None,
                    "phases": ["watch", "trace", "write"]})

# ---------------------------------------------------------------------------
# Checks across items
# ---------------------------------------------------------------------------
for L in LESSONS:
    for s in L["steps"]:
        ex = s.get("exercise")
        if not ex: continue
        check(sum(o["correct"] for o in ex["options"]) == 1, f"{L['id']}: item needs exactly one correct option")
        check(any(o["label"] == ex["audioText"] and o["correct"] for o in ex["options"]) or ex.get("pairRef"),
              f"{L['id']}: audio does not match the correct option")
        for oid in ex["objectIds"] + ex["contrastPhonemes"]:
            check(oid in KNOWN, f"{L['id']}: {oid} unknown")
        k = ex["audioKey"]
        check(k in MANIFEST or k.startswith("pairs/"), f"{L['id']}: audio key {k} unknown")
        if ex.get("pairRef"):
            w = WORD[(ex["pairRef"]["pairId"], ex["pairRef"]["heard"])]
            check(ex["audioText"] == w["ar"], f"{L['id']}: audioText != heard word")

zeros = correct_positions.count(0)
check(0.35 <= zeros / len(correct_positions) <= 0.65, f"correct answer sits first in {zeros}/{len(correct_positions)} items")

# every pair member is heard somewhere in Unit 01
heard = {(s["exercise"]["pairRef"]["pairId"], s["exercise"]["pairRef"]["heard"])
         for L in LESSONS[:3] for s in L["steps"] if s.get("exercise", {}).get("pairRef")}
check(heard == set(WORD), f"Unit 01 misses pair members: {set(WORD) - heard}")

if errors:
    print("\n".join("ERROR: " + e for e in errors)); sys.exit(1)

# ---------------------------------------------------------------------------
# Write
# ---------------------------------------------------------------------------
def dump(rel, obj):
    p = os.path.join(OUT, rel)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2); f.write("\n")

META = "M28 seed — draft for review, NOT wired into tools/build-content.js. See m28_emphasis_layer_scope.md."
dump("minimal-pairs.json", {"_meta": {"status": META,
     "source": "docs/MASTER_CURRICULUM_SPEC.md §4 (as corrected by decisions 1-5).",
     "quranic": "`ref` is surah:ayah; `form` is the word exactly as it occurs there (often inflected). Every ref must be checked against a muṣḥaf before shipping (ROADMAP standing rule 1).",
     "frequencyRank": "null throughout: no sourced frequency list yet. Never estimated."},
     "pairs": pair_objs})
dump("proposed-objects.json", {"_meta": {"status": META,
     "why": "ع/ء needs a learning object for the hamza sound; none exists (hamza is only mentioned in the M20.9 alif diagram caption). Additive to content/marks.json."},
     "marks": [hamza]})
dump("letter-tracing.json", {"_meta": {"status": META,
     "why": "Stroke geometry already lives in content/letters.json (M12) and is reused, not copied. New here: dots as structured data (transcribed from index.html LETTER_DOT_NOTES), proposed as an additive `dots` field on letters.json. Dot-writing order stays out of scope, as in M12."},
     "letters": tracing})
dump("curriculum-nodes.json", {"_meta": {"status": META,
     "why": "Appended to content/curriculum.json `lessons` at implementation. Orders follow each unit's existing lessons; no existing node is renumbered."},
     "lessons": NODES})
for L in LESSONS:
    dump(f"lessons/{L['id']}.json", L)

items = sum(1 for L in LESSONS for s in L["steps"] if s.get("exercise"))
traces = sum(1 for L in LESSONS for s in L["steps"] if s["type"] == "trace-letter")
print(f"OK: {len(pair_objs)} pairs, {len(LESSONS)} lessons, {items} drill items, {traces} tracing steps, "
      f"{len(tracing)} letters; correct-first {zeros}/{len(correct_positions)}")
