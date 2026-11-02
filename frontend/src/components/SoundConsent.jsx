import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Penguin } from "./Penguin";
import { sound } from "../lib/sound";

export const SoundConsent = ({ onDone }) => {
    const answer = (on) => {
        sound.setEnabled(on);
        if (on) sound.epicOpening();
        onDone();
    };

    return (
        <motion.div
            data-testid="sound-consent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center p-5"
        >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" />
            <motion.div
                initial={{ y: 60, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 40, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="relative glass-strong rounded-[26px] p-6 pt-16 max-w-sm w-full text-center"
            >
                <div className="absolute -top-11 left-1/2 -translate-x-1/2">
                    <Penguin pose="wave" size={88} />
                </div>
                <h3 className="font-display text-xl font-extrabold text-white leading-snug">🔊 Enable Interactive Sound Experience?</h3>
                <p className="text-sm text-white/50 mt-2.5 leading-relaxed">Cosmic ambience, premium UI sounds and penguin chirps. Always optional, never loud.</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                        data-testid="sound-yes-button"
                        onClick={() => answer(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] py-3 text-sm font-bold text-white glow-purple hover:scale-105 active:scale-95 transition-transform"
                    >
                        <Volume2 size={16} /> Yes
                    </button>
                    <button
                        data-testid="sound-no-button"
                        onClick={() => answer(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-full glass-strong py-3 text-sm font-bold text-white/80 hover:text-white transition-colors"
                    >
                        <VolumeX size={16} /> No
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
