// DashboardNav.jsx — top navigation bar for the Banfico account dashboard (horizontal nav, not a sidebar)
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import "./DashboardNav.css";

const EASE = [0.22, 1, 0.36, 1];

const LINKS = [
    { label: "Overview", to: "/dashboard" },
    { label: "Transactions", to: "/dashboard/transactions" },
    { label: "Spending", to: "/dashboard/spending" },
];

const NOTES = [
    { title: "Duplicate payment flagged", body: "Two utility payments to the same payee within minutes.", time: "2m" },
    { title: "Payday buffer is healthy", body: "You're on track to end the month £4,730 up.", time: "1h" },
    { title: "Statement ready", body: "Your July statement for “Bills” is available.", time: "1d" },
];

export default function DashboardNav({ user = { name: "Nivas Ganesan", initials: "NG", email: "nivas@banfico.io" }, active = "Overview" }) {
    const reduce = useReducedMotion();
    const [scrolled, setScrolled] = useState(false);
    const [menu, setMenu] = useState(false); // profile
    const [bell, setBell] = useState(false); // notifications
    const [sheet, setSheet] = useState(false); // mobile
    const [search, setSearch] = useState("");
    const profileRef = useRef(null);
    const bellRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const onClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setMenu(false);
            if (bellRef.current && !bellRef.current.contains(e.target)) setBell(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") {
                setMenu(false);
                setBell(false);
                setSheet(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = sheet ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [sheet]);

    const pop = {
        initial: { opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.98 },
        transition: { duration: reduce ? 0 : 0.2, ease: EASE },
    };

    return (
        <header className={`dashnav${scrolled ? " scrolled" : ""}`}>
            <div className="dashnav-inner">
                {/* left — brand */}
                <div className="dashnav-left">
                    <Link to="/" className="dashnav-mark">
                        Banfico<span className="dashnav-dot" aria-hidden="true" />
                    </Link>
                    <span className="dashnav-sep" aria-hidden="true" />
                    <span className="dashnav-env">Personal</span>
                </div>

                {/* center — primary nav */}
                <nav className="dashnav-links" aria-label="Dashboard">
                    <ul>
                        {LINKS.map((l) => (
                            <li key={l.label}>
                                <Link to={l.to} className={active === l.label ? "is-active" : undefined} aria-current={active === l.label ? "page" : undefined}>
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* right — tools */}
                <div className="dashnav-right">
                    <label className="dashnav-search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.2-3.2" strokeLinecap="round" />
                        </svg>
                        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions, payees…" aria-label="Search" />
                    </label>

                    {/* notifications */}
                    <div className="dashnav-pop-wrap" ref={bellRef}>
                        <button className="dashnav-icon" aria-label="Notifications" aria-expanded={bell} onClick={() => { setBell((v) => !v); setMenu(false); }}>
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" />
                            </svg>
                            <span className="dashnav-badge" aria-hidden="true" />
                        </button>
                        <AnimatePresence>
                            {bell && (
                                <motion.div className="dashnav-pop dashnav-pop-notes" role="menu" {...pop}>
                                    <div className="dashnav-pop-head">
                                        <span>Notifications</span>
                                        <a href="#">Mark all read</a>
                                    </div>
                                    {NOTES.map((n) => (
                                        <div className="dashnav-note" key={n.title} role="menuitem" tabIndex={0}>
                                            <span className="dashnav-note-dot" aria-hidden="true" />
                                            <div>
                                                <p className="dashnav-note-title">{n.title}</p>
                                                <p className="dashnav-note-body">{n.body}</p>
                                            </div>
                                            <span className="dashnav-note-time">{n.time}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button className="dashnav-icon dashnav-hide-sm" aria-label="Help">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9.3 9.2a2.7 2.7 0 0 1 5.2.9c0 1.8-2.7 2.3-2.7 4" strokeLinecap="round" />
                            <path d="M12 17.4h.01" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* profile */}
                    <div className="dashnav-pop-wrap" ref={profileRef}>
                        <button className="dashnav-profile" aria-label="Account menu" aria-expanded={menu} onClick={() => { setMenu((v) => !v); setBell(false); }}>
                            <span className="dashnav-avatar">{user.initials}</span>
                            <span className="dashnav-name">{user.name}</span>
                            <svg className={`dashnav-chev${menu ? " up" : ""}`} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <AnimatePresence>
                            {menu && (
                                <motion.div className="dashnav-pop dashnav-pop-menu" role="menu" {...pop}>
                                    <div className="dashnav-menu-id">
                                        <span className="dashnav-avatar lg">{user.initials}</span>
                                        <div>
                                            <p className="dashnav-menu-name">{user.name}</p>
                                            <p className="dashnav-menu-mail">{user.email}</p>
                                        </div>
                                    </div>
                                    <a href="#" role="menuitem">Profile</a>
                                    <a href="#" role="menuitem">Security</a>
                                    <a href="#" role="menuitem">Preferences</a>
                                    <a href="#" role="menuitem">Statements</a>
                                    <div className="dashnav-menu-rule" />
                                    <Link to="/auth" role="menuitem" className="dashnav-menu-out">Sign out</Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button className="dashnav-burger" aria-label="Menu" aria-expanded={sheet} onClick={() => setSheet((v) => !v)}>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                            {sheet ? (
                                <path d="M4.5 4.5l13 13M17.5 4.5l-13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            ) : (
                                <path d="M3 8h16M3 14h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* mobile sheet */}
            <AnimatePresence>
                {sheet && (
                    <motion.div className="dashnav-sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}>
                        <div className="dashnav-sheet-id">
                            <span className="dashnav-avatar lg">{user.initials}</span>
                            <div>
                                <p className="dashnav-menu-name">{user.name}</p>
                                <p className="dashnav-menu-mail">{user.email}</p>
                            </div>
                        </div>
                        <nav aria-label="Mobile">
                            <ul className="dashnav-sheet-list">
                                {LINKS.map((l) => (
                                    <li key={l.label}>
                                        <Link to={l.to} className={active === l.label ? "is-active" : undefined} onClick={() => setSheet(false)}>
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <Link to="/auth" className="dashnav-sheet-out" onClick={() => setSheet(false)}>Sign out</Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}