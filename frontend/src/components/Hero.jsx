import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Rocket, Phone, TrendingUp, Users, Target, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { Penguin } from "./Penguin";
import { scrollToSection } from "../lib/scroll";
import { openLeadModal } from "./LeadFormModal";

const line = {
    hidden: { y: "115%" },
    show: (i) => ({
        y: "0%",
        transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 2.7 + i * 0.13 },
    }),
};

const fade = {
    hidden: { opacity: 0, y: 24 },
    show: (d) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] } }),
};

const Sparkline = ({ color = "#6D3BFF" }) => (
    <svg width="72" height="28" viewBox="0 0 72 28" fill="none">
        <polyline points="0,24 12,18 24,20 36,10 48,14 60,5 72,8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FloatCard = ({ className, delay, children, testId }) => (
    <motion.div
        data-testid={testId}
        variants={fade}
        initial="hidden"
        animate="show"
        custom={delay}
        className={`absolute glass-strong rounded-2xl px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${className}`}
    >
        {children}
    </motion.div>
);

const particles = Array.from({ length: 16 }, (_, i) => ({
    left: `${(i * 61) % 100}%`,
    top: `${(i * 37) % 100}%`,
    size: 3 + (i % 4),
    delay: (i % 6) * 0.8,
    color: i % 3 === 0 ? "#FF8A3D" : "#6D3BFF",
}));

export const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const yCards = useTransform(scrollYProgress, [0, 1], [0, -120]);
    const yPenguin = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={ref} id="top" data-testid="hero-section" className="relative min-h-screen min-h-[100svh] flex items-center overflow-hidden noise pt-24 pb-16">
            <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
            <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-sphen-purple/25 blur-[160px] animate-drift" />
            <div className="absolute top-1/3 -right-48 w-[520px] h-[520px] rounded-full bg-sphen-orange/15 blur-[160px] animate-drift" style={{ animationDelay: "-6s" }} />
            {particles.map((p, i) => (
                <span
                    key={i}
                    className="absolute rounded-full animate-float"
                    style={{ left: p.left, top: p.top, width: p.size, height: p.size, background: p.color, opacity: 0.6, animationDelay: `${p.delay}s`, boxShadow: `0 0 12px ${p.color}` }}
                />
            ))}
            <motion.div style={{ opacity }} className="relative max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center w-full">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <motion.div variants={fade} initial="hidden" animate="show" custom={2.55} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
                        <span className="w-2 h-2 rounded-full bg-sphen-orange animate-pulse-ring" />
                        <span className="text-xs sm:text-sm text-white/80 font-medium tracking-wide">Ideas That Move Markets.</span>
                    </motion.div>
                    <h1 className="font-display font-extrabold tracking-tight text-hero leading-[1.08]">
                        {["Grow Faster.", "Rank Higher.", "Sell More."].map((l, i) => (
                            <span key={l} className="block overflow-hidden pb-1">
                                <motion.span variants={line} initial="hidden" animate="show" custom={i} className={`block ${i === 2 ? "text-gradient" : "text-white"}`}>
                                    {l}
                                </motion.span>
                            </span>
                        ))}
                    </h1>
                    <motion.p variants={fade} initial="hidden" animate="show" custom={3.25} className="mt-7 max-w-xl text-body-fluid text-white/60 leading-relaxed">
                        We help businesses build powerful brands through creative design, social media, performance marketing, websites and AI-powered growth strategies.
                    </motion.p>
                    <motion.div variants={fade} initial="hidden" animate="show" custom={3.45} className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
                        <button
                            data-testid="hero-start-growing-button"
                            onClick={() => scrollToSection("#contact")}
                            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] px-7 py-4 text-base font-semibold text-white glow-purple hover:scale-105 hover:shadow-[0_0_60px_rgba(109,59,255,0.55)] active:scale-95 transition-all duration-300"
                        >
                            <Rocket size={18} className="group-hover:-rotate-12 group-hover:translate-x-0.5 transition-transform duration-300" />
                            Start Growing
                        </button>
                        <button
                            data-testid="hero-book-consultation-button"
                            onClick={() => openLeadModal({ source: "free_consultation", title: "Book Free Consultation", subtitle: "30 minutes. Zero cost. A clear growth plan." })}
                            className="group inline-flex items-center gap-2.5 rounded-full glass-strong px-7 py-4 text-base font-semibold text-white hover:border-sphen-orange/60 hover:glow-orange hover:scale-105 active:scale-95 transition-all duration-300"
                        >
                            <Phone size={18} className="text-sphen-orange group-hover:rotate-12 transition-transform duration-300" />
                            Book Free Consultation
                        </button>
                    </motion.div>
                    <motion.div variants={fade} initial="hidden" animate="show" custom={3.65} className="mt-10 flex items-center justify-center lg:justify-start gap-5 text-white/40">
                        <span className="text-xs uppercase tracking-[0.25em]">Follow us</span>
                        <div className="h-px w-10 bg-white/15" />
                        {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) => (
                            <a key={i} href="#" data-testid={`hero-social-icon-${i}`} aria-label="Social link" className="hover:text-sphen-orange hover:-translate-y-1 hover:rotate-6 transition-all duration-300">
                                <Icon size={18} />
                            </a>
                        ))}
                    </motion.div>
                </div>
                <motion.div style={{ y: yPenguin }} className="relative flex justify-center items-end lg:h-[480px]">
                    <motion.div
                        initial={{ opacity: 0, x: -120, rotate: -10 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ delay: 3.0, type: "spring", stiffness: 55, damping: 13 }}
                        className="lg:hidden"
                    >
                        <Penguin pose="wave" size={180} interactive />
                    </motion.div>
                    <motion.div className="hidden lg:block" initial={{ opacity: 0, x: -280, rotate: -14 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ delay: 3.0, type: "spring", stiffness: 55, damping: 13 }}>
                        <Penguin pose="wave" size={280} interactive />
                    </motion.div>
                    <motion.div style={{ y: yCards }} className="absolute inset-0 pointer-events-none hidden lg:block">
                        <FloatCard testId="hero-card-roi" className="top-6 -left-4 animate-float" delay={3.4}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-sphen-purple/25 flex items-center justify-center"><TrendingUp size={17} className="text-sphen-purple" /></div>
                                <div>
                                    <p className="text-[11px] text-white/50">ROI Growth</p>
                                    <p className="text-sm font-bold text-white">+248%</p>
                                </div>
                                <Sparkline />
                            </div>
                        </FloatCard>
                        <FloatCard testId="hero-card-reach" className="top-40 -right-6 animate-float" delay={3.6}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-sphen-orange/25 flex items-center justify-center"><Users size={17} className="text-sphen-orange" /></div>
                                <div>
                                    <p className="text-[11px] text-white/50">Reach Generated</p>
                                    <p className="text-sm font-bold text-white">10M+</p>
                                </div>
                                <Sparkline color="#FF8A3D" />
                            </div>
                        </FloatCard>
                        <FloatCard testId="hero-card-leads" className="bottom-8 -left-8 animate-float" delay={3.8}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-400/20 flex items-center justify-center"><Target size={17} className="text-emerald-400" /></div>
                                <div>
                                    <p className="text-[11px] text-white/50">Quality Leads</p>
                                    <p className="text-sm font-bold text-white">3.2x Growth</p>
                                </div>
                            </div>
                        </FloatCard>
                    </motion.div>
                </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.2 }} className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/35">
                <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="w-[22px] h-[36px] rounded-full border border-white/25 flex justify-center pt-1.5">
                    <div className="w-1 h-2 rounded-full bg-sphen-purple" />
                </motion.div>
            </motion.div>
        </section>
    );
};
