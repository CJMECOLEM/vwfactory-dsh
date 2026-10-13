// Locale checks for plugin/client.js: zh/en have the same keys and no key is dead.
// Usage: node tests/i18n.test.mjs
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(process.argv[2] ?? path.join(here, "..", "plugin", "client.js"), "utf8");
const zhBlock = src.slice(src.indexOf("const zh = {"), src.indexOf("const en = {"));
const enBlock = src.slice(src.indexOf("const en = {"), src.indexOf("const fmt ="));
const keysOf = (b) => [...b.matchAll(/^\s*(\w+):/gm)].map((m) => m[1]);
const zh = keysOf(zhBlock);
const en = keysOf(enBlock);
const body = src.slice(src.indexOf("const fmt ="));
// t("key") calls, plus keys passed around as string literals (t(k) over arrays / maps).
const referenced = new Set([...body.matchAll(/["'](\w+)["']/g)].map((m) => m[1]));

const problems = [];
const dead = zh.filter((k) => !referenced.has(k));
const onlyZh = zh.filter((k) => !en.includes(k));
const onlyEn = en.filter((k) => !zh.includes(k));
if (dead.length) problems.push(`unused keys: ${dead.join(", ")}`);
if (onlyZh.length) problems.push(`missing in en: ${onlyZh.join(", ")}`);
if (onlyEn.length) problems.push(`missing in zh: ${onlyEn.join(", ")}`);
if (problems.length) {
  for (const p of problems) console.log(`FAIL  ${p}`);
  process.exit(1);
}
console.log(`PASS  ${zh.length} locale keys, zh/en in sync, none unused`);
