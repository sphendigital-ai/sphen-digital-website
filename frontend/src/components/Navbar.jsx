import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket } from "lucide-react";
import { Penguin } from "./Penguin";
import { scrollToSection } from "../lib/scroll";
import { openLeadModal } from "./LeadFormModal";

const links = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
];

export { scrollToSection };

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("");

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
            { rootMargin: "-40% 0px -55% 0px" }
        );
        links.forEach((l) => {
            const el = document.querySelector(l.href);
            if (el) obs.observe(el);
        });
        return () => {
            window.removeEventListener("scroll", onScroll);
            obs.disconnect();
        };
    }, []);

    const go = (e, href) => {
        e.preventDefault();
        setOpen(false);
        scrollToSection(href);
    };

    return (
        <motion.header
            data-testid="navbar"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 inset-x-0 z-[900] transition-[background-color,border-color,box-shadow] duration-500 ${scrolled ? "bg-[#050505]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]" : "bg-[#050505]/40 backdrop-blur-xl border-b border-white/5"}`}
        >
            <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
                <a href="#top" onClick={(e) => go(e, "#top")} data-testid="nav-logo" className="flex items-center gap-2.5 group">
                    <motion.div
                        animate={{ scale: [1, 1.07, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
                        className="flex items-center gap-2.5"
                    >
                        <div className="w-10 h-10 group-hover:rotate-6 transition-transform duration-300">
                            <Penguin pose="idle" size={40} glow={false} />
                        </div>
                        <img src="/assets/logo.png" alt="SPHEN DIGITAL" className="h-7 w-auto drop-shadow-[0_0_12px_rgba(109,59,255,0.4)]" />
                    </motion.div>
                </a>
                <div className="hidden lg:flex items-center gap-7">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            data-testid={`nav-link-${l.label.toLowerCase()}`}
                            onClick={(e) => go(e, l.href)}
                            className={`text-sm transition-colors duration-300 relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-sphen-purple after:to-sphen-orange after:transition-[width] after:duration-300 hover:after:w-full ${
                                active === l.href
                                    ? "text-white after:w-full drop-shadow-[0_0_10px_rgba(109,59,255,0.8)]"
                                    : "text-white/70 hover:text-white after:w-0"
                            }`}
                        >
                            {l.label}
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        data-testid="nav-cta-button"
                        onClick={() => openLeadModal({ source: "free_consultation", title: "Book Free Consultation", subtitle: "30 minutes. Zero cost. A clear growth plan." })}
                        className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-white glow-purple hover:scale-105 active:scale-95 transition-transform duration-300"
                    >
                        <Rocket size={15} /> Book Free Consultation
                    </button>
                    <button
                        data-testid="nav-mobile-menu-button"
                        onClick={() => setOpen(!open)}
                        className="lg:hidden w-10 h-10 rounded-full glass flex items-center justify-center text-white"
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </nav>
            <AnimatePresence>
                {open && (
                    <motion.div
                        data-testid="nav-mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="lg:hidden overflow-hidden bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10"
                    >
                        <div className="px-6 py-5 flex flex-col gap-4">
                            {links.map((l) => (
                                <a key={l.href} href={l.href} data-testid={`nav-mobile-link-${l.label.toLowerCase()}`} onClick={(e) => go(e, l.href)} className="text-base text-white/80 hover:text-sphen-orange transition-colors py-2.5 min-h-[44px] flex items-center">
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
