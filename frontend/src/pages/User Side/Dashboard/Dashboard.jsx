// Dashboard.jsx — Banfico account dashboard connected to live OBIE AISP GET APIs (Account Switcher Enabled)
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import ReactApexChart from "react-apexcharts";
import DashboardNav from "../../../components/DashboardNav";
import { useAccount } from "../../../api/AccountContext";
import { fetchAccount, fetchBalance, fetchTransactions } from "../../../api/obieApi";
import { fetchSpendingRecommendations } from "../../../api/recommendationApi";
import { mapAccount, mapBalance, money, moneyUSD, maskAccount, categorize, getTransactions } from "../Banking Data/Bankingdata";

import "./Dashboard.css";

const EASE = [0.22, 1, 0.36, 1];

function buildArea(points, w, h, pad = 10) {
    if (!points || points.length === 0) return { area: `M0 ${h} L${w} ${h} Z`, line: `M0 ${h} L${w} ${h}` };
    if (points.length === 1) return { area: `M0 ${h - pad} L${w} ${h - pad} L${w} ${h} L0 ${h} Z`, line: `M0 ${h - pad} L${w} ${h - pad}` };
    const min = Math.min(...points);
    const max = Math.max(...points) || min + 1;
    const range = max - min || 1;
    const step = (w - pad * 2) / (points.length - 1);

    const coords = points.map((v, i) => {
        const x = pad + i * step;
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        return [x, y];
    });

    let d = `M${coords[0][0]},${coords[0][1]}`;
    for (let i = 1; i < coords.length; i++) {
        const [x0, y0] = coords[i - 1];
        const [x1, y1] = coords[i];
        const mx = (x0 + x1) / 2;
        d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
    }

    const area = `${d} L${coords[coords.length - 1][0]},${h} L${coords[0][0]},${h} Z`;
    return { area, line: d };
}

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
    const formatted = (d || 0).toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
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

function MiniApexChart({ seriesData, color = "#f4b78a" }) {
    const options = {
        chart: {
            type: "area",
            sparkline: { enabled: true },
            zoom: { enabled: false },
            toolbar: { show: false },
            animations: { enabled: true, easing: "easeinout", speed: 500 },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2.2 },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 100],
            },
        },
        colors: [color],
        tooltip: { enabled: false },
        xaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } },
        yaxis: { labels: { show: false } },
        grid: { show: false },
    };

    const series = [{ name: "Value", data: seriesData && seriesData.length > 0 ? seriesData : [10, 20, 15, 30] }];

    return (
        <div className="dash-stat-chart">
            <ReactApexChart options={options} series={series} type="area" height={52} width={130} />
        </div>
    );
}

const QUICK = [
    { label: "Send money", icon: <path d="M3 11l18-8-8 18-2-8-8-2z" strokeLinejoin="round" strokeLinecap="round" /> },
    { label: "Request", icon: <><path d="M12 3v12" strokeLinecap="round" /><path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 21h16" strokeLinecap="round" /></> },
    { label: "Pay a bill", icon: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h5" strokeLinecap="round" /></> },
    { label: "Move money", icon: <><path d="M4 8h13l-3-3M20 16H7l3 3" strokeLinecap="round" strokeLinejoin="round" /></> },
];

const CHAT_ENDPOINT = "http://localhost:8080/api/chat";

export default function Dashboard() {
    const reduce = useReducedMotion();
    const { selectedAccountId, selectedAccount, accounts, setSelectedAccountId } = useAccount();

    const [account, setAccount] = useState(() => selectedAccount || mapAccount(null));
    const [balance, setBalance] = useState(() => mapBalance(null));
    const [txList, setTxList] = useState(getTransactions());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [tab, setTab] = useState("all");
    const [query, setQuery] = useState("");
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [chatError, setChatError] = useState(null);
    const [chatMessages, setChatMessages] = useState([
        {
            role: "assistant",
            text: "Ask me to add, list, update, complete, or delete todos.",
        },
    ]);


    const loadData = async () => {
        if (!selectedAccountId) return;
        setLoading(true);
        setError(null);
        try {
            const [acctData, balData, txData] = await Promise.all([
                fetchAccount(selectedAccountId),
                fetchBalance(selectedAccountId),
                fetchTransactions(selectedAccountId),
            ]);
            if (acctData) setAccount(acctData);
            if (balData) setBalance(balData);
            if (txData?.transactions) setTxList(txData.transactions);
        } catch (err) {
            setError(err.message || "Couldn't load account data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedAccountId]);

    const [timeframe, setTimeframe] = useState("month"); // 'week' | 'month' | 'quarter' | 'year'

    const derived = useMemo(() => {
        const rawTx = txList && txList.length > 0 ? txList : getTransactions();
        const now = new Date();
        
        let daysLimit = 30;
        if (timeframe === "week") daysLimit = 7;
        if (timeframe === "month") daysLimit = 30;
        if (timeframe === "quarter") daysLimit = 90;
        if (timeframe === "year") daysLimit = 365;

        const cutoff = new Date(now.getTime() - daysLimit * 24 * 60 * 60 * 1000);
        
        // Filter transactions within selected timeframe (or fallback to all if range is small)
        const filteredByDate = rawTx.filter((t) => new Date(t.date || Date.now()) >= cutoff);
        const activeTx = filteredByDate.length > 0 ? filteredByDate : rawTx;

        const out = activeTx.filter((t) => t.dir === "out" || t.indicator === "Debit");
        const inc = activeTx.filter((t) => t.dir === "in" || t.indicator === "Credit");
        const totalOut = out.reduce((s, t) => s + t.amount, 0);
        const totalIn = inc.reduce((s, t) => s + t.amount, 0);

        const catMap = {};
        out.forEach((t) => {
            const c = t.cat || categorize(t.info || "");
            catMap[c] = (catMap[c] || { total: 0, count: 0 });
            catMap[c].total += t.amount;
            catMap[c].count += 1;
        });
        const cats = Object.entries(catMap)
            .map(([name, v]) => ({ name, total: v.total, count: v.count, pct: Math.round((v.total / (totalOut || 1)) * 100) }))
            .sort((a, b) => b.total - a.total);

        const trend = [...activeTx].sort((a, b) => new Date(a.date) - new Date(b.date)).map((t) => t.balanceAfter || t.amount);
        const pendingCount = activeTx.filter((t) => t.status === "PDNG").length;

        return { tx: activeTx, out, inc, totalOut, totalIn, cats, trend, pendingCount, daysLimit };
    }, [txList, timeframe]);

    const [recommendations, setRecommendations] = useState([]);
    const [recLoading, setRecLoading] = useState(false);

    const loadRecommendations = async () => {
        setRecLoading(true);
        try {
            const tfLabel = timeframe === "week" ? "Last 7 Days" : timeframe === "month" ? "This Month (Last 30 Days)" : timeframe === "quarter" ? "Last 90 Days" : "Year to Date";
            const data = await fetchSpendingRecommendations({
                timeframe: tfLabel,
                totalOut: derived.totalOut,
                totalIn: derived.totalIn,
                categories: derived.cats,
            });
            setRecommendations(data || []);
        } catch (err) {
            console.warn("Failed to load AI recommendations:", err);
        } finally {
            setRecLoading(false);
        }
    };

    useEffect(() => {
        if (derived.cats && derived.cats.length > 0) {
            loadRecommendations();
        }
    }, [derived.cats.length, derived.totalOut, timeframe]);



    const acct = maskAccount(account.identification);
    const trendPath = buildArea(derived.trend, 520, 150, 14);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return derived.tx.filter((t) => {
            const matchTab = tab === "all" || (tab === "pending" && t.status === "PDNG") || (tab === "completed" && t.status === "BOOK");
            const matchQ = !q || (t.info && t.info.toLowerCase().includes(q)) || (t.merchant && t.merchant.toLowerCase().includes(q)) || (t.reference && t.reference.toLowerCase().includes(q));
            return matchTab && matchQ;
        });
    }, [derived.tx, tab, query]);

    const rise = {
        hidden: { opacity: 0, y: reduce ? 0 : 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
    };
    const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

    return (


        <div className="dash">
            <DashboardNav user={{ name: account.holder || "Nivas Ganesan", initials: "NG", email: "nivas@banfico.io" }} active="Overview" />

            <main className="dash-main" id="overview">
                {/* ===== HEADER ===== */}
                <motion.header className="dash-head" variants={stagger} initial="hidden" animate="visible">
                    <motion.div variants={rise}>
                        <p className="dash-eyebrow">
                            Overview · {new Date(balance.asOf || Date.now()).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                            {loading && <span style={{ marginLeft: 12, opacity: 0.7 }}>• Fetching OBIE AISP Data...</span>}
                        </p>
                        <h1>Good morning, {(account.holder || "Nivas").split(" ")[0]}.</h1>
                    </motion.div>
                    <motion.div className="dash-head-actions" variants={rise}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                            <button className="dash-switch" type="button" aria-haspopup="listbox">
                                <span className="dash-switch-ico" aria-hidden="true">{(account.nickname || "A")[0]}</span>
                                <span className="dash-switch-txt">
                                    <span className="dash-switch-name">{account.nickname || "Account"}</span>
                                    <span className="dash-switch-sub">Current · {acct.sort} · ••••{acct.last}</span>
                                </span>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <select
                                value={selectedAccountId}
                                onChange={(e) => setSelectedAccountId(e.target.value)}
                                aria-label="Switch Account"
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer",
                                }}
                            >
                                {(accounts || [account]).map((a) => {
                                    const m = maskAccount(a.identification);
                                    return (
                                        <option key={a.accountId} value={a.accountId}>
                                            {a.nickname} ({m.sort} · ••••{m.last})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </motion.div>
                </motion.header>

                {/* ===== TIMEFRAME SELECTOR BAR ===== */}
                <motion.div className="dash-timeframe-bar" variants={rise} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Timeframe:</span>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {[
                            { key: "week", label: "This Week (7d)" },
                            { key: "month", label: "This Month (30d)" },
                            { key: "quarter", label: "Last 90 Days" },
                            { key: "year", label: "Year to Date" },
                        ].map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                className={`dash-tab ${timeframe === item.key ? "is-active" : ""}`}
                                onClick={() => setTimeframe(item.key)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {error && (
                    <div style={{ background: "#faecea", border: "1px solid #f4b78a", color: "#7a3e1b", padding: "12px 18px", borderRadius: 12, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>Couldn't load live transactions ({error}).</span>
                        <button type="button" onClick={loadData} style={{ background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: 999, padding: "6px 14px", cursor: "pointer", fontSize: 12 }}>
                            Retry
                        </button>
                    </div>
                )}

                {/* ===== BALANCE HERO + STATS ===== */}
                <motion.section className="dash-top" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
                    {/* hero balance artifact */}
                    <motion.div className="dash-hero" variants={rise}>
                        <div className="dash-hero-head">
                            <div>
                                <p className="dash-art-tag">{account.nickname || "Bills"} · Current account</p>
                                <p className="dash-hero-acct">{acct.sort} · ••••{acct.last}</p>
                            </div>
                            <span className="dash-chip dash-chip-mint">{account.status || "Enabled"}</span>
                        </div>

                        <p className="dash-hero-label">Current balance</p>
                        <p className="dash-hero-balance"><CountUp value={balance.current || 0} /></p>

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
                                <span className="dash-mini-val">{money(balance.available)}</span>
                            </div>
                            <div>
                                <span className="dash-mini-label">Arranged overdraft</span>
                                <span className="dash-mini-val">{money(balance.preAgreed)}</span>
                            </div>
                            <div>
                                <span className="dash-mini-label">Total value</span>
                                <span className="dash-mini-val">{money(balance.totalValue)}</span>
                            </div>
                            <div>
                                <span className="dash-mini-label">In {balance.local?.currency || "USD"}</span>
                                <span className="dash-mini-val">≈ {moneyUSD(balance.local?.amount || 0)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* stat column */}
                    <motion.div className="dash-stat-col" variants={rise}>
                        <div className="dash-stat-card">
                            <div className="dash-stat-main">
                                <div className="dash-stat-ico out" aria-hidden="true">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H9M17 7v8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div>
                                    <p className="dash-stat-label">
                                        Money out · {timeframe === "week" ? "this week" : timeframe === "month" ? "this month" : timeframe === "quarter" ? "last 90d" : "YTD"}
                                    </p>
                                    <p className="dash-stat-num"><CountUp value={derived.totalOut} /></p>
                                    <p className="dash-stat-meta">{derived.out.length} payments</p>
                                </div>
                            </div>
                            <MiniApexChart seriesData={derived.out.map((t) => t.amount)} color="#f4b78a" />
                        </div>
                        <div className="dash-stat-card">
                            <div className="dash-stat-main">
                                <div className="dash-stat-ico in" aria-hidden="true">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 7L7 17M7 17h8M7 17V9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div>
                                    <p className="dash-stat-label">
                                        Money in · {timeframe === "week" ? "this week" : timeframe === "month" ? "this month" : timeframe === "quarter" ? "last 90d" : "YTD"}
                                    </p>
                                    <p className="dash-stat-num"><CountUp value={derived.totalIn} /></p>
                                    <p className="dash-stat-meta">{derived.inc.length} deposit</p>
                                </div>
                            </div>
                            <MiniApexChart seriesData={derived.inc.map((t) => t.amount)} color="#0f7a55" />
                        </div>

                        <div className="dash-stat-card">
                            <div className="dash-stat-main">
                                <div className="dash-stat-ico" aria-hidden="true">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div>
                                    <p className="dash-stat-label">Pending</p>
                                    <p className="dash-stat-num">{derived.pendingCount}</p>
                                    <p className="dash-stat-meta">awaiting settlement</p>
                                </div>
                            </div>
                            <MiniApexChart seriesData={[12, 11, 10, 11, 9, 8, derived.pendingCount]} color="#17191c" />
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
                <section className="dash-grid">
                    {/* Spending by category card */}
                    <motion.div className="dash-card" variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
                        <div className="dash-card-head">
                            <h2>Spending by category</h2>
                            <span className="dash-card-sub">
                                {timeframe === "week" ? "Last 7 days" : timeframe === "month" ? "This month (last 30 days)" : timeframe === "quarter" ? "Last 90 days" : "Year to date"}
                            </span>

                        </div>
                        <div className="dash-cat-list">
                            {derived.cats.map((c) => (
                                <div key={c.name}>
                                    <div className="dash-cat-top">
                                        <span className="dash-cat-name">{c.name}</span>
                                        <span className="dash-cat-val">{money(c.total)}</span>
                                    </div>
                                    <Bar pct={c.pct} peach={c.name === "Utilities" || c.name === "Housing"} />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent activity card */}
                    <motion.div className="dash-card" variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
                        <div className="dash-card-head">
                            <div>
                                <h2>Recent activity</h2>
                                <p className="dash-card-sub">{filtered.length} transactions match</p>
                            </div>
                        </div>

                        <div className="dash-tabs" role="tablist" aria-label="Transaction filter">
                            {["all", "pending", "completed"].map((t) => (
                                <button
                                    key={t}
                                    role="tab"
                                    aria-selected={tab === t}
                                    className={`dash-tab${tab === t ? " is-active" : ""}`}
                                    onClick={() => setTab(t)}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="dash-tx-list">
                            {filtered.length === 0 ? (
                                <div className="dash-tx-empty">
                                    <p>No transactions found for this selection.</p>
                                </div>
                            ) : (
                                filtered.slice(0, 8).map((t) => (
                                    <div className="dash-tx-row" key={t.id || t.reference}>
                                        <div className="dash-tx-badge" aria-hidden="true">
                                            {t.dir === "out" ? "↗" : "↙"}
                                        </div>
                                        <div className="dash-tx-main">
                                            <p className="dash-tx-name">{t.merchant || t.info}</p>
                                            <p className="dash-tx-sub">{t.info} · {t.cat}</p>
                                        </div>
                                        <div className="dash-tx-meta">
                                            <p className={`dash-tx-amt ${t.dir}`}>
                                                {t.dir === "out" ? "-" : "+"}{money(t.amount)}
                                            </p>
                                            <p className="dash-tx-date">{new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </section>

                {/* ===== AI SPENDING RECOMMENDATIONS ===== */}
                <motion.section 
                    className="dash-recommendations" 
                    variants={rise} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true, margin: "-60px" }}
                >
                    <div className="dash-rec-head">
                        <div>
                            <div className="dash-rec-badge">
                                <span className="dash-rec-spark">✦</span> AI Financial Insights
                            </div>
                            <h2>Personalized Recommendations</h2>
                            <p className="dash-card-sub">Powered by Google Gemini 2.5 Flash & Spending Analysis</p>
                        </div>
                        <button 
                            type="button" 
                            className="dash-rec-refresh"
                            onClick={loadRecommendations}
                            disabled={recLoading}
                        >
                            {recLoading ? "Analyzing..." : "Refresh Insights ↻"}
                        </button>
                    </div>

                    <div className="dash-rec-grid">
                        {recLoading ? (
                            <div className="dash-rec-loading">
                                <p>Analyzing transactions & generating insights with Gemini API...</p>
                            </div>
                        ) : recommendations.length === 0 ? (
                            <div className="dash-rec-loading">
                                <p>No recommendations available for this statement period.</p>
                            </div>
                        ) : (
                            recommendations.map((rec) => (
                                <div key={rec.id} className={`dash-rec-card ${rec.type}`}>
                                    <div className="dash-rec-top">
                                        <span className={`dash-chip ${rec.type === "vault" ? "dash-chip-mint" : "dash-chip-peach"}`}>
                                            {rec.category}
                                        </span>
                                        <span className="dash-rec-impact">{rec.impact}</span>
                                    </div>
                                    <h3 className="dash-rec-title">{rec.title}</h3>
                                    <p className="dash-rec-summary">{rec.summary}</p>
                                    <button type="button" className="dash-rec-action">
                                        {rec.actionText || "Take Action"} →
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </motion.section>
            </main>
        </div>
    );
}




