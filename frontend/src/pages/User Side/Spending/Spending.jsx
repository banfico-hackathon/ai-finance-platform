// Spending.jsx — spending analysis derived from the transaction data (categories, daily trend, top merchants)
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import DashboardNav from "../../../components/DashboardNav";
import { ACCOUNT, getTransactions, money, fmtDate, byCategory, byDay, byMerchant } from "../Banking Data/Bankingdata";
import "./Spending.css";

const EASE = [0.22, 1, 0.36, 1];

// tonal palette: neutrals + one peach (keeps the achromatic-plus-peach system)
const SEG_COLORS = ["var(--peach-line)", "var(--ink)", "var(--slate)", "var(--ash)", "var(--smoke)"];

function CountUp({ value }) {
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
            setD(value * (1 - Math.pow(1 - t, 3)));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, reduce, value]);
    return <span ref={ref}>£{d.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
}

function Donut({ segments }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const reduce = useReducedMotion();
    const show = inView || reduce;
    let offset = 25; // start at 12 o'clock
    return (
        <svg className="spend-donut" viewBox="0 0 42 42" ref={ref} role="img" aria-label="Spending by category">
            <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--mist)" strokeWidth="5" />
            {segments.map((s, i) => {
                const dash = show ? s.pct : 0;
                const el = (
                    <circle
                        key={s.name}
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="none"
                        stroke={SEG_COLORS[i % SEG_COLORS.length]}
                        strokeWidth="5"
                        strokeDasharray={`${dash} ${100 - dash}`}
                        strokeDashoffset={offset}
                        style={{ transition: `stroke-dasharray .9s ${i * 0.08}s cubic-bezier(.22,1,.36,1)` }}
                    />
                );
                offset -= s.pct;
                return el;
            })}
            <text x="21" y="20" className="spend-donut-num">{segments.length}</text>
            <text x="21" y="25.5" className="spend-donut-lab">categories</text>
        </svg>
    );
}

function Bar({ pct, color }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const reduce = useReducedMotion();
    return (
        <span className="spend-bar" ref={ref}>
            <span className="spend-bar-fill" style={{ width: inView || reduce ? `${pct}%` : 0, background: color }} />
        </span>
    );
}

export default function Spending() {
    const reduce = useReducedMotion();
    const all = useMemo(() => getTransactions(), []);
    const out = useMemo(() => all.filter((t) => t.dir === "out"), [all]);
    const inc = useMemo(() => all.filter((t) => t.dir === "in"), [all]);

    const cats = useMemo(() => byCategory(out), [out]);
    const days = useMemo(() => byDay(out), [out]);
    const merchants = useMemo(() => byMerchant(out).slice(0, 5), [out]);

    const totalOut = out.reduce((s, t) => s + t.amount, 0);
    const totalIn = inc.reduce((s, t) => s + t.amount, 0);
    const avg = out.length ? totalOut / out.length : 0;
    const largest = out.reduce((m, t) => (t.amount > m.amount ? t : m), out[0]);
    const maxDay = Math.max(...days.map((d) => d.total), 1);

    const period = useMemo(() => {
        const sorted = [...out].sort((a, b) => new Date(a.date) - new Date(b.date));
        return { from: sorted[0]?.date, to: sorted[sorted.length - 1]?.date };
    }, [out]);

    const rise = { hidden: { opacity: 0, y: reduce ? 0 : 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
    const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
    const io = { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-60px" } };

    return (
        <div className="spend">
            <DashboardNav user={{ name: ACCOUNT.holder, initials: "NG", email: "nivas@banfico.io" }} active="Spending" />

            <main className="spend-main">
                <motion.header className="spend-head" initial="hidden" animate="visible" variants={rise}>
                    <div>
                        <p className="spend-eyebrow">{ACCOUNT.nickname} · {period.from && `${fmtDate(period.from)} – ${fmtDate(period.to)}`}</p>
                        <h1>Spending analysis</h1>
                    </div>
                </motion.header>

                {/* headline stats */}
                <motion.section className="spend-stats" variants={stagger} {...io}>
                    <motion.div className="spend-stat" variants={rise}>
                        <p className="spend-stat-label">Total out</p>
                        <p className="spend-stat-num"><CountUp value={totalOut} /></p>
                        <p className="spend-stat-meta">{out.length} payments</p>
                    </motion.div>
                    <motion.div className="spend-stat" variants={rise}>
                        <p className="spend-stat-label">Money in</p>
                        <p className="spend-stat-num spend-in"><CountUp value={totalIn} /></p>
                        <p className="spend-stat-meta">{inc.length} deposit</p>
                    </motion.div>
                    <motion.div className="spend-stat" variants={rise}>
                        <p className="spend-stat-label">Average payment</p>
                        <p className="spend-stat-num"><CountUp value={avg} /></p>
                        <p className="spend-stat-meta">per transaction</p>
                    </motion.div>
                    <motion.div className="spend-stat" variants={rise}>
                        <p className="spend-stat-label">Largest</p>
                        <p className="spend-stat-num"><CountUp value={largest.amount} /></p>
                        <p className="spend-stat-meta">{largest.merchant}</p>
                    </motion.div>
                </motion.section>

                <div className="spend-grid">
                    {/* donut + legend */}
                    <motion.section className="spend-card spend-breakdown" variants={rise} {...io}>
                        <div className="spend-card-head">
                            <h2>By category</h2>
                            <span className="spend-card-sub">{money(totalOut)} out</span>
                        </div>
                        <div className="spend-breakdown-body">
                            <Donut segments={cats} />
                            <ul className="spend-legend">
                                {cats.map((c, i) => (
                                    <li key={c.name}>
                                        <span className="spend-legend-dot" style={{ background: SEG_COLORS[i % SEG_COLORS.length] }} aria-hidden="true" />
                                        <span className="spend-legend-name">{c.name}</span>
                                        <span className="spend-legend-pct">{c.pct}%</span>
                                        <span className="spend-legend-val">{money(c.total)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.section>

                    {/* daily trend */}
                    <motion.section className="spend-card" variants={rise} {...io}>
                        <div className="spend-card-head">
                            <h2>Daily spend</h2>
                            <span className="spend-card-sub">{days.length} days</span>
                        </div>
                        <div className="spend-days">
                            {days.map((d) => (
                                <div className="spend-day" key={d.date}>
                                    <div className="spend-day-track">
                                        <motion.div
                                            className="spend-day-fill"
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${(d.total / maxDay) * 100}%` }}
                                            viewport={{ once: true, margin: "-40px" }}
                                            transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
                                        />
                                    </div>
                                    <span className="spend-day-val">{money(d.total)}</span>
                                    <span className="spend-day-lab">{fmtDate(d.date)}</span>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>

                {/* category detail bars */}
                <motion.section className="spend-card" variants={rise} {...io}>
                    <div className="spend-card-head">
                        <h2>Where it went</h2>
                        <span className="spend-card-sub">share of outgoings</span>
                    </div>
                    <ul className="spend-cat-list">
                        {cats.map((c, i) => (
                            <li className="spend-cat" key={c.name}>
                                <div className="spend-cat-top">
                                    <span className="spend-cat-name">{c.name}</span>
                                    <span className="spend-cat-val">{money(c.total)} <span className="spend-cat-pct">· {c.pct}%</span></span>
                                </div>
                                <Bar pct={c.pct} color={SEG_COLORS[i % SEG_COLORS.length]} />
                                <span className="spend-cat-meta">{c.count} {c.count === 1 ? "payment" : "payments"} · avg {money(c.total / c.count)}</span>
                            </li>
                        ))}
                    </ul>
                </motion.section>

                {/* top merchants */}
                <motion.section className="spend-card" variants={rise} {...io}>
                    <div className="spend-card-head">
                        <h2>Top payees</h2>
                        <span className="spend-card-sub">by amount</span>
                    </div>
                    <ol className="spend-merchants">
                        {merchants.map((m, i) => (
                            <li className="spend-merchant" key={m.name}>
                                <span className="spend-merchant-rank">{String(i + 1).padStart(2, "0")}</span>
                                <span className="spend-merchant-badge" aria-hidden="true">{m.name[0]}</span>
                                <span className="spend-merchant-main">
                                    <span className="spend-merchant-name">{m.name}</span>
                                    <span className="spend-merchant-sub">{m.cat} · {m.count} {m.count === 1 ? "payment" : "payments"}</span>
                                </span>
                                <span className="spend-merchant-val">{money(m.total)}</span>
                            </li>
                        ))}
                    </ol>
                </motion.section>
            </main>
        </div>
    );
}