// Dashboard.jsx — Banfico account dashboard, derived entirely from the OBIE account / balance / transaction mock payloads
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import DashboardNav from "../../../components/DashboardNav";
import "./Dashboard.css";

const EASE = [0.22, 1, 0.36, 1];

/* ---------------------------------------------------------------------------
   MOCK DATA — shaped like the OBIE responses you provided.
   Everything on the page is computed from these three objects.
--------------------------------------------------------------------------- */

const ACCOUNT = {
  accountId: "6a62009ac47905bfc3f196cd",
  nickname: "Bills",
  description: "For paying bills",
  holder: "Nivas Ganesan",
  currency: "GBP",
  category: "Personal",
  typeCode: "CACC", // current account
  status: "Enabled",
  openingDate: "2002-01-05",
  identification: "68130781747936", // sort code (6) + account number (8)
};

const BALANCE = {
  current: 329.06, // CLAV
  available: 401.0, // credit line "Available"
  preAgreed: 501.0, // credit line "Pre-Agreed"
  totalValue: 720.39,
  local: { amount: 400.0, currency: "USD" },
  currency: "GBP",
  asOf: "2026-07-25T06:55:38.237Z",
};

const RAW_TX = [
  { id: "…19cb8", info: "Paid the gas bill", merchant: "Lubowitz, Krajcik and Olson", amount: 284.58, date: "2026-07-25T06:55:38.237Z", status: "PDNG", balance: 613.64, card: "MasterCard" },
  { id: "…19855", info: "Utility bill payment", merchant: "Shanahan LLC", amount: 449.99, date: "2026-07-25T05:37:18.328Z", status: "PDNG", balance: 779.05, card: "MasterCard" },
  { id: "…19854", info: "Utility bill payment", merchant: "Stiedemann, Spinka and Nolan", amount: 436.39, date: "2026-07-25T05:36:22.517Z", status: "PDNG", balance: 765.45, card: "MasterCard" },
  { id: "…19848", info: "Online subscription", merchant: "Schowalter Group", amount: 342.9, date: "2026-07-25T05:32:51.471Z", status: "PDNG", balance: 671.96, card: "MasterCard" },
  { id: "…19786", info: "Monthly rent transfer", merchant: "Kuhlman Inc", amount: 339.12, date: "2026-07-24T09:30:55.667Z", status: "PDNG", balance: 668.18, card: "MasterCard" },
  { id: "…19780", info: "Paid the gas bill", merchant: "Hansen, Kshlerin and Koelpin", amount: 387.98, date: "2026-07-24T06:14:10.537Z", status: "PDNG", balance: 717.04, card: "MasterCard" },
  { id: "…1977a", info: "Utility bill payment", merchant: "Baumbach, Anderson and Kiehn", amount: 140.78, date: "2026-07-23T12:41:33.096Z", status: "PDNG", balance: 469.84, card: "MasterCard" },
  { id: "…19779", info: "Grocery shopping", merchant: "Schiller - Larkin", amount: 415.11, date: "2026-07-23T12:41:32.591Z", status: "PDNG", balance: 744.17, card: "MasterCard" },
  { id: "…19778", info: "Monthly rent transfer", merchant: "Stokes Inc", amount: 327.42, date: "2026-07-23T12:41:32.092Z", status: "PDNG", balance: 656.48, card: "MasterCard" },
  { id: "…19777", info: "Online subscription", merchant: "Jacobs, Donnelly and Wilderman", amount: 142.43, date: "2026-07-23T12:41:31.593Z", status: "PDNG", balance: 471.49, card: "MasterCard" },
  { id: "…19776", info: "Online subscription", merchant: "Braun, Lesch and Langworth", amount: 430.44, date: "2026-07-23T12:41:30.307Z", status: "PDNG", balance: 759.5, card: "MasterCard" },
  { id: "…19775", info: "Paid the gas bill", merchant: "Wolff - Murphy", amount: 57.44, date: "2026-07-23T12:32:09.323Z", status: "PDNG", balance: 386.5, card: "MasterCard" },
  { id: "…196d2", info: "Cash from Aubrey", merchant: "Aubrey", amount: 20.0, date: "2017-04-05T10:43:07.000Z", status: "BOOK", balance: 230.0, card: "VISA" },
];

/* ---------------------------------------------------------------------------
   Derivation helpers
--------------------------------------------------------------------------- */

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function money(n) {
  return gbp.format(n);
}

function categorize(info) {
  const s = info.toLowerCase();
  if (s.includes("gas") || s.includes("utility")) return { cat: "Utilities", dir: "out" };
  if (s.includes("subscription")) return { cat: "Subscriptions", dir: "out" };
  if (s.includes("rent")) return { cat: "Housing", dir: "out" };
  if (s.includes("grocery") || s.includes("groceries")) return { cat: "Groceries", dir: "out" };
  if (s.includes("cash from") || s.includes("salary") || s.includes("refund") || s.includes("payroll")) return { cat: "Income", dir: "in" };
  return { cat: "Other", dir: "out" };
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function maskAccount(id) {
  const sort = `${id.slice(0, 2)}-${id.slice(2, 4)}-${id.slice(4, 6)}`;
  const last = id.slice(-4);
  return { sort, last };
}

/* build an svg area+line path from a series of values */
function buildArea(values, w, h, pad) {
  if (values.length < 2) return { line: "", area: "" };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => [i * step, h - pad - ((v - min) / range) * (h - pad * 2)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return { line, area };
}

/* ---------------------------------------------------------------------------
   Small presentational helpers
--------------------------------------------------------------------------- */

function CountUp({ value, decimals = 2, prefix = "£", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [d, setD] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) { setD(value); return undefined; }
    let raf;
    const start = performance.now();
    const dur = 1100;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setD(value * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);
  const formatted = d.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function Bar({ pct, peach }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  return (
    <span className="dash-bar" ref={ref}>
      <span className={`dash-bar-fill${peach ? " peach" : ""}`} style={{ width: inView || reduce ? `${pct}%` : 0 }} />
    </span>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 8h10.4M8.6 3.6 13 8l-4.4 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const QUICK = [
  { label: "Send money", icon: <path d="M3 11l18-8-8 18-2-8-8-2z" strokeLinejoin="round" strokeLinecap="round" /> },
  { label: "Request", icon: <><path d="M12 3v12" strokeLinecap="round" /><path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 21h16" strokeLinecap="round" /></> },
  { label: "Pay a bill", icon: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h5" strokeLinecap="round" /></> },
  { label: "Move money", icon: <><path d="M4 8h13l-3-3M20 16H7l3 3" strokeLinecap="round" strokeLinejoin="round" /></> },
];

/* ---------------------------------------------------------------------------
   Dashboard
--------------------------------------------------------------------------- */

export default function Dashboard() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const derived = useMemo(() => {
    const tx = RAW_TX.map((t) => ({ ...t, ...categorize(t.info) }));
    const out = tx.filter((t) => t.dir === "out");
    const inc = tx.filter((t) => t.dir === "in");
    const totalOut = out.reduce((s, t) => s + t.amount, 0);
    const totalIn = inc.reduce((s, t) => s + t.amount, 0);

    const catMap = {};
    out.forEach((t) => { catMap[t.cat] = (catMap[t.cat] || { total: 0, count: 0 }); catMap[t.cat].total += t.amount; catMap[t.cat].count += 1; });
    const cats = Object.entries(catMap)
      .map(([name, v]) => ({ name, total: v.total, count: v.count, pct: Math.round((v.total / totalOut) * 100) }))
      .sort((a, b) => b.total - a.total);

    const trend = [...tx].sort((a, b) => new Date(a.date) - new Date(b.date)).map((t) => t.balance);

    const pendingCount = tx.filter((t) => t.status === "PDNG").length;

    return { tx, out, inc, totalOut, totalIn, cats, trend, pendingCount };
  }, []);

  const acct = maskAccount(ACCOUNT.identification);
  const largestCat = derived.cats[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return derived.tx.filter((t) => {
      const matchTab = tab === "all" || (tab === "pending" && t.status === "PDNG") || (tab === "completed" && t.status === "BOOK");
      const matchQ = !q || t.merchant.toLowerCase().includes(q) || t.info.toLowerCase().includes(q);
      return matchTab && matchQ;
    });
  }, [derived.tx, tab, query]);

  const trendPath = buildArea(derived.trend, 520, 150, 14);

  const insights = [
    {
      icon: <path d="M12 2v20M2 12h20" strokeLinecap="round" />,
      text: (
        <>
          <b>Utilities</b> is your largest category — {money(derived.cats.find((c) => c.name === "Utilities")?.total || 0)} across{" "}
          {derived.cats.find((c) => c.name === "Utilities")?.count} payments this period.
        </>
      ),
    },
    {
      icon: <><path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" /></>,
      text: (
        <>
          Two utility payments cleared within a minute of each other — possible <b>duplicate</b>. Review before they settle.
        </>
      ),
    },
    {
      icon: <><path d="M12 3v18M5 10l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" /></>,
      text: (
        <>
          Rent left the account <b>twice</b> ({money(derived.cats.find((c) => c.name === "Housing")?.total || 0)}). Confirm both were intended.
        </>
      ),
    },
  ];

  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

  return (
    <div className="dash">
      <DashboardNav user={{ name: ACCOUNT.holder, initials: "NG", email: "nivas@banfico.io" }} active="Overview" />

      <main className="dash-main" id="overview">
        {/* ===== HEADER ===== */}
        <motion.header className="dash-head" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={rise}>
            <p className="dash-eyebrow">Overview · {new Date(BALANCE.asOf).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1>Good morning, {ACCOUNT.holder.split(" ")[0]}.</h1>
          </motion.div>
          <motion.div className="dash-head-actions" variants={rise}>
            <button className="dash-switch" aria-haspopup="listbox">
              <span className="dash-switch-ico" aria-hidden="true">{ACCOUNT.nickname[0]}</span>
              <span className="dash-switch-txt">
                <span className="dash-switch-name">{ACCOUNT.nickname}</span>
                <span className="dash-switch-sub">Current · {acct.sort} · ••••{acct.last}</span>
              </span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </motion.div>
        </motion.header>

        {/* ===== BALANCE HERO + STATS ===== */}
        <motion.section className="dash-top" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* hero balance artifact */}
          <motion.div className="dash-hero" variants={rise}>
            <div className="dash-hero-head">
              <div>
                <p className="dash-art-tag">{ACCOUNT.nickname} · Current account</p>
                <p className="dash-hero-acct">{acct.sort} · ••••{acct.last}</p>
              </div>
              <span className="dash-chip dash-chip-mint">{ACCOUNT.status}</span>
            </div>

            <p className="dash-hero-label">Current balance</p>
            <p className="dash-hero-balance"><CountUp value={BALANCE.current} /></p>

            <svg className="dash-hero-area" viewBox="0 0 520 150" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--peach)" stopOpacity=".65" />
                  <stop offset="1" stopColor="var(--peach)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={trendPath.area} fill="url(#dash-fill)" />
              <path d={trendPath.line} fill="none" stroke="var(--sienna)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </svg>

            <div className="dash-hero-foot">
              <div>
                <span className="dash-mini-label">Available</span>
                <span className="dash-mini-val">{money(BALANCE.available)}</span>
              </div>
              <div>
                <span className="dash-mini-label">Arranged overdraft</span>
                <span className="dash-mini-val">{money(BALANCE.preAgreed)}</span>
              </div>
              <div>
                <span className="dash-mini-label">Total value</span>
                <span className="dash-mini-val">{money(BALANCE.totalValue)}</span>
              </div>
              <div>
                <span className="dash-mini-label">In {BALANCE.local.currency}</span>
                <span className="dash-mini-val">≈ {usd.format(BALANCE.local.amount)}</span>
              </div>
            </div>
          </motion.div>

          {/* stat column */}
          <motion.div className="dash-stat-col" variants={rise}>
            <div className="dash-stat-card">
              <div className="dash-stat-ico out" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H9M17 7v8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <p className="dash-stat-label">Money out · this week</p>
                <p className="dash-stat-num"><CountUp value={derived.totalOut} /></p>
                <p className="dash-stat-meta">{derived.out.length} payments</p>
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-ico in" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 7L7 17M7 17h8M7 17V9" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <p className="dash-stat-label">Money in · this week</p>
                <p className="dash-stat-num"><CountUp value={derived.totalIn} /></p>
                <p className="dash-stat-meta">{derived.inc.length} deposit</p>
              </div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-ico" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <p className="dash-stat-label">Pending</p>
                <p className="dash-stat-num">{derived.pendingCount}</p>
                <p className="dash-stat-meta">awaiting settlement</p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ===== QUICK ACTIONS ===== */}
        <motion.section className="dash-quick" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} id="payments">
          {QUICK.map((q) => (
            <motion.button className="dash-quick-btn" key={q.label} variants={rise}>
              <span className="dash-quick-ico" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{q.icon}</svg>
              </span>
              {q.label}
            </motion.button>
          ))}
        </motion.section>

        {/* ===== MAIN GRID ===== */}
        <div className="dash-grid">
          {/* transactions */}
          <motion.section className="dash-card dash-tx" variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} id="accounts">
            <div className="dash-card-head">
              <h2>Transactions</h2>
              <label className="dash-tx-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" /></svg>
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search payee or note" aria-label="Search transactions" />
              </label>
            </div>

            <div className="dash-tabs" role="tablist" aria-label="Transaction filter">
              {[
                { k: "all", label: `All · ${derived.tx.length}` },
                { k: "pending", label: `Pending · ${derived.pendingCount}` },
                { k: "completed", label: `Completed · ${derived.tx.length - derived.pendingCount}` },
              ].map((t) => (
                <button key={t.k} role="tab" aria-selected={tab === t.k} className={`dash-tab${tab === t.k ? " is-active" : ""}`} onClick={() => setTab(t.k)}>
                  {t.label}
                </button>
              ))}
            </div>

            <ul className="dash-tx-list">
              {filtered.map((t) => (
                <li className="dash-tx-row" key={t.id}>
                  <span className="dash-tx-badge" aria-hidden="true">{t.merchant[0]}</span>
                  <div className="dash-tx-main">
                    <p className="dash-tx-name">{t.merchant}</p>
                    <p className="dash-tx-sub">
                      {t.info} · {t.cat} · {t.card}
                    </p>
                  </div>
                  <div className="dash-tx-meta">
                    <p className={`dash-tx-amt ${t.dir}`}>
                      {t.dir === "in" ? "+" : "−"}
                      {money(t.amount).replace("£", "£")}
                    </p>
                    <p className="dash-tx-date">
                      {fmtDate(t.date)} · {fmtTime(t.date)}
                    </p>
                  </div>
                  <span className={`dash-chip ${t.status === "PDNG" ? "dash-chip-peach" : "dash-chip-mint"}`}>
                    {t.status === "PDNG" ? "Pending" : "Completed"}
                  </span>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="dash-tx-empty">
                  <p>No transactions match “{query}”.</p>
                  <button className="dash-link" onClick={() => { setQuery(""); setTab("all"); }}>
                    Clear filters <Arrow />
                  </button>
                </li>
              )}
            </ul>
          </motion.section>

          {/* right rail */}
          <div className="dash-rail" id="insights">
            {/* spending */}
            <motion.section className="dash-card" variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="dash-card-head">
                <h2>Spending by category</h2>
                <span className="dash-card-sub">{money(derived.totalOut)} out</span>
              </div>
              <ul className="dash-cat-list">
                {derived.cats.map((c) => (
                  <li className="dash-cat" key={c.name}>
                    <div className="dash-cat-top">
                      <span className="dash-cat-name">{c.name}</span>
                      <span className="dash-cat-val">{money(c.total)}</span>
                    </div>
                    <Bar pct={c.pct} peach={c.name === largestCat.name} />
                    <span className="dash-cat-pct">{c.pct}% · {c.count} {c.count === 1 ? "payment" : "payments"}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* insights */}
            <motion.section className="dash-card" variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="dash-card-head">
                <h2>AI insights</h2>
                <span className="dash-card-sub">3 this week</span>
              </div>
              <ul className="dash-insights">
                {insights.map((it, i) => (
                  <li className="dash-insight" key={i}>
                    <span className="dash-insight-ico" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{it.icon}</svg>
                    </span>
                    <p>{it.text}</p>
                  </li>
                ))}
              </ul>
              <a href="#" className="dash-link">
                Open full report <Arrow />
              </a>
            </motion.section>

            {/* account details */}
            <motion.section className="dash-card" variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} id="cards">
              <div className="dash-card-head">
                <h2>Account details</h2>
              </div>
              <dl className="dash-details">
                <div><dt>Holder</dt><dd>{ACCOUNT.holder}</dd></div>
                <div><dt>Type</dt><dd>Current account</dd></div>
                <div><dt>Sort code</dt><dd className="mono">{acct.sort}</dd></div>
                <div><dt>Account no.</dt><dd className="mono">••••{acct.last}</dd></div>
                <div><dt>Currency</dt><dd>{ACCOUNT.currency}</dd></div>
                <div><dt>Opened</dt><dd>{new Date(ACCOUNT.openingDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</dd></div>
              </dl>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}