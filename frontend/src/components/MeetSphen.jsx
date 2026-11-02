import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import {
    Instagram, Facebook, MessageCircle, Megaphone, Globe, Youtube, Linkedin,
    MonitorSmartphone, BarChart3, SearchCheck, Mail, BrainCircuit, Users, Rocket,
} from "lucide-react";
import { Penguin } from "./Penguin";
import { Confetti } from "./Confetti";
import { openLeadModal } from "./LeadFormModal";

const orbitIcons = [
    { Icon: Instagram, color: "#dc2743" }, { Icon: Facebook, color: "#0084FF" },
    { Icon: MessageCircle, color: "#25D366" }, { Icon: Megaphone, color: "#6D3BFF" },
    { Icon: Globe, color: "#FF8A3D" }, { Icon: Youtube, color: "#ff4444" },
    { Icon: Linkedin, color: "#0a66c2" }, { Icon: MonitorSmartphone, color: "#a78bfa" },
    { Icon: BarChart3, color: "#4ade80" }, { Icon: SearchCheck, color: "#ffd166" },
    { Icon: Mail, color: "#38bdf8" }, { Icon: BrainCircuit, color: "#c084fc" },
    { Icon: Users, color: "#fb7185" },
];

const dashboards = [
    { title: "Instagram Feed", Icon: Instagram, color: "#dc2743", bars: [70, 45, 88, 60] },
    { title: "Facebook Campaigns", Icon: Facebook, color: "#0084FF", bars: [55, 80, 40, 92] },
    { title: "Meta Ads Manager", Icon: Megaphone, color: "#6D3BFF", bars: [40, 65, 90, 75] },
    { title: "Google Analytics", Icon: BarChart3, color: "#FF8A3D", bars: [60, 85, 50, 95] },
    { title: "Website Design", Icon: MonitorSmartphone, color: "#a78bfa", bars: [80, 55, 70, 45] },
    { title: "SEO Dashboard", Icon: SearchCheck, color: "#ffd166", bars: [35, 60, 85, 100] },
    { title: "Lead Generation", Icon: Users, color: "#4ade80", bars: [50, 70, 65, 98] },
    { title: "Social Calendar", Icon: Globe, color: "#38bdf8", bars: [65, 40, 75, 55] },
];

const holograms = [
    "Campaign Created ✅", "Website Published 🚀", "Lead Generated 📈", "SEO Optimized 🔥",
    "Meta Ads Running", "Instagram Reel Uploaded", "Brand Growing", "Customer Inquiry Received",
];

const tips = [
    "💡 Post Reels between 6–9 PM for 2x reach!",
    "💡 Brands with consistent visuals grow 33% faster.",
    "💡 Retargeting ads convert 70% better than cold ads.",
    "💡 Your Google Business profile is free SEO — use it!",
    "💡 Video content gets 48% more engagement.",
    "💡 Reply to every comment — algorithms love it.",
];

const counters = [
    { label: "Campaigns Created Today", to: 24 },
    { label: "Leads Generated", to: 183 },
    { label: "Websites Launched", to: 12 },
];

const Counter = ({ to, label, testId }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
        return () => c.stop();
    }, [inView, to]);
    return (
        <div ref={ref} data-testid={testId} className="glass rounded-2xl px-4 py-3 text-center">
            <p className="font-display text-2xl font-extrabold text-gradient">{val}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/45 mt-1">{label}</p>
        </div>
    );
};

export const MeetSphen = () => {
    const sectionRef = useRef(null);
    const [dashIdx, setDashIdx] = useState(0);
    const [pose, setPose] = useState("type");
    const [notes, setNotes] = useState([]);
    const [tip, setTip] = useState(null);
    const [hoverScene, setHoverScene] = useState(false);
    const [party, setParty] = useState(false);
    const lx = useMotionValue(0);
    const ly = useMotionValue(0);
    const slx = useSpring(lx, { stiffness: 100, damping: 16 });
    const sly = useSpring(ly, { stiffness: 100, damping: 16 });

    useEffect(() => {
        const d = setInterval(() => setDashIdx((i) => (i + 1) % dashboards.length), 5200);
        return () => clearInterval(d);
    }, []);

    useEffect(() => {
        let step = 0;
        const sequence = ["wave", "type", "thumbsup", "type", "celebrate", "type"];
        const t = setInterval(() => {
            const next = sequence[step % sequence.length];
            step++;
            setPose(next);
            if (next === "celebrate") setParty(true);
            setTimeout(() => { setPose("type"); setParty(false); }, 3200);
        }, 15000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => {
            const id = Date.now();
            const text = holograms[Math.floor(Math.random() * holograms.length)];
            const x = Math.floor(Math.random() * 90) - 45;
            setNotes((n) => [...n.slice(-2), { id, text, x }]);
            setTimeout(() => setNotes((n) => n.filter((p) => p.id !== id)), 2600);
        }, 3800);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const show = () => {
            setTip(tips[Math.floor(Math.random() * tips.length)]);
            setTimeout(() => setTip(null), 6500);
        };
        const first = setTimeout(show, 9000);
        const t = setInterval(show, 26000);
        return () => { clearTimeout(first); clearInterval(t); };
    }, []);

    const onSceneMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ly.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        lx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
    };

    const dash = dashboards[dashIdx];
    const orbitSpeed = hoverScene ? 9 : 22;

    return (
        <section
            id="meet-sphen"
            data-testid="meet-sphen-section"
            ref={sectionRef}
            className="relative py-16 sm:py-28 lg:py-36 overflow-hidden noise"
            style={{ "--orbit-r": "clamp(120px, 17vw, 215px)" }}
        >
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-sphen-purple/12 blur-[160px] animate-drift" />
            <div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-sphen-orange/8 blur-[150px] animate-drift" style={{ animationDelay: "-6s" }} />
            <div className="absolute top-1/3 -left-20 w-72 h-40 bg-gradient-to-r from-sphen-purple/15 to-transparent blur-[80px] -rotate-12" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-40 bg-gradient-to-l from-sphen-orange/12 to-transparent blur-[80px] rotate-12" />
            <span className="absolute top-16 -right-10 h-[2px] w-24 rounded-full bg-gradient-to-l from-white via-sphen-purple to-transparent animate-meteor" style={{ animationDuration: "24s" }} />

            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center"
            >
                <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                    <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-sphen-orange mb-5">
                        The Mascot
                    </span>
                    <h2 className="font-display text-h2-fluid font-extrabold tracking-tight text-white leading-[1.08]">
                        Meet <span className="text-gradient text-shimmer">SPHEN.</span>
                    </h2>
                    <p className="mt-3 font-display text-lg sm:text-xl font-semibold text-white/80">
                        The smartest penguin in digital marketing.
                    </p>
                    <p className="mt-5 text-body-fluid text-white/55 leading-relaxed max-w-xl">
                        SPHEN isn't just our mascot. She's the creative strategist behind every campaign, every ad, every reel, and every growth story. From social media management to Meta Ads, branding, websites, SEO, and lead generation — SPHEN is always working behind the scenes to grow your business.
                    </p>
                    <button
                        data-testid="meet-sphen-cta"
                        onClick={() => openLeadModal({ source: "free_consultation", title: "Book Free Consultation", subtitle: "30 minutes. Zero cost. A clear growth plan." })}
                        className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] px-7 py-4 text-base font-semibold text-white glow-purple hover:scale-105 hover:shadow-[0_0_60px_rgba(109,59,255,0.55)] active:scale-95 transition-all duration-300"
                    >
                        <Rocket size={18} className="group-hover:-rotate-12 transition-transform duration-300" />
                        Start Growing
                    </button>
                    <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-md">
                        {counters.map((c, i) => <Counter key={c.label} to={c.to} label={c.label} testId={`meet-counter-${i}`} />)}
                    </div>
                </div>

                <div
                    data-testid="meet-sphen-scene"
                    onMouseMove={onSceneMove}
                    onMouseEnter={() => setHoverScene(true)}
                    onMouseLeave={() => setHoverScene(false)}
                    className="relative h-[440px] sm:h-[500px] flex items-end justify-center"
                >
                    <motion.div
                        animate={{ opacity: hoverScene ? 0.85 : 0.45, scale: hoverScene ? 1.1 : 1 }}
                        transition={{ duration: 0.6 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full bg-sphen-purple/30 blur-[90px]"
                    />
                    <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}>
                        {orbitIcons.map((o, i) => {
                            const angle = (i / orbitIcons.length) * 360;
                            return (
                                <div key={i} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${angle}deg) translateX(var(--orbit-r)) rotate(${-angle}deg)` }}>
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true, margin: "-80px" }}
                                        transition={{ delay: 0.4 + i * 0.07, type: "spring", stiffness: 200, damping: 14 }}
                                        className="-translate-x-1/2 -translate-y-1/2"
                                    >
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}
                                            className="w-9 h-9 sm:w-11 sm:h-11 glass-strong rounded-xl flex items-center justify-center"
                                            style={{ boxShadow: `0 0 18px ${o.color}55` }}
                                        >
                                            <o.Icon size={16} style={{ color: o.color }} />
                                        </motion.div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </motion.div>

                    <div className="relative z-10 flex flex-col items-center">
                        <AnimatePresence>
                            {tip && (
                                <motion.div
                                    data-testid="meet-sphen-tip"
                                    initial={{ opacity: 0, y: 12, scale: 0.85 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.9 }}
                                    className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 w-max max-w-[240px] glass-strong rounded-2xl rounded-bl-sm px-4 py-2.5 text-xs font-semibold text-white text-center shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                                >
                                    {tip}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Penguin pose={pose} size={190} interactive />
                        {party && <Confetti count={22} />}
                        <motion.div
                            style={{ rotateX: slx, rotateY: sly, transformPerspective: 800 }}
                            className="relative -mt-6 w-[240px] sm:w-[280px]"
                        >
                            <motion.div
                                initial={{ opacity: 0.3 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.5 }}
                                className="relative rounded-t-xl border border-white/15 bg-[#0b0b12] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                            >
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border-b border-white/10">
                                    <span className="w-2 h-2 rounded-full bg-rose-400/70" />
                                    <span className="w-2 h-2 rounded-full bg-amber-400/70" />
                                    <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
                                    <span className="ml-2 text-[9px] text-white/40 tracking-wide">SPHEN OS</span>
                                </div>
                                <div className="relative h-[130px] sm:h-[150px]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={dashIdx}
                                            data-testid="laptop-dashboard"
                                            initial={{ x: 60, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -60, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute inset-0 p-3"
                                        >
                                            <div className="flex items-center gap-2 mb-2.5">
                                                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${dash.color}25` }}>
                                                    <dash.Icon size={13} style={{ color: dash.color }} />
                                                </div>
                                                <p className="text-[11px] font-bold text-white/85">{dash.title}</p>
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            </div>
                                            <div className="flex items-end gap-1.5 h-[62px] sm:h-[76px]">
                                                {dash.bars.map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 4 }}
                                                        animate={{ height: `${h}%` }}
                                                        transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                                        className="flex-1 rounded-t-sm"
                                                        style={{ background: `linear-gradient(180deg, ${dash.color}, ${dash.color}55)` }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="mt-2 flex items-center gap-1">
                                                <span className="text-[9px] text-emerald-400 font-bold">+{18 + dashIdx * 3}% this week</span>
                                                <motion.span
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    className="ml-auto w-[3px] h-3 bg-sphen-purple rounded-full shadow-[0_0_8px_#6D3BFF]"
                                                />
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                            <div className="h-[10px] rounded-b-xl bg-gradient-to-b from-[#1a1a24] to-[#0d0d14] border border-t-0 border-white/10 flex items-center justify-center">
                                <img src="/assets/s-logo.png" alt="" className="h-[7px] w-auto opacity-90 drop-shadow-[0_0_6px_rgba(109,59,255,0.9)]" />
                            </div>
                            <div className="absolute -top-16 left-0 right-0 h-16 pointer-events-none">
                                <AnimatePresence>
                                    {notes.map((n) => (
                                        <motion.div
                                            key={n.id}
                                            data-testid="hologram-note"
                                            initial={{ opacity: 0, y: 16, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -34, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 2.4, ease: "easeOut" }}
                                            className="absolute left-1/2 glass-strong rounded-full px-3 py-1.5 text-[10px] font-bold text-white whitespace-nowrap border-sphen-purple/40 shadow-[0_0_20px_rgba(109,59,255,0.35)]"
                                            style={{ marginLeft: n.x }}
                                        >
                                            {n.text}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
