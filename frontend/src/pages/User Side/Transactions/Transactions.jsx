// Transactions.jsx — full transaction history with filtering, search, expandable detail, and CSV export
import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import DashboardNav from "../../../components/DashboardNav";
import { ACCOUNT, getTransactions, money, fmtDate, fmtDateFull, fmtTime, maskAccount } from "../Banking Data/Bankingdata";
import "./Transactions.css";

const EASE = [0.22, 1, 0.36, 1];

function Arrow() {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 8h10.4M8.6 3.6 13 8l-4.4 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function exportCSV(rows) {
    const header = ["Date", "Time", "Merchant", "Description", "Category", "Reference", "Type", "Amount (GBP)", "Status", "Balance after"];
    const body = rows.map((t) => [
        t.date.slice(0, 10),
        fmtTime(t.date),
        t.merchant,
        t.info,
        t.cat,
        t.reference,
        t.indicator,
        `${t.dir === "out" ? "-" : ""}${t.amount.toFixed(2)}`,
        t.status === "PDNG" ? "Pending" : "Completed",
        t.balanceAfter.toFixed(2),
    ]);
    const csv = [header, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "banfico-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
}

const TYPES = [
    { k: "all", label: "All" },
    { k: "out", label: "Money out" },
    { k: "in", label: "Money in" },
];
const STATUSES = [
    { k: "all", label: "Any status" },
    { k: "PDNG", label: "Pending" },
    { k: "BOOK", label: "Completed" },
];

export default function Transactions() {
    const reduce = useReducedMotion();
    const all = useMemo(() => getTransactions(), []);
    const categories = useMemo(() => ["all", ...Array.from(new Set(all.map((t) => t.cat)))], [all]);

    const [query, setQuery] = useState("");
    const [type, setType] = useState("all");
    const [status, setStatus] = useState("all");
    const [cat, setCat] = useState("all");
    const [sort, setSort] = useState("newest");
    const [openId, setOpenId] = useState(null);

    const acct = maskAccount(ACCOUNT.identification);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = all.filter((t) => {
            const mq = !q || t.merchant.toLowerCase().includes(q) || t.info.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q);
            const mt = type === "all" || t.dir === type;
            const ms = status === "all" || t.status === status;
            const mc = cat === "all" || t.cat === cat;
            return mq && mt && ms && mc;
        });
        list = [...list].sort((a, b) => {
            if (sort === "newest") return new Date(b.date) - new Date(a.date);
            if (sort === "oldest") return new Date(a.date) - new Date(b.date);
            if (sort === "high") return b.amount - a.amount;
            return a.amount - b.amount;
        });
        return list;
    }, [all, query, type, status, cat, sort]);

    const totalIn = filtered.filter((t) => t.dir === "in").reduce((s, t) => s + t.amount, 0);
    const totalOut = filtered.filter((t) => t.dir === "out").reduce((s, t) => s + t.amount, 0);

    // group by calendar day, preserving current sort order of the day buckets
    const groups = useMemo(() => {
        const map = new Map();
        filtered.forEach((t) => {
            const key = t.date.slice(0, 10);
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(t);
        });
        return Array.from(map.entries());
    }, [filtered]);

    const rise = { hidden: { opacity: 0, y: reduce ? 0 : 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

    return (
        <div className="txns">
            <DashboardNav user={{ name: ACCOUNT.holder, initials: "NG", email: "nivas@banfico.io" }} active="Transactions" />

            <main className="txns-main">
                <motion.header className="txns-head" initial="hidden" animate="visible" variants={rise}>
                    <div>
                        <p className="txns-eyebrow">{ACCOUNT.nickname} · {acct.sort} · ••••{acct.last}</p>
                        <h1>Transactions</h1>
                    </div>
                    <button className="txns-export" onClick={() => exportCSV(filtered)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M12 3v12M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 21h16" strokeLinecap="round" />
                        </svg>
                        Export CSV
                    </button>
                </motion.header>

                {/* summary strip */}
                <motion.div className="txns-summary" initial="hidden" animate="visible" variants={rise}>
                    <div>
                        <span className="txns-sum-label">Showing</span>
                        <span className="txns-sum-val">{filtered.length} of {all.length}</span>
                    </div>
                    <div>
                        <span className="txns-sum-label">Money in</span>
                        <span className="txns-sum-val in">+{money(totalIn)}</span>
                    </div>
                    <div>
                        <span className="txns-sum-label">Money out</span>
                        <span className="txns-sum-val out">−{money(totalOut)}</span>
                    </div>
                    <div>
                        <span className="txns-sum-label">Net</span>
                        <span className="txns-sum-val">{totalIn - totalOut >= 0 ? "+" : "−"}{money(Math.abs(totalIn - totalOut))}</span>
                    </div>
                </motion.div>

                {/* toolbar */}
                <motion.div className="txns-toolbar" initial="hidden" animate="visible" variants={rise}>
                    <label className="txns-search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" /></svg>
                        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search payee, note or reference" aria-label="Search transactions" />
                    </label>

                    <div className="txns-tabs" role="tablist" aria-label="Type">
                        {TYPES.map((t) => (
                            <button key={t.k} role="tab" aria-selected={type === t.k} className={`txns-tab${type === t.k ? " is-active" : ""}`} onClick={() => setType(t.k)}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <select className="txns-select" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
                        {categories.map((c) => (
                            <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
                        ))}
                    </select>

                    <select className="txns-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
                        {STATUSES.map((s) => (
                            <option key={s.k} value={s.k}>{s.label}</option>
                        ))}
                    </select>

                    <select className="txns-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="high">Amount: high to low</option>
                        <option value="low">Amount: low to high</option>
                    </select>
                </motion.div>

                {/* list */}
                <motion.section className="txns-card" initial="hidden" animate="visible" variants={rise}>
                    {groups.length === 0 && (
                        <div className="txns-empty">
                            <p>No transactions match your filters.</p>
                            <button className="txns-link" onClick={() => { setQuery(""); setType("all"); setStatus("all"); setCat("all"); }}>
                                Clear filters <Arrow />
                            </button>
                        </div>
                    )}

                    {groups.map(([day, rows]) => (
                        <div className="txns-group" key={day}>
                            <div className="txns-group-head">
                                <span>{fmtDateFull(rows[0].date)}</span>
                                <span className="txns-group-sum">
                                    {rows.some((r) => r.dir === "out") && <span className="out">−{money(rows.filter((r) => r.dir === "out").reduce((s, r) => s + r.amount, 0))}</span>}
                                </span>
                            </div>

                            <ul className="txns-list">
                                {rows.map((t) => {
                                    const open = openId === t.id;
                                    return (
                                        <li className={`txns-row-wrap${open ? " open" : ""}`} key={t.id}>
                                            <button className="txns-row" aria-expanded={open} onClick={() => setOpenId(open ? null : t.id)}>
                                                <span className="txns-badge" aria-hidden="true">{t.merchant[0]}</span>
                                                <span className="txns-row-main">
                                                    <span className="txns-row-name">{t.merchant}</span>
                                                    <span className="txns-row-sub">{t.info} · {t.cat} · {t.card}</span>
                                                </span>
                                                <span className="txns-row-meta">
                                                    <span className={`txns-amt ${t.dir}`}>{t.dir === "in" ? "+" : "−"}{money(t.amount)}</span>
                                                    <span className="txns-bal">Bal {money(t.balanceAfter)}</span>
                                                </span>
                                                <span className={`txns-chip ${t.status === "PDNG" ? "peach" : "mint"}`}>{t.status === "PDNG" ? "Pending" : "Completed"}</span>
                                                <svg className={`txns-caret${open ? " up" : ""}`} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {open && (
                                                    <motion.div className="txns-detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}>
                                                        <dl className="txns-detail-grid">
                                                            <div><dt>Reference</dt><dd className="mono">{t.reference}</dd></div>
                                                            <div><dt>Booked</dt><dd>{fmtDate(t.date)} · {fmtTime(t.date)}</dd></div>
                                                            <div><dt>Value date</dt><dd>{fmtDate(t.valueDate)} · {fmtTime(t.valueDate)}</dd></div>
                                                            <div><dt>Indicator</dt><dd>{t.indicator}</dd></div>
                                                            <div><dt>Merchant category</dt><dd className="mono">MCC {t.mcc}</dd></div>
                                                            <div><dt>Card</dt><dd>{t.card} · {t.auth}</dd></div>
                                                            <div><dt>Bank code</dt><dd className="mono">{t.txnCode}</dd></div>
                                                            <div><dt>Scheme</dt><dd>{t.propCode}</dd></div>
                                                            <div><dt>Purpose</dt><dd className="mono">{t.purpose}</dd></div>
                                                            <div><dt>Balance after</dt><dd className="mono">{money(t.balanceAfter)}</dd></div>
                                                        </dl>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}

                    <div className="txns-foot">
                        <span>Showing {filtered.length} of {all.length} transactions</span>
                        <span className="txns-foot-page">Page 1 of 1</span>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}