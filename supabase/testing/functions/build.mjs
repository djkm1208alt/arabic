import * as esbuild from "esbuild";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const HERE = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.resolve(HERE, "../../.."); // supabase/testing/functions -> repo root

const denoShim = `
globalThis.Deno = {
  serve: (handler) => { globalThis.__handler = handler; },
  env: { get: (k) => process.env[k] },
};
`;

// esbuild's --alias rejects specifiers with "=" / "?" (query strings), which
// the esm.sh imports use — so redirect them via an onResolve plugin instead,
// matched on the exact import string as it appears in the source.
const denoRedirectPlugin = {
  name: "deno-esm-redirect",
  setup(build) {
    build.onResolve({ filter: /^https:\/\/esm\.sh\/@supabase\/supabase-js@2$/ }, () => ({
      path: require.resolve("@supabase/supabase-js"),
    }));
    build.onResolve({ filter: /^https:\/\/esm\.sh\/stripe@14\?target=deno$/ }, () => ({
      path: path.join(HERE, "stripe-test-wrapper.mjs"),
    }));
  },
};

export async function bundleFunction(name) {
  const entry = path.join(REPO, "supabase/functions", name, "index.ts");
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    format: "cjs",
    write: false,
    banner: { js: denoShim },
    plugins: [denoRedirectPlugin],
    absWorkingDir: HERE, // so node_modules resolution finds this dir's deps
  });
  return result.outputFiles[0].text;
}
