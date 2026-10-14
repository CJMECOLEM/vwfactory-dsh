// Gumloop integration tests: runs plugin/index.js against mock Gumloop + OpenRouter servers.
// Usage: node tests/gumloop.test.mjs [path/to/index.js]
import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";
import * as os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(process.argv[2] ?? path.join(here, "..", "plugin", "index.js"));

const results = [];
const ok = (name, cond, info = "") => { results.push({ name, pass: !!cond, info }); console.log(`${cond ? "PASS" : "FAIL"}  ${name}${info ? "  — " + info : ""}`); };

// ---------- mock Gumloop (models + chat) and OpenRouter (prices) ----------
const seen = [];
let chatMode = "ok";
const opt = (value, extra = {}) => ({ value, label: value.toUpperCase(), status: "active", restricted: false, metadata: { capabilities: ["functions", "vision"], context_window: 1000000 }, ...extra });
const MODELS = { model_groups: [
  { groupLabel: "Auto", options: [opt("gumloop-chew")] },
  { groupLabel: "Anthropic", options: [
    opt("claude-sonnet-5-5", { metadata: { capabilities: ["functions", "vision"], context_window: 1000000, short_context_window: 300000 } }),
    opt("claude-opus-5-5"),
    opt("claude-opus-4-8", { status: "hidden" }),
    opt("claude-3-7-sonnet-latest", { status: "retired" })
  ] },
  { groupLabel: "OpenAI", options: [opt("gpt-6-sol", { metadata: { capabilities: ["functions", "reasoning"], context_window: 272000 } })] },
  { groupLabel: "Fireworks", options: [opt("accounts/fireworks/models/glm-5p3", { metadata: { capabilities: ["functions", "reasoning"] } })] },
  { groupLabel: "TypeSafe", options: [opt("typesafe/jev-1", { metadata: { capabilities: ["decisions"] } }), opt("x/classifier", { is_classifier_model: true })] }
] };
const sse = (o) => `data: ${JSON.stringify(o)}\n\n`;
const BIG_USAGE = { prompt_tokens: 100000, completion_tokens: 5000, total_tokens: 105000, prompt_tokens_details: { cached_tokens: 60000, cache_write_tokens: 20000 } };
const mock = http.createServer(async (req, res) => {
  const parts = [];
  for await (const c of req) parts.push(c);
  const raw = Buffer.concat(parts).toString("utf8");
  const auth = req.headers.authorization ?? "";
  const user = req.headers["x-auth-key"] ?? "";
  if (req.url.startsWith("/gl/models")) {
    if (auth !== "Bearer glkey-AAAAAAAAAAAAAAAAAAAA" && auth !== "Bearer glkey-BBBBBBBBBBBBBBBBBBBB") { res.writeHead(403).end('{"error":"forbidden"}'); return; }
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(MODELS));
    return;
  }
  if (req.url.startsWith("/ws/chat/completions")) {
    const body = JSON.parse(raw || "{}");
    seen.push({ headers: req.headers, body, auth, user });
    if (body.model === "claude-sonnet-5-5" && body.max_tokens > 128000) {
      res.writeHead(400, { "Content-Type": "application/json" }).end(JSON.stringify({ error: { code: "provider_error", message: `The provider rejected the request: max_tokens: ${body.max_tokens} > 128000, which is the maximum allowed number of output tokens for claude-sonnet-5-5` } }));
      return;
    }
    if (chatMode === "creditsA" && auth.includes("AAAA")) {
      res.writeHead(403, { "Content-Type": "application/json" }).end('{"error":"credit_limit_exceeded","message":"You have reached your credit limit."}');
      return;
    }
    if (body.stream) {
      res.writeHead(200, { "Content-Type": "text/event-stream; charset=utf-8" });
      const frames = sse({ id: "c1", model: body.model, choices: [{ index: 0, delta: { role: "assistant", content: "Hi" } }] })
        + sse({ id: "c1", model: body.model, choices: [{ index: 0, delta: {}, finish_reason: "stop" }] })
        + sse({ id: "c1", model: body.model, choices: [], usage: BIG_USAGE })
        + "data: [DONE]\n\n";
      const cut = Math.floor(frames.length / 2); // split mid-frame to exercise buffering
      res.write(frames.slice(0, cut));
      setTimeout(() => res.end(frames.slice(cut)), 5);
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({
      id: "c2", model: body.model, choices: [{ index: 0, message: { role: "assistant", content: "Hello" }, finish_reason: "stop" }],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
    }));
    return;
  }
  if (req.url === "/or/models") {
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ data: [
      { id: "anthropic/claude-sonnet-5.5", pricing: { prompt: "0.000002", completion: "0.00001", input_cache_read: "0.0000001", input_cache_write: "0.0000025",
        overrides: [{ min_prompt_tokens: 200000, prompt: "0.000004", completion: "0.00002", input_cache_read: "0.0000002", input_cache_write: "0.000005" }] } },
      { id: "openai/gpt-6-sol", pricing: { prompt: "0.000002", completion: "0.00001", input_cache_read: "0.0000002" } },
      { id: "z-ai/glm-5.3", pricing: { prompt: "0.000000079", completion: "0.0000048" } }
    ] }));
    return;
  }
  if (req.url === "/or/models/z-ai/glm-5.3/endpoints") {
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ data: { endpoints: [
      { provider_name: "Wafer", pricing: { prompt: "0.000000079", completion: "0.0000048" } },
      { provider_name: "Fireworks", pricing: { prompt: "0.0000021", completion: "0.0000066" } },
      { provider_name: "Fireworks", pricing: { prompt: "0.0000014", completion: "0.0000044", input_cache_read: "0.00000026" } }
    ] } }));
    return;
  }
  res.writeHead(404).end("{}");
});
await new Promise((r) => mock.listen(0, "127.0.0.1", r));
const M = `http://127.0.0.1:${mock.address().port}`;
process.env.VWFACTORY_GUMLOOP_API = `${M}/gl`;
process.env.VWFACTORY_GUMLOOP_WS = `${M}/ws`;
process.env.VWFACTORY_OPENROUTER_API = `${M}/or`;
process.env.VWFACTORY_PLAIN_SECRETS = "1";

const src = fs.readFileSync(target, "utf8").replace(/export \{\s*apply,/, "export { FactoryProxy, FileStore, syncPatchModels, gumloopUsageCost, apply,");
const modPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "vwf-gl-test-")), "under-test.mjs");
fs.writeFileSync(modPath, src);
const { FactoryProxy, FileStore, syncPatchModels, gumloopUsageCost } = await import(pathToFileURL(modPath).href + "?" + Date.now());

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "vwf-gl-store-"));
const store = new FileStore(dir);
await store.ready;
const PORT = 4297;
let synced = 0;
const proxy = new FactoryProxy(store, () => ({ get: (k, d) => (k === "vwFactory.proxy.port" ? PORT : k === "vwFactory.proxy.requireAuth" ? false : d) }), { syncModels: async () => { synced++; return true; } });
await proxy.start();
const P = `http://127.0.0.1:${PORT}`;
const post = async (p, body) => { const r = await fetch(P + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) }); return [r.status, await r.json().catch(() => ({}))]; };
const chat = async (body) => { const r = await fetch(P + "/gumloop/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer LOCAL-PROXY-TOKEN" }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) }); return [r.status, await r.text()]; };
const glState = async () => (await (await fetch(P + "/api/state")).json()).gumloop;

// 1. no account -> 503
{
  const [s, t] = await chat({ model: "claude-sonnet-5-5", messages: [{ role: "user", content: "hi" }] });
  ok("1 no Gumloop account -> 503", s === 503 && /Gumloop/.test(t), `${s}`);
}
// 2. add: bad key rejected, good key stored + models filtered
{
  const [s1, r1] = await post("/api/gumloop/add", { apiKey: "glkey-ZZZZZZZZZZZZZZZZZZZZ", userId: "userAAAA1111" });
  ok("2 bad key rejected", s1 === 400 && /rejected/.test(r1.error), `${s1} ${r1.error}`);
  const [s2, r2] = await post("/api/gumloop/add", { apiKey: "glkey-AAAAAAAAAAAAAAAAAAAA", userId: "userAAAA1111", label: "Main" });
  ok("2 good key added + models synced", s2 === 200 && r2.modelsChanged === true && synced === 1, JSON.stringify(r2));
  const ids = proxy.gumloop.models().map((m) => m.id);
  ok("2 models filtered (no auto/hidden/retired/classifier/decisions)", JSON.stringify(ids) === JSON.stringify(["claude-sonnet-5-5", "claude-opus-5-5", "gpt-6-sol", "accounts/fireworks/models/glm-5p3"]), ids.join(","));
  const sonnet = proxy.gumloop.models()[0];
  const opus = proxy.gumloop.models()[1];
  ok("2 short context window preferred; opus gets reasoning", sonnet.context === 300000 && !sonnet.reasoning && opus.reasoning, JSON.stringify({ sonnet, opus }));
  const sec = await store.secret(r2.id);
  const stateText = fs.readFileSync(path.join(dir, "state.json"), "utf8");
  ok("2 key only in secrets, not state.json", sec.glKey === "glkey-AAAAAAAAAAAAAAAAAAAA" && !stateText.includes("glkey-AAAA"), r2.id);
}
// 3. streaming relay: auth headers, body normalisation, usage charged
{
  seen.length = 0;
  const [s, t] = await chat({ model: "claude-sonnet-5-5", stream: true, max_completion_tokens: 50, store: true, reasoning_effort: "high", messages: [{ role: "user", content: "hi" }] });
  const up = seen[0];
  ok("3 stream relayed intact", s === 200 && t.includes('"content":"Hi"') && t.includes("[DONE]"), `${s}`);
  ok("3 Gumloop auth headers; local token not forwarded", up.auth === "Bearer glkey-AAAAAAAAAAAAAAAAAAAA" && up.user === "userAAAA1111" && !JSON.stringify(up.headers).includes("LOCAL-PROXY-TOKEN"), up.auth);
  ok("3 body normalised", up.body.stream_options?.include_usage === true && up.body.max_tokens === 50 && up.body.max_completion_tokens === undefined && up.body.store === undefined && up.body.reasoning?.effort === "high" && up.body.reasoning_effort === undefined, JSON.stringify(up.body));
  const acc = (await glState()).accounts[0];
  // fallback sonnet price [2,10,0.1,2.5]: fresh 20k*2 + read 60k*0.1 + write 20k*2.5 + out 5k*10 = 146000/1e6 = $0.146 -> 29.2 -> 30 credits
  ok("3 stream usage billed (cache read/write, ceil)", acc.last?.credits === 30 && acc.last?.cr === 60000 && acc.last?.cw === 20000 && acc.month.credits === 30, JSON.stringify(acc.last));
}
// 4. non-stream: tiny call still costs 1 credit
{
  const [s] = await chat({ model: "claude-sonnet-5-5", max_tokens: 5, messages: [{ role: "user", content: "hi" }] });
  const acc = (await glState()).accounts[0];
  ok("4 non-stream tiny call -> 1 credit (per-call ceil)", s === 200 && acc.last?.credits === 1 && acc.month.calls === 2 && acc.month.credits === 31, JSON.stringify(acc.month));
}
// 5. calibration
{
  const id = (await glState()).accounts[0].id;
  const [s0] = await post("/api/gumloop/calibrate", { id, balance: -5 });
  const [s1, r1] = await post("/api/gumloop/calibrate", { id, balance: "7142", allowance: 20000 });
  const a1 = r1.state?.accounts?.[0];
  await chat({ model: "claude-sonnet-5-5", max_tokens: 5, messages: [{ role: "user", content: "hi" }] });
  const a2 = (await glState()).accounts[0];
  ok("5 calibrate validates + anchors", s0 === 400 && s1 === 200 && a1.remaining === 7142 && a1.spentSinceCalibration === 0, JSON.stringify(a1));
  ok("5 calls after calibration are subtracted", a2.remaining === 7141 && a2.spentSinceCalibration === 1, `${a2.remaining}`);
}
// 6. credit limit -> switch to second account, mark exhausted
{
  const [s0] = await post("/api/gumloop/add", { apiKey: "glkey-BBBBBBBBBBBBBBBBBBBB", userId: "userBBBB2222", label: "Spare" });
  chatMode = "creditsA";
  seen.length = 0;
  const notes = [];
  const sub = proxy.onDidAutoSwitch((m) => notes.push(m));
  const [s, t] = await chat({ model: "claude-sonnet-5-5", max_tokens: 5, messages: [{ role: "user", content: "hi" }] });
  const st = await glState();
  const a = st.accounts.find((x) => x.label === "Main");
  const b = st.accounts.find((x) => x.label === "Spare");
  ok("6 credit limit -> retried on second account", s0 === 200 && s === 200 && seen.length === 2 && seen[1].auth.includes("BBBB") && t.includes("Hello"), `${s} attempts=${seen.length}`);
  ok("6 exhausted account flagged, balance 0, active switched", a.exhaustedAt && a.remaining === 0 && b.active && b.month.calls === 1 && notes.some((n) => /out of credits/.test(n)), JSON.stringify({ a: [a.exhaustedAt, a.remaining], b: [b.active, b.month.calls] }));
  // all exhausted / failing -> error passes through
  await post("/api/gumloop/switch", { id: a.id });
  seen.length = 0;
  const [s2] = await chat({ model: "claude-sonnet-5-5", max_tokens: 5, messages: [{ role: "user", content: "hi" }] });
  ok("6 exhausted account skipped up front next time", s2 === 200 && seen.length === 1 && seen[0].auth.includes("BBBB"), `attempts=${seen.length}`);
  // after 12h the exhausted mark expires and the account is tried again
  store.state.gumloop.ledger[a.id].exhaustedAt = Date.now() - 13 * 36e5;
  ok("6 exhausted mark expires after 12h", proxy.gumloop.usable(store.state.gumloop.accounts.find((x) => x.id === a.id)) === true);
  chatMode = "ok";
  void sub;
}
// 6b. DSH sends the slash-free alias; upstream gets the real Gumloop id
{
  seen.length = 0;
  const [s] = await chat({ model: "glm-5p3", max_tokens: 5, messages: [{ role: "user", content: "hi" }] });
  const last = (await glState()).accounts.find((x) => x.active).last;
  ok("6b alias mapped back to full Gumloop id (upstream + ledger)", s === 200 && seen[0]?.body.model === "accounts/fireworks/models/glm-5p3" && last.model === "accounts/fireworks/models/glm-5p3", seen[0]?.body.model);
}
// 6c. output cap learned from a 400 and applied up front afterwards
{
  seen.length = 0;
  const [s] = await chat({ model: "claude-sonnet-5-5", max_tokens: 256000, messages: [{ role: "user", content: "hi" }] });
  const first = seen.map((x) => x.body.max_tokens);
  seen.length = 0;
  const [s2] = await chat({ model: "claude-sonnet-5-5", max_tokens: 256000, messages: [{ role: "user", content: "hi" }] });
  ok("6c max_tokens over model cap -> clamped + retried, then clamped up front", s === 200 && JSON.stringify(first) === "[256000,128000]" && s2 === 200 && seen.length === 1 && seen[0].body.max_tokens === 128000, `${first} / ${seen.map((x) => x.body.max_tokens)}`);
}
// 7. live prices: Fireworks endpoint price, long-context override
{
  await proxy.gumloop.refreshPrices(true);
  const tb = store.state.gumloop.prices.table;
  ok("7 Fireworks model priced at cheapest Fireworks endpoint (not cheapest host)", JSON.stringify(tb["accounts/fireworks/models/glm-5p3"]?.p) === JSON.stringify([1.4, 4.4, 0.26, null]), JSON.stringify(tb["accounts/fireworks/models/glm-5p3"]));
  const e = proxy.gumloop.priceEntry("claude-sonnet-5-5");
  const small = gumloopUsageCost(e, { prompt_tokens: 100000, completion_tokens: 0 });
  const big = gumloopUsageCost(e, { prompt_tokens: 250000, completion_tokens: 0 });
  ok("7 long-context override applies to whole request", e.source === "live" && Math.abs(small.usd - 0.2) < 1e-9 && Math.abs(big.usd - 1.0) < 1e-9, `${small.usd} ${big.usd}`);
  ok("7 unknown model -> no price (not guessed)", proxy.gumloop.priceEntry("made-up-model") === undefined);
}
// 8. DSH patch block
{
  const patch = path.join(dir, "patch.yml");
  fs.writeFileSync(patch, "- id: llm-pi-ai\n  config:\n    providers:\n      old: {}\n- id: next-plugin\n  config: {}\n");
  syncPatchModels(patch, [], proxy.gumloop.patchEntries());
  const y = fs.readFileSync(patch, "utf8");
  ok("8 gumloop provider block written", /      gumloop:\n        displayName: Gumloop\n[\s\S]*baseURL: http:\/\/127\.0\.0\.1:4199\/gumloop\/v1\n        compat:\n          thinkingFormat: openrouter/.test(y) && y.includes("- id: next-plugin"), "");
  ok("8 model entries quoted, slash-free alias, vision/context/reasoning set", y.includes('- id: "glm-5p3"') && !y.includes("accounts/fireworks") && /id: "claude-sonnet-5-5"\n            name: "CLAUDE-SONNET-5-5"\n            input: \[text, image\]\n            contextWindow: 300000\n/.test(y) && /id: "gpt-6-sol"[\s\S]*?reasoningEfforts: \{ off: null/.test(y), "");
  // removing every account drops the group
  for (const a of (await glState()).accounts) await post("/api/gumloop/remove", { id: a.id });
  syncPatchModels(patch, [], proxy.gumloop.patchEntries());
  const y2 = fs.readFileSync(patch, "utf8");
  ok("8 no accounts -> no gumloop group; secrets removed", !y2.includes("gumloop:") && Object.keys(store.secrets).every((k) => !k.startsWith("gl-")), "");
}

await proxy.stop();
mock.close();
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
