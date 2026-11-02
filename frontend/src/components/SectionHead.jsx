import { motion } from "framer-motion";

const Letters = ({ text, className = "", delayBase = 0, gradient = false }) => {
    let idx = 0;
    const words = text.split(" ");
    return (
        <span className={className}>
            {words.map((word, wi) => (
                <span key={wi}>
                    <span className={`inline-block whitespace-nowrap ${gradient ? "text-gradient text-shimmer" : ""}`}>
                        {word.split("").map((ch, ci) => {
                            const delay = delayBase + idx++ * 0.024;
                            return (
                                <motion.span
                                    key={ci}
                                    className="inline-block"
                                    initial={{ opacity: 0, y: 20, rotateX: 70 }}
                                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                    viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
                                    transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {ch}
                                </motion.span>
                            );
                        })}
                    </span>
                    {wi < words.length - 1 ? " " : null}
                </span>
            ))}
        </span>
    );
};

export const SectionHead = ({ kicker, title, accent, sub, align = "center", testId }) => {
    const centered = align === "center";
    return (
        <div
            data-testid={testId}
            className={`mb-14 sm:mb-20 ${centered ? "text-center flex flex-col items-center" : "text-left"}`}
        >
            <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-sphen-orange mb-5"
            >
                {kicker}
            </motion.span>
            <h2 className="font-display text-h2-fluid font-extrabold tracking-tight text-white leading-[1.08] [perspective:600px] px-8 sm:px-0">
                <Letters text={title} delayBase={0.1} />
                {accent && (
                    <>
                        {"\u00A0"}
                        <Letters text={accent} gradient className="drop-shadow-[0_0_25px_rgba(109,59,255,0.35)]" delayBase={0.1 + title.length * 0.024} />
                    </>
                )}
            </h2>
            {sub && (
                <motion.p
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
                    transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={`mt-5 text-base md:text-lg text-white/55 leading-relaxed ${centered ? "max-w-2xl" : "max-w-xl"}`}
                >
                    {sub}
                </motion.p>
            )}
        </div>
    );
};
