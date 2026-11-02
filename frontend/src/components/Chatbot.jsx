import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { Penguin } from "./Penguin";
import { sound } from "../lib/sound";

const replies = [
    { keys: ["price", "pricing", "cost", "plan", "₹", "charge"], text: "Our plans start at ₹6,500/month (Starter), ₹10,000/month (Growth — most popular!) and ₹15,000/month (Premium). Scroll to Pricing or tap a plan and I'll walk you through it!" },
    { keys: ["social media", "social"], text: "📱 Our Social Media Management covers content, posting, stories, community and growth across Instagram, Facebook, LinkedIn and YouTube — included in every plan!" },
    { keys: ["branding", "brand", "logo"], text: "🎨 We build brands people remember — logo, identity, colors, voice and design systems. Branding support starts in the Starter plan!" },
    { keys: ["meta ads", "meta", "ads", "advertising"], text: "🚀 Our Meta Ads campaigns are engineered for ROAS — audience research, creatives, optimization and weekly reporting. Included in Growth and Premium!" },
    { keys: ["website", "web", "site", "development"], text: "🌐 We build fast, premium, conversion-focused websites — and the Premium plan includes ongoing website support. Want one? Tell us in the contact form!" },
    { keys: ["expert", "human", "talk", "contact", "phone", "call", "email", "whatsapp"], text: "📞 You can call us at +91 8595110551, email info@sphendigital.com, or tap the green WhatsApp button on the right. A human (not a penguin) will reply fast!" },
    { keys: ["service", "offer", "what do you do", "seo"], text: "We do it all: Social Media, Branding, Graphic Design, Meta & Google Ads, Websites, SEO, Content, Video Editing, Strategy, Lead Gen and AI-powered Growth. Which one sounds exciting?" },
    { keys: ["where", "location", "gurugram", "gurgaon", "office", "udyog"], text: "We're at 27-28, Phase IV, Udyog Vihar, Sector 18, Gurugram, Haryana 122015 — but we work with brands everywhere. Penguins travel well." },
    { keys: ["portfolio", "work", "case", "result", "clients"], text: "We've delivered 250+ projects for 150+ clients with 10M+ reach generated. Check the Portfolio section — the before/after slider is my favourite!" },
    { keys: ["hi", "hello", "hey", "hii"], text: "Hey there! I'm SPHEN, your growth guide. Ask me about our services, pricing, or how we can move your market!" },
    { keys: ["thank", "thanks", "great", "awesome", "cool"], text: "You're the best! If you're ready to grow, hit 'Start Growing' — I'll save you a spot." },
];

const fallback = "Great question! For anything detailed, call +91 8595110551 or drop a message in the contact form — our team replies within 24 hours. Or ask me about pricing, services or results!";

const chips = ["📱 Social Media", "🎨 Branding", "🚀 Meta Ads", "🌐 Website", "📞 Talk to Expert"];

export const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi! 👋 I'm SPHEN. How can I help grow your business today?" },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const bodyRef = useRef(null);

    useEffect(() => {
        bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, typing]);

    const answer = (text) => {
        const lower = text.toLowerCase();
        const hit = replies.find((r) => r.keys.some((k) => lower.includes(k)));
        return hit ? hit.text : fallback;
    };

    const send = (raw) => {
        const text = (raw ?? input).trim();
        if (!text) return;
        setMessages((m) => [...m, { from: "user", text }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            setMessages((m) => [...m, { from: "bot", text: answer(text) }]);
        }, 900);
    };

    return (
        <div data-testid="chatbot" className="fixed left-3 sm:left-6 bottom-5 sm:bottom-6 z-[860] flex flex-col items-start gap-3">
            <AnimatePresence>
                {open && (
                    <motion.div
                        data-testid="chatbot-panel"
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 220, damping: 20 }}
                        className="w-[min(320px,calc(100vw-2rem))] sm:w-[360px] rounded-[26px] overflow-hidden glass-strong shadow-[0_30px_90px_rgba(0,0,0,0.65)] origin-bottom-left"
                    >
                        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-sphen-purple/40 to-sphen-orange/20 border-b border-white/10">
                            <Penguin pose="idle" size={42} glow={false} />
                            <div className="flex-1">
                                <p className="font-display font-bold text-white text-sm">SPHEN Assistant</p>
                                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online — replies instantly
                                </p>
                            </div>
                            <button data-testid="chatbot-close-button" onClick={() => setOpen(false)} aria-label="Close chat" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white">
                                <X size={15} />
                            </button>
                        </div>
                        <div ref={bodyRef} data-testid="chatbot-messages" className="h-[300px] overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#08080c]/80">
                            {messages.map((m, i) => (
                                <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.from === "bot" ? "self-start bg-white/8 text-white/85 rounded-bl-sm" : "self-end bg-sphen-purple text-white rounded-br-sm"}`}>
                                    {m.text}
                                </div>
                            ))}
                            {typing && (
                                <div className="self-start bg-white/8 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                                    {[0, 1, 2].map((d) => (
                                        <motion.span key={d} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.15 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="px-4 pt-2 pb-1 flex gap-2 bg-[#08080c]/80">
                            {chips.map((c) => (
                                <button key={c} data-testid={`chatbot-chip-${c.toLowerCase().replace(/[^a-z]+/g, "-")}`} onClick={() => send(c)} className="rounded-full border border-sphen-purple/40 px-3 py-1 text-[11px] text-sphen-purple hover:bg-sphen-purple hover:text-white transition-colors">
                                    {c}
                                </button>
                            ))}
                        </div>
                        <form
                            className="flex items-center gap-2 p-3 bg-[#08080c]/80"
                            onSubmit={(e) => { e.preventDefault(); send(); }}
                        >
                            <input
                                data-testid="chatbot-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask SPHEN anything…"
                                className="flex-1 rounded-full bg-white/[0.06] border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-sphen-purple transition-colors"
                            />
                            <button data-testid="chatbot-send-button" aria-label="Send message" className="w-10 h-10 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] flex items-center justify-center text-white glow-purple hover:scale-110 active:scale-90 transition-transform">
                                <Send size={15} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button
                data-testid="chatbot-toggle-button"
                onClick={() => { sound.pop(); setOpen(!open); }}
                aria-label="Open chat with SPHEN"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 4.2, type: "spring", stiffness: 200, damping: 14 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full glass-strong glow-purple flex items-center justify-center overflow-visible"
            >
                <span className="absolute inset-0 rounded-full animate-pulse-ring" />
                <Penguin pose={open ? "idle" : "wave"} size={52} glow={false} />
            </motion.button>
        </div>
    );
};
