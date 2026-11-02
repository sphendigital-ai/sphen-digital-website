import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Confetti } from "./Confetti";
import { sound } from "../lib/sound";
import { scrollToSection } from "../lib/scroll";

const poseAnims = {
    wave: { values: { rotate: [0, -4, 3, -4, 0], y: [0, -9, 0], scale: [1, 1.015, 1] }, transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } },
    point: { values: { y: [0, -7, 0], scale: [1, 1.012, 1] }, transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } },
    celebrate: { values: { y: [0, -20, 0], rotate: [0, -6, 6, 0] }, transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" } },
    thumbsup: { values: { rotate: [0, 5, 0], y: [0, -6, 0] }, transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } },
    type: { values: { rotate: [0, -4, 4, 0], y: [0, -3, 0] }, transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" } },
    idle: { values: { y: [0, -6, 0], scale: [1, 1.015, 1] }, transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" } },
};

const greetings = [
    "💜 Hi! I'm SPHEN.",
    "🚀 Ready to grow your business?",
    "✨ Need help choosing a marketing package?",
];

const bubbleActions = [
    { label: "Social Media", href: "#services" },
    { label: "Meta Ads", href: "#pricing" },
    { label: "Branding", href: "#services" },
    { label: "Website", href: "#services" },
    { label: "Talk to Expert", href: "#contact" },
];

const Sparkles = ({ burstKey }) => (
    <AnimatePresence>
        {burstKey > 0 && (
            <div key={burstKey} className="pointer-events-none absolute inset-0 z-20">
                {Array.from({ length: 7 }).map((_, i) => {
                    const angle = (i / 7) * Math.PI * 2 + 0.4;
                    return (
                        <motion.svg
                            key={i}
                            width="16" height="16" viewBox="0 0 18 18"
                            className="absolute left-1/2 top-1/2"
                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                            animate={{ x: Math.cos(angle) * 70, y: Math.sin(angle) * 70, scale: [0, 1.2, 0], opacity: [1, 1, 0] }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                        >
                            <path d="M9 0 L11 7 L18 9 L11 11 L9 18 L7 11 L0 9 L7 7 Z" fill={i % 2 ? "#FF8A3D" : "#a78bfa"} />
                        </motion.svg>
                    );
                })}
            </div>
        )}
    </AnimatePresence>
);

export const Penguin = ({ pose = "wave", size = 200, className = "", glow = true, interactive = false }) => {
    const ref = useRef(null);
    const nearRef = useRef(false);
    const idleTimer = useRef(null);
    const bubbleTimer = useRef(null);
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const srx = useSpring(rx, { stiffness: 120, damping: 14 });
    const sry = useSpring(ry, { stiffness: 120, damping: 14 });
    const [near, setNear] = useState(false);
    const [sparkKey, setSparkKey] = useState(0);
    const [clicks, setClicks] = useState(0);
    const [party, setParty] = useState(false);
    const [bubble, setBubble] = useState(null);

    useEffect(() => {
        const onMove = (e) => {
            const el = ref.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            ry.set(Math.max(-9, Math.min(9, dx / 55)));
            rx.set(Math.max(-9, Math.min(9, -dy / 55)));
            if (!interactive) return;
            const isNear = Math.hypot(dx, dy) < size * 0.85;
            if (isNear && !nearRef.current) {
                nearRef.current = true;
                setNear(true);
                setSparkKey((k) => k + 1);
            } else if (!isNear && nearRef.current) {
                nearRef.current = false;
                setNear(false);
            }
            clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(() => {
                setBubble({ text: "Still thinking? Let's grow your business together!", actions: false });
                bubbleTimer.current = setTimeout(() => setBubble(null), 4500);
            }, 10000);
        };
        window.addEventListener("mousemove", onMove);
        if (interactive) {
            idleTimer.current = setTimeout(() => {
                setBubble({ text: "Still thinking? Let's grow your business together!", actions: false });
                bubbleTimer.current = setTimeout(() => setBubble(null), 4500);
            }, 10000);
        }
        return () => {
            window.removeEventListener("mousemove", onMove);
            clearTimeout(idleTimer.current);
            clearTimeout(bubbleTimer.current);
        };
    }, [rx, ry, interactive, size]);

    const onClick = () => {
        if (!interactive) return;
        sound.penguin();
        const n = clicks + 1;
        if (n >= 5) {
            setClicks(0);
            setParty(true);
            sound.party();
            setBubble({ text: "🎉 You're awesome! Let's make your brand famous!", actions: false });
            setTimeout(() => { setParty(false); setBubble(null); }, 3400);
        } else {
            setClicks(n);
            clearTimeout(bubbleTimer.current);
            setBubble({ text: greetings[Math.floor(Math.random() * greetings.length)], actions: true });
            bubbleTimer.current = setTimeout(() => setBubble(null), 6000);
        }
    };

    const anim = party
        ? { values: { rotate: [0, 360], y: [0, -26, 0], scale: [1, 1.1, 1] }, transition: { duration: 1.1, ease: "easeInOut" } }
        : near
            ? { values: { y: [0, -16, 0], scale: [1, 1.07, 1] }, transition: { duration: 0.7, ease: "easeOut" } }
            : poseAnims[pose] || poseAnims.idle;

    return (
        <motion.div
            ref={ref}
            data-testid="penguin-mascot"
            onClick={onClick}
            className={`relative select-none ${className}`}
            style={{ width: size, height: size }}
            animate={anim.values}
            transition={anim.transition}
        >
            {glow && <div className="absolute inset-x-6 bottom-1 h-8 rounded-full bg-sphen-purple/40 blur-2xl" />}
            <motion.img
                src="/assets/penguin.png"
                alt="SPHEN the penguin mascot"
                draggable={false}
                className="relative w-full h-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.55)]"
                style={{ rotateX: srx, rotateY: sry, transformPerspective: 700 }}
            />
            {interactive && <Sparkles burstKey={sparkKey} />}
            {party && <Confetti count={30} />}
            <AnimatePresence>
                {bubble && (
                    <motion.div
                        data-testid="penguin-speech-bubble"
                        initial={{ opacity: 0, y: 10, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-30 w-max max-w-[250px] glass-strong rounded-2xl rounded-bl-sm px-4 py-3 text-center shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                    >
                        <p className="text-xs font-semibold text-white leading-relaxed">{bubble.text}</p>
                        {bubble.actions && (
                            <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
                                {bubbleActions.map((a) => (
                                    <button
                                        key={a.label}
                                        data-testid={`penguin-bubble-${a.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            sound.click();
                                            setBubble(null);
                                            scrollToSection(a.href);
                                        }}
                                        className="rounded-full border border-sphen-purple/50 px-2.5 py-1 text-[10px] font-semibold text-sphen-purple hover:bg-sphen-purple hover:text-white transition-colors"
                                    >
                                        {a.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
