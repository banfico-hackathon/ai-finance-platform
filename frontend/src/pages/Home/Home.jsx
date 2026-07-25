// Home.jsx — Banfico landing page in the Steep editorial style: hero collage, cashflow forecast, card visual, insights, count-up stats, FAQ, footer
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import "./Home.css";

const EASE = [0.22, 1, 0.36, 1];

const TRUST = ["NORTHWIND", "OAKLINE", "FERNMONT", "CALLOWAY", "LUMEN & CO", "DRIFTWOOD"];

const LEDGER = [
  { desc: "Payroll · Meridian Studio", date: "Jul 21 · 09:02", amount: "+$3,150.00", pos: true },
  { desc: "Ridgeline Grocery", date: "Jul 21 · 18:44", amount: "−$84.12" },
  { desc: "Northwind Energy", date: "Jul 20 · 07:10", amount: "−$96.30", flag: "AI · duplicate" },
  { desc: "Blue Door Coffee", date: "Jul 19 · 08:21", amount: "−$6.40" },
  { desc: "Transfer → Savings · Auto", date: "Jul 18 · 00:05", amount: "−$140.00" },
  { desc: "Apple · Subscription", date: "Jul 17 · 12:00", amount: "−$9.99" },
];

const FEATURES = [
  {
    tag: "01 · Finance",
    title: "Self-filing smart accounts",
    body: "Checking and savings spaces that organize, label, and balance themselves — no manual tagging, ever.",
    cta: "Explore accounts",
    href: "#product",
  },
  {
    tag: "02 · AI engine",
    title: "Plain-language weekly briefs",
    body: "A written summary of where your money actually went — clear prose, delivered every Monday. No dashboards required.",
    cta: "See the AI",
    href: "#ai",
  },
  {
    tag: "03 · Infrastructure",
    title: "Instant real-time clearing",
    body: "Money lands in seconds, around the clock, over instant settlement rails — with zero hidden fees or weekend delays.",
    cta: "Move money faster",
    href: "#faq",
  },
];

const CATEGORIES = [
  { name: "Housing", w: 78, val: "$1,840" },
  { name: "Groceries", w: 46, val: "$612" },
  { name: "Subscriptions", w: 30, val: "$188", peach: true },
  { name: "Dining", w: 22, val: "$146" },
];

const INSIGHTS = [
  {
    icon: <path d="M12 2v20M2 12h20" strokeLinecap="round" />,
    text: (
      <>
        Duplicate charge from <b>Northwind Energy</b> — refund of <span className="home-amt">$96.30</span> requested
        automatically.
      </>
    ),
  },
  {
    icon: <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />,
    text: (
      <>
        Unused streaming subscription cancelled — saving <span className="home-amt">$15.99</span>/mo.
      </>
    ),
  },
  {
    icon: <path d="M12 3v18M5 10l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />,
    text: (
      <>
        Payday buffer healthy — <span className="home-amt">$140.00</span> auto-swept to your 4.30% vault.
      </>
    ),
  },
];

const WALLET_POINTS = [
  "Real-time spend notifications with merchant clean-up",
  "Virtual cards for every subscription, killed in one tap",
  "2% back on essentials, swept straight to savings",
];

const STATS = [
  { value: 2.4, decimals: 1, prefix: "$", suffix: "B", label: "Moved securely" },
  { value: 180, decimals: 0, suffix: "k", label: "Active accounts" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Average rating" },
];

const FAQS = [
  {
    q: "Is Banfico a bank?",
    a: "Banfico is a financial technology company, not a bank. Accounts and cards are provided by FDIC-insured partner banks, so deposits carry the same protection you would expect from a traditional institution — up to $250,000.",
  },
  {
    q: "What does the AI do with my data?",
    a: "It reads your own transaction history to label spending, catch fees, and write your weekly brief. Your data is encrypted at rest, never sold, and never used to train models for anyone else.",
  },
  {
    q: "How fast are transfers, really?",
    a: "Transfers between Banfico accounts settle instantly. External transfers over real-time payment rails typically land in under thirty seconds, around the clock — including weekends and holidays.",
  },
  {
    q: "What does Banfico cost?",
    a: "The account is free — no monthly fees, no minimums, no overdraft charges. A Plus tier adds deeper forecasting and shared accounts for $9 a month.",
  },
  {
    q: "Can I talk to a human?",
    a: "Always. The AI handles the reading; people handle the listening. Support is staffed by humans seven days a week, in the app or on the phone.",
  },
];

const FOOTER_COLS = [
  { h: "Product", links: ["Smart Accounts", "AI Insights", "Transfers", "Savings & Yield"] },
  { h: "Company", links: ["About", "Careers", "Press", "Security"] },
  { h: "Resources", links: ["Docs", "Help center", "API reference", "Changelog"] },
  { h: "Legal", links: ["Privacy", "Terms", "FDIC disclosure", "Licenses"] },
];

/* ---------- small building blocks ---------- */

function Arrow({ className = "" }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 8h10.4M8.6 3.6 13 8l-4.4 4.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CountUp({ value, decimals = 0, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setDisplay(value);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function CategoryBar({ name, w, val, peach }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  return (
    <div className="home-cat-row" ref={ref}>
      <span className="home-cat-name">{name}</span>
      <span className="home-cat-bar">
        <span
          className={`home-cat-fill${peach ? " peach" : ""}`}
          style={{ width: inView || reduce ? `${w}%` : 0 }}
        />
      </span>
      <span className="home-cat-val">{val}</span>
    </div>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);
  const [prompt, setPrompt] = useState("");

  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
  const inViewProps = { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" } };

  return (
    <div className="home">
      <main>
        {/* ===== HERO ===== */}
        <section className="home-hero">
          <div className="home-container">
            <motion.div className="home-hero-head" variants={stagger} initial="hidden" animate="visible">
              <motion.p className="home-eyebrow" variants={rise}>
                — AI banking, quietly intelligent
              </motion.p>
              <motion.h1 variants={rise}>
                Your money, read like a <em>good essay</em>.
              </motion.h1>
              <motion.p className="home-hero-sub" variants={rise}>
                Banfico pairs a smart account with an AI that studies every dollar in and out — so your balance always
                arrives with a point of view.
              </motion.p>
              <motion.div className="home-cta-pair" variants={rise}>
                <Link to="/auth" className="home-pill home-pill-filled">
                  Open an account <Arrow />
                </Link>
                <a href="#product" className="home-pill home-pill-ghost">
                  See it work
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              className="home-collage"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            >
              {/* balance artifact */}
              <div className="home-art home-art-balance">
                <div className="home-avatar-cursor" aria-hidden="true">
                  <div className="home-avatar">MO</div>
                  <svg className="home-cursor" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3l7 18 3-7 7-3L3 3z" />
                  </svg>
                </div>
                <div className="home-art-head">
                  <span className="home-art-tag">Everyday · Smart account</span>
                  <span className="home-art-live">
                    <span className="home-dot-live" />
                    Live sync
                  </span>
                </div>
                <div className="home-art-num">$48,210.55</div>
                <svg className="home-spark" viewBox="0 0 280 66" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 50 Q40 42 80 46 T160 28 T240 18 L280 12 L280 66 L0 66 Z" fill="var(--peach)" opacity=".55" />
                  <path
                    d="M0 50 Q40 42 80 46 T160 28 T240 18 L280 12"
                    fill="none"
                    stroke="var(--sienna)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="home-art-foot">
                  <span className="home-peach-pill">AI saved you $312 this month</span>
                  <span>+2.4% MTD</span>
                </div>
              </div>

              {/* ledger artifact */}
              <div className="home-art home-art-ledger">
                <div className="home-art-head">
                  <span className="home-art-tag">Real-time ledger</span>
                  <span className="home-art-note">Auto-cleared</span>
                </div>
                <table className="home-ledger-table">
                  <caption className="home-sr-only">Recent transactions</caption>
                  <tbody>
                    {LEDGER.map((t) => (
                      <tr key={t.desc}>
                        <td>
                          <span className="home-ledger-desc">
                            {t.desc}
                            {t.flag && <span className="home-flag">{t.flag}</span>}
                          </span>
                          <span className="home-ledger-date">{t.date}</span>
                        </td>
                        <td className={t.pos ? "home-pos" : undefined}>{t.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* composer artifact */}
              <div className="home-composer">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--smoke)"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4l3 3" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask Banfico AI…  e.g. Audit my recurring subscriptions"
                  aria-label="Ask Banfico AI"
                />
                <button type="button" className="home-send" aria-label="Send">
                  <Arrow />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== TRUST ===== */}
        <section className="home-trust" aria-label="Trusted by">
          <motion.div className="home-container home-trust-inner" variants={rise} {...inViewProps}>
            <span className="home-trust-label">Trusted by teams at</span>
            <ul className="home-trust-list">
              {TRUST.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="home-sec home-sec-fog" id="product">
          <div className="home-container">
            <motion.div className="home-sec-head" variants={stagger} {...inViewProps}>
              <motion.p className="home-eyebrow" variants={rise}>
                — The system
              </motion.p>
              <motion.h2 variants={rise}>An analyst that never sleeps.</motion.h2>
              <motion.p variants={rise}>
                While you rest, it reads. Every account, every charge, every quiet drift — reviewed nightly and reported
                back in plain English.
              </motion.p>
            </motion.div>
            <motion.div className="home-cards-3" variants={stagger} {...inViewProps}>
              {FEATURES.map((f) => (
                <motion.article className="home-ncard" key={f.title} variants={rise}>
                  <div>
                    <span className="home-tag">{f.tag}</span>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                  <a href={f.href} className="home-tlink">
                    {f.cta} <Arrow />
                  </a>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== SHOWCASE DASHBOARD ===== */}
        <section className="home-sec" id="ai">
          <div className="home-container">
            <motion.div className="home-sec-head" variants={stagger} {...inViewProps}>
              <motion.p className="home-eyebrow" variants={rise}>
                — Cashflow, forecast
              </motion.p>
              <motion.h2 variants={rise}>Read the next 30 days.</motion.h2>
              <motion.p variants={rise}>
                Banfico projects your balance forward from recurring income and spend, then flags the day things get
                tight — before they do.
              </motion.p>
            </motion.div>

            <motion.div className="home-showcase" variants={rise} {...inViewProps}>
              <div className="home-dash">
                <div className="home-dash-head">
                  <span className="home-dash-title">Projected balance</span>
                  <span className="home-dash-sub">Next 30 days</span>
                </div>
                <div className="home-dash-metric">$52,940</div>
                <div className="home-dash-delta">↑ projected +$4,730 by Aug 24</div>
                <svg className="home-area" viewBox="0 0 520 150" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="home-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="var(--peach)" stopOpacity=".7" />
                      <stop offset="1" stopColor="var(--peach)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 110 C60 100 90 118 140 96 C190 74 220 108 270 78 C320 50 360 70 410 44 C450 26 490 34 520 22 L520 150 L0 150 Z"
                    fill="url(#home-fill)"
                  />
                  <path
                    d="M0 110 C60 100 90 118 140 96 C190 74 220 108 270 78 C320 50 360 70 410 44 C450 26 490 34 520 22"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="2"
                  />
                  <line x1="270" y1="0" x2="270" y2="150" stroke="var(--rule)" strokeWidth="1" strokeDasharray="3 4" />
                  <circle cx="270" cy="78" r="4" fill="var(--sienna)" />
                </svg>
                <div className="home-x-axis">
                  <span>Jul 25</span>
                  <span>Aug 1</span>
                  <span>Aug 8</span>
                  <span>Aug 15</span>
                  <span>Aug 24</span>
                </div>
              </div>

              <div className="home-side-stack">
                <div className="home-dash">
                  <div className="home-dash-head">
                    <span className="home-dash-title">Spending by category</span>
                    <span className="home-dash-sub">July</span>
                  </div>
                  <div className="home-cat-list">
                    {CATEGORIES.map((c) => (
                      <CategoryBar key={c.name} {...c} />
                    ))}
                  </div>
                </div>
                <div className="home-dash">
                  <div className="home-dash-head">
                    <span className="home-dash-title">AI found this week</span>
                    <span className="home-dash-sub">3 insights</span>
                  </div>
                  <div className="home-insights">
                    {INSIGHTS.map((it, i) => (
                      <div className="home-insight" key={i}>
                        <span className="home-insight-ico">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {it.icon}
                          </svg>
                        </span>
                        <p>{it.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== CARD / WALLET ===== */}
        <section className="home-sec home-sec-fog">
          <div className="home-container home-wallet">
            <motion.div className="home-wallet-copy" variants={stagger} {...inViewProps}>
              <motion.p className="home-eyebrow" variants={rise}>
                — The card
              </motion.p>
              <motion.h2 variants={rise}>One card, quietly in control.</motion.h2>
              <motion.p variants={rise}>
                A metal card that spends from the right space automatically, freezes in a tap, and never charges a
                foreign transaction fee.
              </motion.p>
              <motion.ul className="home-wallet-list" variants={rise}>
                {WALLET_POINTS.map((p) => (
                  <li key={p}>
                    <span className="home-b" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </motion.ul>
              <motion.div variants={rise}>
                <Link to="/auth" className="home-pill home-pill-filled">
                  Request a card <Arrow />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="home-card-stack"
              aria-hidden="true"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="home-bank-card back">
                <div className="home-bc-top">
                  <span className="home-bc-brand">Banfico</span>
                </div>
                <div className="home-bc-foot">
                  <span>Savings vault</span>
                  <span>4.30% APY</span>
                </div>
              </div>
              <div className="home-bank-card front">
                <div className="home-bc-top">
                  <span className="home-bc-brand">Banfico</span>
                  <span className="home-bc-chip" />
                </div>
                <div className="home-bc-num">4821 · · · · · · · · 0055</div>
                <div className="home-bc-foot">
                  <span className="name">M. OKAFOR</span>
                  <span>VALID 09 / 29</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== EDITORIAL PEACH ===== */}
        <section className="home-sec">
          <div className="home-container">
            <motion.div className="home-peach-card" variants={rise} {...inViewProps}>
              <div>
                <p className="home-eyebrow">— Editorial</p>
                <blockquote className="home-peach-quote">
                  “Banfico reads your cashflow the way an editor reads a draft — patiently, line by line, and honest
                  about what to cut.”
                </blockquote>
                <p className="home-peach-attrib">
                  Maya Okafor <span>Founder, Driftwood Ceramics</span>
                </p>
              </div>
              <div className="home-peach-stat">
                <p className="home-peach-stat-lab">Overnight audit</p>
                <p className="home-peach-stat-num">$140.00</p>
                <p className="home-peach-stat-desc">
                  Auto-saved to your high-yield vault after the AI caught an unused streaming subscription.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== STAT BAND ===== */}
        <section className="home-stat-band" id="pricing">
          <motion.div className="home-container home-stats-grid" variants={stagger} {...inViewProps}>
            {STATS.map((s) => (
              <motion.div className="home-stat" key={s.label} variants={rise}>
                <p className="home-stat-num">
                  <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="home-stat-lab">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="home-sec" id="faq">
          <div className="home-container home-faq-wrap">
            <h2>Questions, answered.</h2>
            <div className="home-faq-list">
              {FAQS.map((f, i) => (
                <div className="home-faq-item" key={f.q}>
                  <button
                    type="button"
                    className="home-faq-btn"
                    id={`home-faq-btn-${i}`}
                    aria-expanded={openFaq === i}
                    aria-controls={`home-faq-panel-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  >
                    <span className="home-faq-q">{f.q}</span>
                    <svg
                      className={`home-faq-ico${openFaq === i ? " is-open" : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        className="home-faq-panel"
                        id={`home-faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`home-faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                      >
                        <p>{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="home-sec home-sec-fog home-cta-band" id="company">
          <motion.div className="home-container" variants={stagger} {...inViewProps}>
            <motion.p className="home-eyebrow" variants={rise}>
              — Open in three minutes
            </motion.p>
            <motion.h2 variants={rise}>Start reading your money.</motion.h2>
            <motion.p variants={rise}>
              No branch visit, no paperwork. Connect an existing account or open a fresh one today.
            </motion.p>
            <motion.div className="home-cta-pair" variants={rise}>
              <Link to="/auth" className="home-pill home-pill-filled">
                Open an account <Arrow />
              </Link>
              <a href="#" className="home-pill home-pill-ghost">
                Book a demo
              </a>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="home-footer">
        <div className="home-container">
          <div className="home-foot-top">
            <p className="home-foot-brand">
              Banfico<span aria-hidden="true">.</span>
            </p>
            <nav className="home-foot-cols" aria-label="Footer">
              {FOOTER_COLS.map((col) => (
                <div key={col.h}>
                  <p className="home-foot-h">{col.h}</p>
                  <ul>
                    {col.links.map((l) => (
                      <li key={l}>
                        <a href="#">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="home-foot-legal">
            <p>© 2026 Banfico Financial Technologies, Inc.</p>
            <p>Banking services provided by FDIC-insured partner banks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}