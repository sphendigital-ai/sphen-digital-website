const items = ["Social Media", "Branding", "Meta Ads", "Google Ads", "SEO", "Websites", "AI Marketing", "Content", "Video Editing", "Lead Generation"];

export const Marquee = () => {
    const row = [...items, ...items];
    return (
        <div data-testid="editorial-marquee" className="relative py-10 border-y border-white/8 overflow-hidden bg-[#070709]">
            <div className="flex w-max animate-marquee gap-0">
                {row.map((item, i) => (
                    <div key={i} className="flex items-center shrink-0">
                        <span className={`font-display font-extrabold text-4xl sm:text-5xl tracking-tight px-6 ${i % 2 === 0 ? "text-white/90" : "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]"}`}>
                            {item}
                        </span>
                        <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
                            <path d="M9 0 L11 7 L18 9 L11 11 L9 18 L7 11 L0 9 L7 7 Z" fill={i % 2 === 0 ? "#6D3BFF" : "#FF8A3D"} />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
};
