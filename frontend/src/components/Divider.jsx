import { motion } from "framer-motion";

export const Divider = () => (
    <div data-testid="glow-divider" className="relative max-w-4xl mx-auto px-8 py-2" aria-hidden="true">
        <div className="relative h-[2px]">
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-transparent via-sphen-purple to-sphen-orange shadow-[0_0_18px_rgba(109,59,255,0.55)]"
            />
            <motion.span
                initial={{ left: "0%", opacity: 0 }}
                whileInView={{ left: "100%", opacity: [0, 1, 1, 0] }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-[3px] w-2 h-2 rounded-full bg-sphen-orange shadow-[0_0_14px_4px_rgba(255,138,61,0.7)]"
            />
        </div>
    </div>
);
