import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Phone, Instagram, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { sound } from "../lib/sound";

const WhatsAppIcon = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.03a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.08 8.08 0 0 1-1.24-4.28c0-4.47 3.64-8.11 8.12-8.11a8.1 8.1 0 0 1 8.11 8.11c0 4.48-3.64 8.12-8.07 8.12zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.5.11-.11.24-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.37 1 2.53.12.16 1.72 2.63 4.18 3.69.58.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28z" />
    </svg>
);

export const FloatingButtons = () => {
    const [showTop, setShowTop] = useState(false);
    const [soundOn, setSoundOn] = useState(localStorage.getItem("sphen_sound") === "on");

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 600);
        const onSound = () => setSoundOn(localStorage.getItem("sphen_sound") === "on");
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("sphen-sound-change", onSound);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("sphen-sound-change", onSound);
        };
    }, []);

    const buttons = [
        { href: "https://wa.me/918595110551", label: "WhatsApp", icon: <WhatsAppIcon />, cls: "bg-[#25D366] shadow-[0_0_25px_rgba(37,211,102,0.45)]", testId: "float-whatsapp-button" },
        { href: "https://instagram.com/sphendigital", label: "Instagram", icon: <Instagram size={18} />, cls: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-[0_0_25px_rgba(220,39,67,0.4)]", testId: "float-instagram-button" },
        { href: "https://m.me/61592640367989", label: "Messenger", icon: <MessageCircle size={18} />, cls: "bg-[#0084FF] shadow-[0_0_25px_rgba(0,132,255,0.4)]", testId: "float-messenger-button" },
        { href: "tel:+918595110551", label: "Call Now", icon: <Phone size={18} />, cls: "bg-gradient-to-r from-sphen-purple to-sphen-orange glow-purple", testId: "float-call-button" },
    ];

    return (
        <div data-testid="floating-buttons" className="fixed right-3 sm:right-6 bottom-5 sm:bottom-6 z-[850] flex flex-col items-center gap-2.5 sm:gap-3">
            <motion.button
                data-testid="float-sound-toggle-button"
                onClick={() => sound.setEnabled(!soundOn)}
                aria-label={soundOn ? "Mute sound" : "Enable sound"}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.6, type: "spring", stiffness: 200, damping: 16 }}
                whileHover={{ scale: 1.15, rotate: 6 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white transition-colors ${soundOn ? "bg-sphen-purple glow-purple" : "glass-strong hover:border-sphen-purple/60"}`}
            >
                {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </motion.button>
            <AnimatePresence>
                {showTop && (
                    <motion.button
                        key="top"
                        data-testid="float-back-to-top-button"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={() => window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: "smooth" })}
                        aria-label="Back to top"
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-strong flex items-center justify-center text-white hover:border-sphen-purple/60 transition-colors"
                    >
                        <ArrowUp size={16} />
                    </motion.button>
                )}
            </AnimatePresence>
            {buttons.map((b, i) => (
                <motion.a
                    key={b.testId}
                    href={b.href}
                    target={b.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    data-testid={b.testId}
                    aria-label={b.label}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3.8 + i * 0.12, type: "spring", stiffness: 200, damping: 16 }}
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white ${b.cls}`}
                >
                    {b.icon}
                </motion.a>
            ))}
        </div>
    );
};
