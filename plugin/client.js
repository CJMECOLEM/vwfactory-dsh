// vwFactory - DSH web client half (browser side).
// Loaded by @deepseek-ai/dsh-client-modules via package.json "dsh.client" + exports["./client"].
// Registers a native "Factory 账号" section in DSH Settings. Data flows through
// the DSH-authenticated route POST api/vwfactory.rpc (registered by index.js),
// so the local proxy token never reaches the browser.
window.__ModuleLoader__.load({
	id: "dsh-vwfactory",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const React = require("react");
		const h = React.createElement;
		const { useState, useEffect, useCallback, useRef } = React;

		const RPC_ROUTE = "api/vwfactory.rpc";
		const DASHBOARD_URL = "http://127.0.0.1:4199/";
		const NS = "settings.vwfactory";

		// ---------- copy ----------
		const zh = {
			nav: "Factory 账号",
			title: "Factory 账号",
			intro: "vwFactory 多账号管理：额度、切换与自动切号。请求经 DSH 认证后由本机代理 127.0.0.1:4199 处理。",
			accounts: "{n} 个账号",
			updatedAt: "额度更新于 {t}",
			refreshAll: "刷新额度",
			refreshing: "刷新中…",
			add: "添加账号",
			cancel: "取消",
			openExternal: "在浏览器中打开",
			autoSwitch: "自动切号",
			autoSwitchHint: "当前账号返回 401/402/403/429 时，自动切到额度占用最低的其它账号重试。",
			storeWarn: "vwFactory 数据文件提示（原文件均已保留，未删除）：",
			routing: "分配方式",
			routingHint: "单账号：所有对话都用当前账号，出错或额度用满时才切换。均衡：每个对话固定在一个账号上（保留缓存），新对话分给剩余额度最多的账号，账号用到 90% 时把对话迁走。",
			modeSingle: "单账号",
			modeBalance: "均衡",
			modeChanged: "分配方式：{m}",
			pillBalance: "Factory 均衡",
			balanceLeft: "平均剩余 {p}%",
			sessionsN: "{n} 个对话",
			cooling: "冷却中",
			allAccounts: "全部账号 ({n})",
			alertQuota: "{name} 主额度（{w}）已用 {p}%",
			alertFull: "{name} 主额度（{w}）已用完{r}",
			alertFullReset: "，{d}",
			alertRecover: "{name} 主额度已恢复，当前已用 {p}%",
			alertSwitch: "{from} 不可用（{reason}），已切换到 {to}",
			alertSwitchBalance: "{from} 不可用（{reason}），对话已改用 {to}",
			reasonQuota: "额度已满",
			active: "使用中",
			idle: "待命",
			switch: "切换",
			refresh: "刷新",
			copyKey: "复制 Key",
			remove: "删除",
			confirmRemove: "确认删除？",
			std: "主额度",
			core: "副额度",
			w5h: "5 小时",
			wWeek: "周",
			wMonth: "月",
			resets: "{t} 重置",
			resetIn: "{d}后重置",
			resetSoon: "即将重置",
			uMin: "{n} 分钟",
			uHour: "{n} 小时",
			uDay: "{n} 天",
			used: "已用",
			usedPct: "已用 {p}%",
			leftPct: "剩余 {p}%",
			pillUsed: "Factory 已用",
			w5hShort: "5h",
			pillOffline: "Factory 未连接",
			pillLoading: "Factory …",
			pillNoActive: "Factory 无账号",
			pillQuotaError: "Factory 额度获取失败",
			pillNoQuota: "Factory 暂无额度",
			tabTitle: "Factory 额度",
			guideDesc: "常驻查看账号额度",
			paneTitle: "Factory 额度",
			justNow: "刚刚更新",
			minAgo: "{n} 分钟前",
			hourAgo: "{n} 小时前",
			noActive: "当前没有使用中的账号",
			others: "其它账号 ({n})",
			stdHint: "主额度：全模型通用，优先消耗",
			coreHint: "副额度：开源模型 (Core) 专用池，主额度用尽后启用",
			noQuota: "暂无额度数据，点击「刷新」获取。",
			quotaError: "额度获取失败：{e}",
			empty: "还没有账号。点击「添加账号」，按 邮箱----fk-Key 每行一个填入。",
			addTitle: "批量添加账号",
			addHint: "每行一个，格式：邮箱----fk-xxxx。Key 仅保存在本机 ~/.vwFactory/secrets.json，并用你的 Windows 账户加密。",
			orgId: "组织 ID（可选）",
			submit: "添加",
			adding: "添加中…",
			addResult: "成功 {ok} 个，失败 {fail} 个",
			badFormat: "请按 邮箱----Key 格式填写",
			switched: "已切换到 {name}",
			removed: "已删除 {name}",
			copied: "已复制 {name} 的 邮箱----Key",
			autoOn: "自动切号已开启",
			autoOff: "自动切号已关闭",
			models: "可用模型",
			modelsHint: "仅显示已在当前账号上验证可用的模型；倍率为相对计费系数。",
			search: "搜索模型…",
			noModels: "没有匹配的模型",
			loading: "加载中…",
			offline: "无法连接 vwFactory：{e}",
			retry: "重试",
			plan: "套餐 {p}",
			balance: "额外余额 ${v}"
		};
		const en = {
			nav: "Factory accounts",
			title: "Factory accounts",
			intro: "vwFactory multi-account management: quota, switching and failover. Calls are authenticated by DSH and served by the local proxy at 127.0.0.1:4199.",
			accounts: "{n} accounts",
			updatedAt: "Quota updated {t}",
			refreshAll: "Refresh quota",
			refreshing: "Refreshing…",
			add: "Add accounts",
			cancel: "Cancel",
			openExternal: "Open in browser",
			autoSwitch: "Auto failover",
			autoSwitchHint: "On 401/402/403/429, switch to the account with the lowest quota usage and retry.",
			storeWarn: "vwFactory data file notices (original files were kept):",
			routing: "Routing",
			routingHint: "Single: every conversation uses the active account; switch only on errors or full quota. Balance: each conversation sticks to one account (keeps its cache); new conversations go to the account with the most quota left and move away at 90%.",
			modeSingle: "Single",
			modeBalance: "Balance",
			modeChanged: "Routing: {m}",
			pillBalance: "Factory balance",
			balanceLeft: "avg {p}% left",
			sessionsN: "{n} chats",
			cooling: "Cooling down",
			allAccounts: "All accounts ({n})",
			alertQuota: "{name}: standard quota ({w}) {p}% used",
			alertFull: "{name}: standard quota ({w}) used up{r}",
			alertFullReset: ", {d}",
			alertRecover: "{name}: standard quota available again ({p}% used)",
			alertSwitch: "{from} unavailable ({reason}); switched to {to}",
			alertSwitchBalance: "{from} unavailable ({reason}); conversation moved to {to}",
			reasonQuota: "quota full",
			active: "Active",
			idle: "Idle",
			switch: "Switch",
			refresh: "Refresh",
			copyKey: "Copy key",
			remove: "Remove",
			confirmRemove: "Confirm?",
			std: "Standard",
			core: "Core",
			w5h: "5h",
			wWeek: "Week",
			wMonth: "Month",
			resets: "resets {t}",
			resetIn: "resets in {d}",
			resetSoon: "resetting",
			uMin: "{n}m",
			uHour: "{n}h",
			uDay: "{n}d",
			used: "used",
			usedPct: "{p}% used",
			leftPct: "{p}% left",
			pillUsed: "Factory used",
			w5hShort: "5h",
			pillOffline: "Factory offline",
			pillLoading: "Factory …",
			pillNoActive: "Factory: no account",
			pillQuotaError: "Factory quota error",
			pillNoQuota: "Factory: no quota",
			tabTitle: "Factory quota",
			guideDesc: "Keep account quota in view",
			paneTitle: "Factory quota",
			justNow: "just now",
			minAgo: "{n}m ago",
			hourAgo: "{n}h ago",
			noActive: "No active account",
			others: "Other accounts ({n})",
			stdHint: "Standard: shared by all models, consumed first",
			coreHint: "Core: open-model pool, used after Standard runs out",
			noQuota: "No quota data yet; press Refresh.",
			quotaError: "Quota fetch failed: {e}",
			empty: "No accounts yet. Press “Add accounts” and paste one email----fk-key per line.",
			addTitle: "Add accounts in bulk",
			addHint: "One per line: email----fk-xxxx. Keys stay on this machine in ~/.vwFactory/secrets.json, encrypted with your Windows account.",
			orgId: "Organization ID (optional)",
			submit: "Add",
			adding: "Adding…",
			addResult: "{ok} added, {fail} failed",
			badFormat: "Use the email----key format",
			switched: "Switched to {name}",
			removed: "Removed {name}",
			copied: "Copied email----key for {name}",
			autoOn: "Auto failover on",
			autoOff: "Auto failover off",
			models: "Available models",
			modelsHint: "Only models verified on the active account; multipliers are relative billing factors.",
			search: "Search models…",
			noModels: "No matching models",
			loading: "Loading…",
			offline: "Cannot reach vwFactory: {e}",
			retry: "Retry",
			plan: "Plan {p}",
			balance: "Extra balance ${v}"
		};
		const fmt = (s, vars) => String(s).replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] !== undefined ? String(vars[k]) : ""));

		// ---------- transport ----------
		async function rpc(method, path, body) {
			const res = await fetch(RPC_ROUTE, {
				method: "POST",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ method, path, body })
			});
			let data;
			try { data = await res.json(); } catch { data = {}; }
			if (!res.ok || (data && typeof data.error === "string")) {
				const err = new Error((data && data.error) || `HTTP ${res.status}`);
				err.status = res.status;
				throw err;
			}
			return data;
		}
		async function copyText(text) {
			try { await navigator.clipboard.writeText(text); return; } catch {}
			const ta = document.createElement("textarea");
			ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
			document.body.appendChild(ta); ta.select();
			try { document.execCommand("copy"); } finally { ta.remove(); }
		}

		// ---------- styles ----------
		const V = {
			fg: "var(--dsw-alias-label-primary)",
			fg2: "var(--dsw-alias-label-secondary)",
			fg3: "var(--dsw-alias-label-tertiary)",
			border: "var(--dsw-alias-border-l2)",
			card: "var(--dsw-alias-settings-card-fill, var(--dsw-alias-bg-layer-1))",
			cardStroke: "var(--dsw-alias-settings-card-stroke, var(--dsw-alias-border-l2))",
			hover: "var(--dsw-alias-interactive-bg-hover)",
			accent: "var(--dsw-alias-state-business-primary)",
			danger: "var(--dsw-alias-state-error-primary)",
			warn: "var(--dsw-alias-state-warn-primary, #d98a00)",
			ok: "var(--dsw-alias-state-success-primary, #2e9e5b)",
			track: "var(--dsw-alias-bg-layer-2, rgba(127,127,127,.15))"
		};
		const CSS = `
.vwf-btn{font:inherit;font-size:13px;line-height:20px;padding:4px 12px;border-radius:8px;cursor:pointer;
  border:.5px solid ${V.border};background:transparent;color:${V.fg};white-space:nowrap}
.vwf-btn:hover:not(:disabled){background:${V.hover}}
.vwf-btn:disabled{opacity:.5;cursor:default}
.vwf-btn:focus-visible{outline:2px solid ${V.accent};outline-offset:1px}
.vwf-btn.primary{background:${V.accent};border-color:${V.accent};color:#fff}
.vwf-btn.primary:hover:not(:disabled){filter:brightness(1.08);background:${V.accent}}
.vwf-btn.danger{color:${V.danger}}
.vwf-btn.sm{font-size:12px;padding:2px 9px;border-radius:6px}
.vwf-card{border:.5px solid ${V.cardStroke};background:${V.card};border-radius:12px;padding:12px 14px;
  display:flex;flex-direction:column;gap:10px}
.vwf-card.on{border-color:${V.accent};box-shadow:0 0 0 .5px ${V.accent} inset}
.vwf-input{font:inherit;font-size:13px;color:${V.fg};background:transparent;border:.5px solid ${V.border};
  border-radius:8px;padding:6px 10px;width:100%;box-sizing:border-box}
.vwf-input:focus{outline:none;border-color:${V.accent}}
.vwf-switch{position:relative;width:34px;height:20px;border-radius:10px;border:0;cursor:pointer;flex:none;
  background:${V.border};transition:background .15s;padding:0}
.vwf-switch[aria-checked=true]{background:${V.accent}}
.vwf-switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;
  background:#fff;transition:transform .15s;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.vwf-switch[aria-checked=true]::after{transform:translateX(14px)}
.vwf-switch:focus-visible{outline:2px solid ${V.accent};outline-offset:2px}
.vwf-qgroups{display:flex;flex-wrap:wrap;gap:10px}
.vwf-qgroup{flex:1 1 300px;min-width:0;border:.5px solid ${V.border};border-radius:10px;padding:8px 10px 10px;
  display:flex;flex-direction:column;gap:6px}
.vwf-qgroup-title{font-size:12px;color:${V.fg2};display:flex;justify-content:space-between;gap:8px}
.vwf-rings{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.vwf-ring{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:0}
.vwf-ring-box{position:relative;width:56px;height:56px}
.vwf-ring-box svg{display:block;transform:rotate(-90deg)}
.vwf-ring-bg{fill:none;stroke:${V.track}}
.vwf-ring-fg{fill:none;stroke-linecap:round;transition:stroke-dashoffset .5s ease;animation:vwf-ring .7s ease-out}
@keyframes vwf-ring{from{stroke-dashoffset:var(--vwf-c)}}
.vwf-ring-val{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.vwf-ring-val b{font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.vwf-ring-val small{font-size:9.5px;color:${V.fg3};margin-top:2px}
.vwf-ring-label{font-size:12px;color:${V.fg}}
.vwf-ring-reset{font-size:10.5px;color:${V.fg3};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.vwf-chip{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:5px 10px;
  border:.5px solid ${V.border};border-radius:8px;font-size:12px;min-width:0}
.vwf-chip span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vwf-seg{display:inline-flex;flex:none;padding:2px;border-radius:9px;background:${V.track};gap:2px}
.vwf-seg button{font:inherit;font-size:12px;line-height:18px;padding:3px 12px;border:0;border-radius:7px;cursor:pointer;
  background:transparent;color:${V.fg2};white-space:nowrap}
.vwf-seg button[aria-pressed=true]{background:var(--dsw-alias-bg-layer-1,#fff);color:${V.fg};box-shadow:0 1px 2px rgba(0,0,0,.12);font-weight:500}
.vwf-seg button:focus-visible{outline:2px solid ${V.accent};outline-offset:1px}
.vwf-toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:1200;max-width:min(560px,calc(100vw - 32px));
  padding:8px 14px;border-radius:10px;font-size:13px;line-height:18px;color:${V.fg};
  background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-1));border:.5px solid ${V.border};
  box-shadow:0 6px 24px rgba(0,0,0,.18);pointer-events:none;animation:vwf-toast 6s ease forwards}
@keyframes vwf-toast{0%{opacity:0;transform:translate(-50%,-8px)}6%{opacity:1;transform:translate(-50%,0)}85%{opacity:1}100%{opacity:0}}
`;
		function ensureCss() {
			const id = "dsh-vwfactory/section.css";
			if (document.querySelector(`style[data-plugin-css="${id}"]`)) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-vwfactory";
			tag.dataset.pluginCss = id;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		const HUES = [214, 262, 288, 174, 24, 340, 196, 140];
		function avatarStyle(name) {
			let x = 0;
			for (const c of String(name)) x = (x * 31 + c.charCodeAt(0)) >>> 0;
			return {
				width: 32, height: 32, borderRadius: 16, flex: "none", display: "grid", placeItems: "center",
				color: "#fff", fontWeight: 600, fontSize: 14,
				background: `linear-gradient(135deg,hsl(${HUES[x % 8]} 70% 55%),hsl(${HUES[(x >> 3) % 8]} 70% 42%))`
			};
		}
		const timeStr = (ms) => new Date(ms).toLocaleString(undefined, { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

		// ---------- components ----------
		function resetIn(t, at) {
			if (!at) return "";
			const ms = at - Date.now();
			if (ms <= 0) return t("resetSoon");
			const min = Math.round(ms / 6e4);
			const d = min < 60 ? fmt(t("uMin"), { n: Math.max(1, min) })
				: min < 48 * 60 ? fmt(t("uHour"), { n: Math.round(min / 60) })
					: fmt(t("uDay"), { n: Math.round(min / 1440) });
			return fmt(t("resetIn"), { d });
		}
		const RING_R = 23, RING_W = 5, RING_C = 2 * Math.PI * RING_R;
		function QuotaRing({ t, label, bucket }) {
			const p = Math.min(100, Math.max(0, Math.round(bucket.usedPercent)));
			const color = p >= 90 ? V.danger : p >= 70 ? V.warn : V.accent;
			const reset = resetIn(t, bucket.resetsAt);
			const tip = `${label}: ${fmt(t("usedPct"), { p })} · ${fmt(t("leftPct"), { p: 100 - p })}` +
				(bucket.resetsAt ? ` · ${fmt(t("resets"), { t: timeStr(bucket.resetsAt) })}` : "");
			const size = (RING_R + RING_W) * 2;
			return h("div", { className: "vwf-ring", title: tip },
				h("div", { className: "vwf-ring-box", style: { width: size, height: size } },
					h("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, "aria-hidden": true },
						h("circle", { className: "vwf-ring-bg", cx: size / 2, cy: size / 2, r: RING_R, strokeWidth: RING_W }),
						p > 0 ? h("circle", {
							className: "vwf-ring-fg", cx: size / 2, cy: size / 2, r: RING_R, strokeWidth: RING_W,
							stroke: color, strokeDasharray: RING_C.toFixed(2),
							strokeDashoffset: (RING_C * (1 - p / 100)).toFixed(2),
							style: { "--vwf-c": RING_C.toFixed(2) }
						}) : null
					),
					h("div", { className: "vwf-ring-val" },
						h("b", { style: { color: p >= 90 ? V.danger : V.fg } }, `${p}%`),
						h("small", null, t("used"))
					)
				),
				h("span", { className: "vwf-ring-label" }, label),
				reset ? h("span", { className: "vwf-ring-reset" }, reset) : null
			);
		}
		function QuotaGroup({ t, title, hint, buckets }) {
			const items = buckets.filter((b) => b[1]);
			if (items.length === 0) return null;
			const worst = Math.max(...items.map(([, b]) => b.usedPercent));
			return h("div", { className: "vwf-qgroup", title: hint },
				h("div", { className: "vwf-qgroup-title" },
					h("span", null, title),
					h("span", { style: { color: worst >= 90 ? V.danger : V.fg3 } }, fmt(t("leftPct"), { p: Math.max(0, 100 - Math.round(worst)) }))
				),
				h("div", { className: "vwf-rings" }, ...items.map(([label, b]) => h(QuotaRing, { key: label, t, label, bucket: b })))
			);
		}
		function Quota({ t, q }) {
			if (!q) return h("div", { style: { fontSize: 12, color: V.fg3 } }, t("noQuota"));
			if (q.error) return h("div", { style: { fontSize: 12, color: V.danger, wordBreak: "break-all" } }, fmt(t("quotaError"), { e: q.error }));
			const extra = [];
			if (q.planType) extra.push(fmt(t("plan"), { p: q.planType }));
			if (typeof q.extraUsageBalanceCents === "number") extra.push(fmt(t("balance"), { v: (q.extraUsageBalanceCents / 100).toFixed(2) }));
			return h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
				h("div", { className: "vwf-qgroups" },
					h(QuotaGroup, { t, title: t("std"), hint: t("stdHint"), buckets: [[t("w5h"), q.standard5h], [t("wWeek"), q.standardWeekly], [t("wMonth"), q.standardMonthly]] }),
					h(QuotaGroup, { t, title: t("core"), hint: t("coreHint"), buckets: [[t("w5h"), q.core5h], [t("wWeek"), q.coreWeekly], [t("wMonth"), q.coreMonthly]] })
				),
				extra.length ? h("div", { style: { fontSize: 11, color: V.fg3 } }, extra.join(" · ")) : null
			);
		}
		/** Cooldown badge + live conversation count (balance mode). */
		function AccStatus({ t, acc }) {
			const cd = acc.cooldown;
			return h(React.Fragment, null,
				cd ? h("span", {
					title: `${cd.reason || ""} · ${resetIn(t, cd.until)}`,
					style: { fontSize: 11, padding: "0 7px", borderRadius: 9, lineHeight: "18px", flex: "none", color: V.danger, border: `.5px solid ${V.danger}` }
				}, t("cooling")) : null,
				acc.sessions > 0 ? h("span", { style: { fontSize: 11, color: V.fg3, flex: "none" } }, fmt(t("sessionsN"), { n: acc.sessions })) : null
			);
		}
		function ModeSeg({ t, mode, onChange }) {
			const cur = mode === "balance" ? "balance" : "single";
			return h("div", { className: "vwf-seg", role: "group", "aria-label": t("routing") },
				...["single", "balance"].map((m) => h("button", {
					key: m, type: "button", "aria-pressed": cur === m,
					onClick: () => { if (cur !== m) onChange(m); }
				}, t(m === "balance" ? "modeBalance" : "modeSingle"))));
		}
		function AccountCard({ t, acc, busy, onAction }) {
			const [confirm, setConfirm] = useState(false);
			useEffect(() => {
				if (!confirm) return;
				const timer = setTimeout(() => setConfirm(false), 3000);
				return () => clearTimeout(timer);
			}, [confirm]);
			const name = acc.label || acc.email || acc.id;
			const meta = [acc.orgId ? `org ${String(acc.orgId).slice(0, 12)}…` : "", acc.fingerprint ? `key …${acc.fingerprint}` : "", acc.kind === "oauth" ? "OAuth" : ""].filter(Boolean).join(" · ");
			return h("li", { className: "vwf-card" + (acc.active ? " on" : ""), style: { listStyle: "none" } },
				h("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 } },
					h("div", { style: avatarStyle(name), "aria-hidden": true }, String(name)[0].toUpperCase()),
					h("div", { style: { flex: 1, minWidth: 0 } },
						h("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 } },
							h("span", { style: { fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, title: name }, name),
							h("span", {
								style: {
									fontSize: 11, padding: "0 7px", borderRadius: 9, lineHeight: "18px", flex: "none",
									color: acc.active ? "#fff" : V.fg3, background: acc.active ? V.ok : "transparent",
									border: acc.active ? "0" : `.5px solid ${V.border}`
								}
							}, acc.active ? t("active") : t("idle")),
							h(AccStatus, { t, acc })
						),
						meta ? h("div", { style: { fontSize: 11, color: V.fg3, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, meta) : null
					),
					h("div", { style: { display: "flex", gap: 6, flex: "none" } },
						acc.active ? null : h("button", { type: "button", className: "vwf-btn sm", disabled: busy, onClick: () => onAction("switch", acc) }, t("switch")),
						h("button", { type: "button", className: "vwf-btn sm", disabled: busy, onClick: () => onAction("refresh", acc) }, t("refresh")),
						h("button", { type: "button", className: "vwf-btn sm", disabled: busy, onClick: () => onAction("copy", acc) }, t("copyKey")),
						h("button", {
							type: "button", className: "vwf-btn sm danger", disabled: busy,
							onClick: () => { if (confirm) { setConfirm(false); onAction("remove", acc); } else setConfirm(true); }
						}, confirm ? t("confirmRemove") : t("remove"))
					)
				),
				h(Quota, { t, q: acc.quota })
			);
		}
		function AddPanel({ t, onDone, notify }) {
			const [text, setText] = useState("");
			const [org, setOrg] = useState("");
			const [busy, setBusy] = useState(false);
			const submit = async () => {
				const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
				if (lines.length === 0) { notify(t("badFormat"), true); return; }
				setBusy(true);
				let ok = 0;
				const fails = [];
				for (const line of lines) {
					const [email = "", key = ""] = line.split("----").map((s) => s.trim());
					if (!email || !key) { fails.push(line.slice(0, 30)); continue; }
					try {
						await rpc("POST", "/api/add", { email, api_key: key, org_id: org.trim() || undefined });
						ok++;
					} catch (e) {
						fails.push(`${email}: ${e.message}`);
					}
				}
				setBusy(false);
				notify(fmt(t("addResult"), { ok, fail: fails.length }) + (fails.length ? "\n" + fails.join("\n") : ""), fails.length > 0);
				if (ok > 0) { setText(""); onDone(fails.length === 0); }
			};
			return h("div", { className: "vwf-card", style: { gap: 8 } },
				h("div", { style: { fontSize: 14, fontWeight: 500 } }, t("addTitle")),
				h("div", { style: { fontSize: 12, color: V.fg3 } }, t("addHint")),
				h("textarea", {
					className: "vwf-input", rows: 4, value: text, spellCheck: false,
					placeholder: "you@example.com----fk-xxxxxxxx",
					style: { fontFamily: "ui-monospace,SFMono-Regular,Consolas,monospace", fontSize: 12, resize: "vertical" },
					onChange: (e) => setText(e.target.value)
				}),
				h("input", { className: "vwf-input", value: org, placeholder: t("orgId"), onChange: (e) => setOrg(e.target.value) }),
				h("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 } },
					h("button", { type: "button", className: "vwf-btn", disabled: busy, onClick: () => onDone(true) }, t("cancel")),
					h("button", { type: "button", className: "vwf-btn primary", disabled: busy, onClick: submit }, busy ? t("adding") : t("submit"))
				)
			);
		}
		function Models({ t }) {
			const [models, setModels] = useState(null);
			const [q, setQ] = useState("");
			useEffect(() => {
				let alive = true;
				rpc("GET", "/api/models").then((r) => alive && setModels(r.models || [])).catch(() => alive && setModels([]));
				return () => { alive = false; };
			}, []);
			const ql = q.toLowerCase();
			const list = (models || []).filter((m) => !ql || m.id.toLowerCase().includes(ql) || String(m.name || "").toLowerCase().includes(ql));
			const tier = (m) => (m >= 4 ? V.danger : m >= 1 ? V.warn : V.ok);
			return h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
				h("div", { style: { fontSize: 12, color: V.fg3 } }, t("modelsHint")),
				h("input", { className: "vwf-input", value: q, placeholder: t("search"), onChange: (e) => setQ(e.target.value) }),
				models === null
					? h("div", { style: { fontSize: 12, color: V.fg3 } }, t("loading"))
					: list.length === 0
						? h("div", { style: { fontSize: 12, color: V.fg3 } }, t("noModels"))
						: h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 6 } },
							...list.map((m) => h("div", { key: m.id, className: "vwf-chip", title: m.id },
								h("span", null, m.name || m.id),
								h("span", { style: { flex: "none", fontVariantNumeric: "tabular-nums", color: m.multiplier == null ? V.fg3 : tier(m.multiplier) } },
									m.multiplier == null ? "—" : `${m.multiplier}×`)
							)))
			);
		}

		let autoRefreshed = false;
		function Section({ t }) {
			ensureCss();
			const [state, setState] = useState(null);
			const [error, setError] = useState(null);
			const [busyId, setBusyId] = useState(null);
			const [refreshingAll, setRefreshingAll] = useState(false);
			const [adding, setAdding] = useState(false);
			const [showModels, setShowModels] = useState(false);
			const [toast, setToast] = useState(null);
			const toastTimer = useRef(0);
			const mounted = useRef(true);
			useEffect(() => {
				mounted.current = true;
				return () => { mounted.current = false; clearTimeout(toastTimer.current); };
			}, []);
			const notify = useCallback((text, isError) => {
				clearTimeout(toastTimer.current);
				setToast({ text, isError: !!isError });
				toastTimer.current = setTimeout(() => mounted.current && setToast(null), isError ? 6000 : 2500);
			}, []);
			const load = useCallback(async () => {
				try {
					const s = await rpc("GET", "/api/state");
					hub.accept(s); // keep the composer pill in sync with Settings actions
					if (!mounted.current) return;
					setState(s);
					setError(null);
				} catch (e) {
					if (mounted.current) setError(e.message);
				}
			}, []);
			const refreshAll = useCallback(async (silent) => {
				setRefreshingAll(true);
				try {
					const r = await rpc("POST", "/api/refresh", {});
					if (!silent) notify(r.message || "OK", /error/.test(r.message || ""));
				} catch (e) {
					if (!silent) notify(e.message, true);
				} finally {
					if (mounted.current) setRefreshingAll(false);
					await load();
				}
			}, [load, notify]);
			useEffect(() => {
				load().then(() => {
					if (!autoRefreshed) { autoRefreshed = true; void refreshAll(true); }
				});
			}, [load, refreshAll]);

			const onAction = async (kind, acc) => {
				const name = acc.label || acc.email || acc.id;
				setBusyId(acc.id);
				try {
					if (kind === "switch") {
						await rpc("POST", "/api/switch", { id: acc.id });
						notify(fmt(t("switched"), { name }));
					} else if (kind === "refresh") {
						const r = await rpc("POST", "/api/refresh", { id: acc.id });
						notify(r.message || "OK", /error/.test(r.message || ""));
					} else if (kind === "copy") {
						const r = await rpc("POST", "/api/export", { id: acc.id });
						await copyText(r.text);
						notify(fmt(t("copied"), { name }));
					} else if (kind === "remove") {
						await rpc("POST", "/api/remove", { id: acc.id });
						notify(fmt(t("removed"), { name }));
					}
				} catch (e) {
					notify(e.message, true);
				} finally {
					if (mounted.current) setBusyId(null);
					await load();
				}
			};
			const setAuto = async (enabled) => {
				setState((s) => (s ? { ...s, autoSwitch: enabled } : s));
				try {
					await rpc("POST", "/api/failover", { enabled });
					notify(enabled ? t("autoOn") : t("autoOff"));
				} catch (e) {
					notify(e.message, true);
				}
				await load();
			};
			const setMode = async (mode) => {
				setState((s) => (s ? { ...s, routing: mode } : s));
				try {
					await rpc("POST", "/api/routing", { mode });
					notify(fmt(t("modeChanged"), { m: t(mode === "balance" ? "modeBalance" : "modeSingle") }));
				} catch (e) {
					notify(e.message, true);
				}
				await load();
			};

			const ids = state ? state.identities : [];
			const stamp = ids.map((i) => i.quota && i.quota.fetchedAt).filter(Boolean).sort().pop();
			const sub = state ? [fmt(t("accounts"), { n: ids.length }), state.secretsEncrypted ? "🔒 " + t("encrypted") : "", stamp ? fmt(t("updatedAt"), { t: timeStr(stamp) }) : ""].filter(Boolean).join(" · ") : "";

			return h("section", { style: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 760, color: V.fg, position: "relative" } },
				h("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" } },
					h("div", { style: { flex: 1, minWidth: 200 } },
						h("h2", { style: { margin: 0, fontSize: 18, fontWeight: 600 } }, t("title")),
						h("p", { style: { margin: "4px 0 0", fontSize: 13, color: V.fg3 } }, t("intro"))
					),
					h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
						h("button", { type: "button", className: "vwf-btn", disabled: refreshingAll || !state, onClick: () => refreshAll(false) }, refreshingAll ? t("refreshing") : t("refreshAll")),
						h("button", { type: "button", className: "vwf-btn primary", disabled: !state, onClick: () => setAdding((v) => !v) }, adding ? t("cancel") : t("add"))
					)
				),
				error && !state
					? h("div", { className: "vwf-card", style: { flexDirection: "row", alignItems: "center", gap: 10 } },
						h("span", { style: { flex: 1, fontSize: 13, color: V.danger, wordBreak: "break-all" } }, fmt(t("offline"), { e: error })),
						h("button", { type: "button", className: "vwf-btn sm", onClick: load }, t("retry")))
					: null,
				state === null && !error ? h("div", { style: { fontSize: 13, color: V.fg3 } }, t("loading")) : null,
				state
					? h(React.Fragment, null,
						state.storeWarnings && state.storeWarnings.length
							? h("div", { className: "vwf-card", role: "alert", style: { gap: 4, borderColor: V.warn, fontSize: 12 } },
								h("div", { style: { color: V.warn, fontWeight: 500 } }, t("storeWarn")),
								...state.storeWarnings.map((w, i) => h("div", { key: i, style: { color: V.fg2, wordBreak: "break-all" } }, w)))
							: null,
						h("div", { className: "vwf-card", style: { flexDirection: "row", alignItems: "center", gap: 12 } },
							h("div", { style: { flex: 1, minWidth: 0 } },
								h("div", { style: { fontSize: 14, fontWeight: 500 } }, t("autoSwitch")),
								h("div", { style: { fontSize: 12, color: V.fg3, marginTop: 2 } }, t("autoSwitchHint"))
							),
							h("button", {
								type: "button", role: "switch", className: "vwf-switch", "aria-checked": !!state.autoSwitch,
								"aria-label": t("autoSwitch"), onClick: () => setAuto(!state.autoSwitch)
							})
						),
						h("div", { className: "vwf-card", style: { flexDirection: "row", alignItems: "center", gap: 12 } },
							h("div", { style: { flex: 1, minWidth: 0 } },
								h("div", { style: { fontSize: 14, fontWeight: 500 } }, t("routing")),
								h("div", { style: { fontSize: 12, color: V.fg3, marginTop: 2 } }, t("routingHint"))
							),
							h(ModeSeg, { t, mode: state.routing, onChange: setMode })
						),
						adding ? h(AddPanel, { t, notify, onDone: (close) => { if (close) setAdding(false); void load(); } }) : null,
						h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: V.fg3 } },
							h("span", null, sub),
							h("a", { href: DASHBOARD_URL, target: "_blank", rel: "noopener", style: { color: V.fg3 } }, t("openExternal"))
						),
						ids.length === 0
							? h("div", { className: "vwf-card", style: { fontSize: 13, color: V.fg3, alignItems: "center", textAlign: "center", padding: 24 } }, t("empty"))
							: h("ul", { style: { margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 } },
								...ids.map((acc) => h(AccountCard, { key: acc.id, t, acc, busy: busyId === acc.id, onAction }))),
						h("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 4 } },
							h("button", {
								type: "button", className: "vwf-btn", style: { alignSelf: "flex-start" },
								"aria-expanded": showModels, onClick: () => setShowModels((v) => !v)
							}, (showModels ? "▾ " : "▸ ") + t("models")),
							showModels ? h(Models, { t }) : null
						)
					)
					: null,
				toast
					? h("div", {
						role: "status",
						style: {
							position: "sticky", bottom: 8, alignSelf: "center", maxWidth: "100%", whiteSpace: "pre-wrap",
							fontSize: 12, padding: "6px 12px", borderRadius: 8, zIndex: 1,
							background: "var(--dsw-alias-bg-layer-3, #333)", color: toast.isError ? V.danger : V.fg,
							border: `.5px solid ${toast.isError ? V.danger : V.border}`, boxShadow: "0 4px 16px rgba(0,0,0,.15)"
						}
					}, toast.text)
					: null
			);
		}

		// ---------- right-sidebar quota pane ----------
		const PANE_ID = "dsh-vwfactory/quota";
		const PANE_KIND = "vwfactory.quota";
		const STATE_POLL_MS = 30e3;
		const QUOTA_POLL_MS = 5 * 60e3;
		function QuotaGlyph({ size = 22, className }) {
			return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", className, "aria-hidden": true },
				h("circle", { cx: 12, cy: 12, r: 8.5, stroke: "currentColor", strokeOpacity: 0.25, strokeWidth: 2.2 }),
				h("path", { d: "M12 3.5a8.5 8.5 0 0 1 8.15 10.9", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" }),
				h("circle", { cx: 12, cy: 12, r: 2, fill: "currentColor" }));
		}
		const ago = (t, ms) => {
			if (!ms) return "";
			const min = Math.floor((Date.now() - ms) / 6e4);
			return min < 1 ? t("justNow") : min < 60 ? fmt(t("minAgo"), { n: min }) : fmt(t("hourAgo"), { n: Math.floor(min / 60) });
		};
		function worstOf(q) {
			if (!q || q.error) return undefined;
			const all = [q.standard5h, q.standardWeekly, q.standardMonthly].filter(Boolean);
			return all.length ? Math.max(...all.map((b) => b.usedPercent)) : undefined;
		}
		function MiniRing({ p }) {
			const r = 8, w = 3, s = (r + w) * 2, c = 2 * Math.PI * r;
			const v = p === undefined ? 0 : Math.min(100, Math.max(0, Math.round(p)));
			const color = v >= 90 ? V.danger : v >= 70 ? V.warn : V.accent;
			return h("svg", { width: s, height: s, viewBox: `0 0 ${s} ${s}`, style: { transform: "rotate(-90deg)", flex: "none" }, "aria-hidden": true },
				h("circle", { className: "vwf-ring-bg", cx: s / 2, cy: s / 2, r, strokeWidth: w }),
				v > 0 ? h("circle", { cx: s / 2, cy: s / 2, r, strokeWidth: w, fill: "none", stroke: color, strokeLinecap: "round", strokeDasharray: c.toFixed(2), strokeDashoffset: (c * (1 - v / 100)).toFixed(2) }) : null);
		}
		// Shared data hub: one poller for every quota view (composer pill, popover, sidebar tab).
		// Quota/switch alerts from the proxy -> toast queue (deduped across reloads by seq).
		const ALERT_MAX_AGE = 15 * 60e3;
		const alertBus = (() => {
			const LS = "vwfactory.alertSeq";
			let lastSeq = null;
			try { const v = localStorage.getItem(LS); if (v !== null && v !== "") lastSeq = Number(v); } catch {}
			let queue = [];
			const subs = new Set();
			const save = () => { try { localStorage.setItem(LS, String(lastSeq)); } catch {} };
			const notify = () => { for (const f of subs) f(); };
			return {
				feed(state) {
					const seq = Number(state && state.alertSeq) || 0;
					if (lastSeq === null || !Number.isFinite(lastSeq) || seq < lastSeq) { lastSeq = seq; save(); return; }
					if (seq === lastSeq) return;
					const fresh = (state.alerts || []).filter((a) => a.seq > lastSeq && Date.now() - a.at < ALERT_MAX_AGE);
					lastSeq = seq; save();
					if (fresh.length) { queue = [...queue, ...fresh].slice(-5); notify(); }
				},
				get: () => queue,
				shift() { queue = queue.slice(1); notify(); },
				subscribe(f) { subs.add(f); return () => { subs.delete(f); }; }
			};
		})();
		const hub = (() => {
			let snap = { state: null, error: null, refreshing: false };
			const subs = new Set();
			let users = 0, timer = 0, lastQuota = 0, inflight = null;
			const emit = (patch) => { snap = { ...snap, ...patch }; for (const f of subs) f(); };
			const stampOf = (s) => (s ? Math.max(0, ...s.identities.map((i) => (i.quota && Math.max(i.quota.fetchedAt || 0, i.quota.checkedAt || 0)) || 0)) : 0);
			async function load() {
				try { const state = await rpc("GET", "/api/state"); emit({ state, error: null }); alertBus.feed(state); }
				catch (e) { emit({ error: e.message }); }
			}
			function refreshQuota() {
				if (inflight) return inflight;
				lastQuota = Date.now();
				emit({ refreshing: true });
				inflight = (async () => {
					try { await rpc("POST", "/api/refresh", {}); } catch {}
					inflight = null;
					emit({ refreshing: false });
					await load();
				})();
				return inflight;
			}
			async function tick() {
				if (!snap.state) await load();
				if (snap.state && Date.now() - Math.max(stampOf(snap.state), lastQuota) > QUOTA_POLL_MS) await refreshQuota();
				else if (snap.state) await load();
			}
			return {
				get: () => snap,
				subscribe(f) { subs.add(f); return () => { subs.delete(f); }; },
				accept(state) { emit({ state, error: null }); },
				load,
				refreshQuota,
				/** Keep polling while at least one visible view holds a lease. */
				retain() {
					users++;
					if (users === 1) { void tick(); timer = setInterval(() => void tick(), STATE_POLL_MS); }
					let released = false;
					return () => {
						if (released) return;
						released = true;
						users--;
						if (users === 0) { clearInterval(timer); timer = 0; }
					};
				}
			};
		})();
		function useHub(active) {
			const snap = React.useSyncExternalStore(hub.subscribe, hub.get, hub.get);
			useEffect(() => (active ? hub.retain() : undefined), [active]);
			const [, rerender] = useState(0);
			useEffect(() => {
				// re-render once a minute so relative times ("3 分钟前") stay fresh
				if (!active) return;
				const id = setInterval(() => rerender((n) => n + 1), 60e3);
				return () => clearInterval(id);
			}, [active]);
			return snap;
		}
		const accName = (i) => i.label || i.email || i.id;

		/** Body shared by the sidebar tab and the composer popover. */
		function QuotaPanelBody({ t, snap }) {
			const [busy, setBusy] = useState(null);
			const [err, setErr] = useState(null);
			const { state, error, refreshing } = snap;
			if (!state) {
				return error
					? h("div", { className: "vwf-card", style: { gap: 8 } },
						h("span", { style: { fontSize: 13, color: V.danger, wordBreak: "break-all" } }, fmt(t("offline"), { e: error })),
						h("button", { type: "button", className: "vwf-btn sm", style: { alignSelf: "flex-start" }, onClick: () => void hub.load() }, t("retry")))
					: h("div", { style: { fontSize: 13, color: V.fg3 } }, t("loading"));
			}
			const switchTo = async (acc) => {
				setBusy(acc.id); setErr(null);
				try { await rpc("POST", "/api/switch", { id: acc.id }); } catch (e) { setErr(e.message); }
				setBusy(null);
				await hub.load();
			};
			const setAuto = async (enabled) => {
				hub.accept({ ...state, autoSwitch: enabled });
				try { await rpc("POST", "/api/failover", { enabled }); } catch (e) { setErr(e.message); }
				await hub.load();
			};
			const setMode = async (mode) => {
				hub.accept({ ...state, routing: mode });
				try { await rpc("POST", "/api/routing", { mode }); } catch (e) { setErr(e.message); }
				await hub.load();
			};
			const ids = state.identities;
			const balance = state.routing === "balance";
			const active = ids.find((i) => i.active);
			const others = ids.filter((i) => !i.active).sort((a, b) => (worstOf(a.quota) ?? 101) - (worstOf(b.quota) ?? 101));
			const stamp = Math.max(0, ...ids.map((i) => (i.quota && i.quota.fetchedAt) || 0));
			const shownErr = err || error;
			const chip = (acc, withSwitch) => {
				const w = worstOf(acc.quota);
				return h("div", { key: acc.id, className: "vwf-chip", style: { gap: 8, padding: "6px 8px" }, title: accName(acc) },
					h(MiniRing, { p: w }),
					h("span", { style: { flex: 1, minWidth: 0, color: V.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, accName(acc)),
					h(AccStatus, { t, acc }),
					h("span", { style: { flex: "none", fontSize: 11, color: w === undefined ? V.fg3 : w >= 90 ? V.danger : V.fg2, fontVariantNumeric: "tabular-nums" } },
						w === undefined ? "—" : fmt(t("leftPct"), { p: Math.max(0, 100 - Math.round(w)) })),
					withSwitch ? h("button", { type: "button", className: "vwf-btn sm", disabled: busy === acc.id, onClick: () => switchTo(acc) }, t("switch")) : null
				);
			};
			const header = h(React.Fragment, null,
				h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
					h("span", { style: { fontSize: 13, fontWeight: 600, flex: 1, color: V.fg } }, t("paneTitle")),
					h("span", { style: { fontSize: 11, color: V.fg3 } }, stamp ? ago(t, stamp) : ""),
					h("button", { type: "button", className: "vwf-btn sm", disabled: refreshing, onClick: () => void hub.refreshQuota(), title: t("refreshAll") }, refreshing ? "…" : "↻")
				),
				ids.length > 1 ? h("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
					h("span", { style: { fontSize: 12, flex: 1, color: V.fg }, title: t("routingHint") }, t("routing")),
					h(ModeSeg, { t, mode: state.routing, onChange: setMode })
				) : null,
				shownErr ? h("div", { style: { fontSize: 12, color: V.danger, wordBreak: "break-all" } }, shownErr) : null
			);
			if (balance) {
				const sorted = [...ids].sort((a, b) => (worstOf(a.quota) ?? 101) - (worstOf(b.quota) ?? 101));
				return h(React.Fragment, null, header,
					h("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
						h("div", { style: { fontSize: 12, color: V.fg3 } }, fmt(t("allAccounts"), { n: ids.length })),
						...sorted.map((acc) => chip(acc, false))));
			}
			return h(React.Fragment, null,
				header,
				active
					? h("div", { className: "vwf-card on", style: { gap: 10, padding: "10px 12px" } },
						h("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 } },
							h("div", { style: { ...avatarStyle(accName(active)), width: 26, height: 26, fontSize: 12 }, "aria-hidden": true }, String(accName(active))[0].toUpperCase()),
							h("div", { style: { flex: 1, minWidth: 0 } },
								h("div", { style: { fontSize: 13, fontWeight: 500, color: V.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, title: accName(active) }, accName(active)),
								h("div", { style: { fontSize: 11, color: V.ok } }, t("active"))
							)
						),
						h(Quota, { t, q: active.quota })
					)
					: h("div", { className: "vwf-card", style: { fontSize: 12, color: V.fg3 } }, ids.length ? t("noActive") : t("empty")),
				h("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
					h("span", { style: { fontSize: 12, flex: 1, color: V.fg }, title: t("autoSwitchHint") }, t("autoSwitch")),
					h("button", { type: "button", role: "switch", className: "vwf-switch", "aria-checked": !!state.autoSwitch, "aria-label": t("autoSwitch"), onClick: () => setAuto(!state.autoSwitch) })
				),
				others.length
					? h("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
						h("div", { style: { fontSize: 12, color: V.fg3 } }, fmt(t("others"), { n: others.length })),
						...others.map((acc) => chip(acc, true)))
					: null
			);
		}

		function QuotaPane({ t, useTabInfo }) {
			ensureCss();
			const info = typeof useTabInfo === "function" ? useTabInfo() : undefined;
			const visible = !info || !info.tab || info.tab.visible !== false;
			const snap = useHub(visible);
			return h("div", {
				style: { display: "flex", flexDirection: "column", gap: 12, padding: "14px 14px 20px", color: V.fg, height: "100%", overflowY: "auto", boxSizing: "border-box" }
			}, h(QuotaPanelBody, { t, snap }));
		}

		// ---------- composer dock pill (below the input box) ----------
		let createPortal = null;
		try { createPortal = require("react-dom").createPortal; } catch {}
		const PILL_CSS = `
.vwf-pill{box-sizing:border-box;max-width:100%;color:var(--dsw-alias-label-tertiary);font:inherit;
  font-size:calc(var(--dsh-content-font-size-secondary,13px) - 1px);line-height:calc(20px + var(--dsh-content-font-delta-secondary,0px));
  font-variant-numeric:tabular-nums;white-space:nowrap;background:0 0;border:none;border-radius:999px;
  align-items:center;gap:6px;padding:1px 8px;display:inline-flex;cursor:pointer}
.vwf-pill:hover,.vwf-pill[aria-expanded=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}
.vwf-pill:focus-visible{outline:2px solid ${V.accent};outline-offset:1px}
.vwf-pill .vwf-pill-label{overflow:hidden;text-overflow:ellipsis;min-width:0}
.vwf-pill .vwf-sep{opacity:.5;margin:0 1px}
@media (width<=480px){.vwf-pill .vwf-pill-label{display:none}}
.vwf-pop{z-index:1100;box-sizing:border-box;position:fixed;width:min(380px,calc(100vw - 24px));max-height:min(560px,calc(100vh - 80px));
  overflow-y:auto;border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-1));
  backdrop-filter:var(--dsw-menu-backdrop-filter);--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);
  box-shadow:var(--dsw-elevation-prominent,0 8px 32px rgba(0,0,0,.2));color:${V.fg};padding:14px;
  display:flex;flex-direction:column;gap:12px;font-size:12px}
.vwf-pop .vwf-qgroup{flex-basis:100%}
`;
		function ensurePillCss() {
			const id = "dsh-vwfactory/pill.css";
			if (document.querySelector(`style[data-plugin-css="${id}"]`)) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-vwfactory";
			tag.dataset.pluginCss = id;
			tag.textContent = PILL_CSS;
			document.head.appendChild(tag);
		}
		/** Providers routed through vwFactory (see templates/llm-pi-ai.yml). */
		const isFactoryProvider = (p) => typeof p === "string" && (p === "factory" || p.startsWith("factory-"));
		const NO_MODEL_STORE = { subscribe: () => () => {}, getSnapshot: () => null };
		// ---------- alert toasts ----------
		let primToast;
		const getPrimToast = () => {
			if (primToast === undefined) {
				try { primToast = require("@deepseek-ai/dsh-client-ui-primitives").Toast || null; } catch { primToast = null; }
			}
			return primToast;
		};
		const WIN_KEY = { standard5h: "w5h", standardWeekly: "wWeek", standardMonthly: "wMonth" };
		function alertText(t, a) {
			if (a.kind === "quota") {
				const w = t(WIN_KEY[a.window] || "w5h");
				if (a.level >= 100) return fmt(t("alertFull"), { name: a.label, w, r: a.resetsAt ? fmt(t("alertFullReset"), { d: resetIn(t, a.resetsAt) }) : "" });
				return fmt(t("alertQuota"), { name: a.label, w, p: a.used });
			}
			if (a.kind === "recover") return fmt(t("alertRecover"), { name: a.label, p: a.used });
			if (a.kind === "switch") {
				const reason = a.reason === "quota" ? t("reasonQuota") : `HTTP ${a.reason}`;
				return fmt(t(a.balance ? "alertSwitchBalance" : "alertSwitch"), { from: a.from, to: a.to, reason });
			}
			return "";
		}
		// Only one mounted pill (the first) renders toasts, so split views don't double them.
		const toasterOwners = [];
		function AlertToaster({ t }) {
			const me = useRef({}).current;
			useEffect(() => {
				toasterOwners.push(me);
				return () => { const i = toasterOwners.indexOf(me); if (i >= 0) toasterOwners.splice(i, 1); };
			}, []);
			const queue = React.useSyncExternalStore(alertBus.subscribe, alertBus.get, alertBus.get);
			const a = queue[0];
			useEffect(() => {
				if (a && Date.now() - a.at >= ALERT_MAX_AGE) alertBus.shift();
			}, [a]);
			if (!a || toasterOwners[0] !== me || Date.now() - a.at >= ALERT_MAX_AGE) return null;
			const text = alertText(t, a);
			const tone = a.kind === "recover" ? "success" : undefined;
			const Prim = getPrimToast();
			if (Prim) return h(Prim, { key: a.seq, text, tone, holdMs: 6000, onDone: () => alertBus.shift() });
			const el = h("div", { key: a.seq, className: "vwf-toast", role: "alert", onAnimationEnd: () => alertBus.shift() }, text);
			return createPortal ? createPortal(el, document.body) : el;
		}
		function QuotaDockPill({ t, modelStore }) {
			ensureCss();
			ensurePillCss();
			// Show only while this session's (pending or current) model is a Factory one.
			const ms = modelStore || NO_MODEL_STORE;
			const model = React.useSyncExternalStore(ms.subscribe, ms.getSnapshot, ms.getSnapshot);
			const choice = model ? model.pending || model.current : null;
			const shown = !modelStore || (choice != null && isFactoryProvider(choice.provider));
			const snap = useHub(shown);
			const [open, setOpen] = useState(false);
			const [pos, setPos] = useState(null);
			const anchorRef = useRef(null);
			const panelRef = useRef(null);
			// place the popover above the pill, clamped to the viewport
			React.useLayoutEffect(() => {
				if (!open) { setPos(null); return; }
				const place = () => {
					const a = anchorRef.current && anchorRef.current.getBoundingClientRect();
					const p = panelRef.current;
					if (!a) return;
					const w = p ? p.offsetWidth : 380, hgt = p ? p.offsetHeight : 0;
					const left = Math.min(Math.max(a.left + a.width / 2 - w / 2, 12), window.innerWidth - w - 12);
					const top = Math.max(12, a.top - 8 - hgt);
					setPos({ left, top });
				};
				place();
				window.addEventListener("resize", place);
				window.addEventListener("scroll", place, true);
				const ro = typeof ResizeObserver !== "undefined" && panelRef.current ? new ResizeObserver(place) : null;
				if (ro) ro.observe(panelRef.current);
				return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); if (ro) ro.disconnect(); };
			}, [open]);
			// dismiss on outside pointer / Escape
			useEffect(() => {
				if (!open) return;
				const onDown = (e) => {
					const inside = (anchorRef.current && anchorRef.current.contains(e.target)) || (panelRef.current && panelRef.current.contains(e.target));
					if (!inside) setOpen(false);
				};
				const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
				document.addEventListener("pointerdown", onDown, true);
				document.addEventListener("keydown", onKey);
				return () => { document.removeEventListener("pointerdown", onDown, true); document.removeEventListener("keydown", onKey); };
			}, [open]);

			const { state, error } = snap;
			const active = state && state.identities.find((i) => i.active);
			const q = active && active.quota;
			let ring, label, tip;
			if (!state) {
				ring = h(MiniRing, { p: undefined });
				label = error ? t("pillOffline") : t("pillLoading");
				tip = error ? fmt(t("offline"), { e: error }) : t("loading");
			} else if (state.routing === "balance" && state.identities.length) {
				const ids = state.identities;
				const ws = ids.map((i) => worstOf(i.quota)).filter((w) => w !== undefined);
				const avg = ws.length ? ws.reduce((a, b) => a + b, 0) / ws.length : undefined;
				const left = avg === undefined ? null : Math.max(0, 100 - Math.round(avg));
				ring = h(MiniRing, { p: avg });
				label = h(React.Fragment, null,
					h("span", null, t("pillBalance")), " ",
					h("span", null, fmt(t("accounts"), { n: ids.length })),
					left === null ? null : h("span", { className: "vwf-sep" }, " · "),
					left === null ? null : h("span", { style: { color: avg >= 90 ? V.danger : avg >= 70 ? V.warn : undefined } }, fmt(t("balanceLeft"), { p: left })));
				tip = ids.map((i) => {
					const w = worstOf(i.quota);
					return `${accName(i)} · ${w === undefined ? "—" : fmt(t("leftPct"), { p: Math.max(0, 100 - Math.round(w)) })}${i.sessions ? " · " + fmt(t("sessionsN"), { n: i.sessions }) : ""}${i.cooldown ? " · " + t("cooling") : ""}`;
				}).join("\n");
			} else if (!active) {
				ring = h(MiniRing, { p: undefined });
				label = t("pillNoActive");
				tip = t("noActive");
			} else if (!q || q.error) {
				ring = h(MiniRing, { p: undefined });
				label = q && q.error ? t("pillQuotaError") : t("pillNoQuota");
				tip = accName(active);
			} else {
				const parts = [[t("w5hShort"), q.standard5h], [t("wWeek"), q.standardWeekly], [t("wMonth"), q.standardMonthly]].filter((x) => x[1]);
				const worst = worstOf(q);
				ring = h(MiniRing, { p: worst });
				label = h(React.Fragment, null,
					h("span", null, t("pillUsed")),
					...parts.flatMap(([n, b], i) => {
						const p = Math.round(b.usedPercent);
						const el = h("span", { key: n, style: { color: p >= 90 ? V.danger : p >= 70 ? V.warn : undefined } }, `${n} ${p}%`);
						return i === 0 ? [" ", el] : [h("span", { key: n + "s", className: "vwf-sep" }, " · "), el];
					}));
				tip = `${accName(active)} · ${t("std")} · ${fmt(t("leftPct"), { p: Math.max(0, 100 - Math.round(worst ?? 0)) })}`;
			}
			if (!shown) return null;
			const panel = open
				? h("div", {
					ref: panelRef, className: "vwf-pop", role: "dialog", "aria-label": t("paneTitle"),
					style: pos ? { left: pos.left, top: pos.top } : { left: -9999, top: -9999, visibility: "hidden" }
				}, h(QuotaPanelBody, { t, snap }))
				: null;
			return h("span", { ref: anchorRef, style: { display: "inline-flex", minWidth: 0 } },
				h("button", {
					type: "button", className: "vwf-pill", title: tip, "aria-haspopup": "dialog", "aria-expanded": open,
					onClick: () => setOpen((v) => !v)
				}, ring, h("span", { className: "vwf-pill-label" }, label)),
				panel ? (createPortal ? createPortal(panel, document.body) : panel) : null,
				h(AlertToaster, { t })
			);
		}

		const inject = ["slots", "locale"];
		function apply(ctx) {
			const t = ctx.locale.bind(NS);
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "vwfactory: dictionaries");
			const Bound = () => h(Section, { t });
			ctx.effect(() => ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "vwfactory",
				order: 90,
				label: () => t("nav"),
				locale: NS
			}, Bound)), "vwfactory: settings section");
			// Quota pill in the strip right below the composer input, shown only while
			// the session's model is routed through vwFactory (needs modelDirectories).
			ctx.inject(["modelDirectories"], (scope) => {
				const Pill = (props) => h(QuotaDockPill, { t, modelStore: props.modelStore });
				scope.effect(() => scope.slots.inject("conversation.composer.dock", () => scope.slots.register({
					name: "conversation.composer.dock",
					id: "vwfactory-quota",
					order: 50,
					locale: NS,
					inject: (sessionId) => ({ modelStore: scope.modelDirectories.directoryFor(sessionId).store })
				}, Pill)), "vwfactory: composer quota pill");
			});
			// Right-sidebar page type; optional so Settings keeps working without the sidebar.
			ctx.inject(["sidebarRightTabs"], (scope) => {
				scope.effect(() => scope.sidebarRightTabs.register({
					id: PANE_ID,
					kind: PANE_KIND,
					priority: "extension",
					keepMounted: true,
					title: () => t("tabTitle"),
					guide: [{
						id: "open",
						order: 60,
						title: () => t("tabTitle"),
						description: () => t("guideDesc"),
						icon: QuotaGlyph
					}]
				}), "vwfactory: sidebar tab type");
				const Pane = (props) => h(QuotaPane, { t, useTabInfo: props.useTabInfo });
				scope.effect(() => scope.slots.inject("sidebar.right.pane.tab", () => scope.slots.register({
					name: "sidebar.right.pane.tab",
					key: PANE_ID,
					locale: NS
				}, Pane)), "vwfactory: sidebar tab body");
			});
		}

		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
