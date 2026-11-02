import { useState } from "react";
import { Instagram, Facebook, Linkedin, Youtube, Send } from "lucide-react";
import { toast } from "sonner";
import { Penguin } from "./Penguin";
import { scrollToSection } from "./Navbar";
import { subscribeNewsletter } from "../lib/api";

const quickLinks = [
    { label: "Home", href: "#top" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
];

export const Footer = () => {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);

    const subscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setSending(true);
        try {
            await subscribeNewsletter(email);
            toast.success("Subscribed! Growth tips incoming.");
            setEmail("");
        } catch {
            toast.error("Could not subscribe. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <footer data-testid="footer" className="relative border-t border-white/10 bg-[#050505] overflow-hidden noise">
            <div className="absolute -bottom-52 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-sphen-purple/10 blur-[160px]" />
            {Array.from({ length: 24 }, (_, i) => (
                <span
                    key={`star-${i}`}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${(i * 41.3) % 100}%`,
                        top: `${(i * 29.7) % 100}%`,
                        width: 1 + (i % 2),
                        height: 1 + (i % 2),
                        animation: `twinkle ${2.5 + (i % 4)}s ease-in-out ${(i % 6) * 0.5}s infinite`,
                    }}
                />
            ))}
            <span className="absolute top-6 -right-10 h-[2px] w-24 rounded-full bg-gradient-to-l from-white via-sphen-orange to-transparent animate-meteor" style={{ animationDuration: "7s" }} />
            <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-[1.2fr_0.8fr_1fr] text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <Penguin pose="idle" size={52} glow={false} />
                        <img src="/assets/logo.png" alt="SPHEN DIGITAL" className="h-10 w-auto" />
                    </div>
                    <p className="mt-5 text-white/50 text-sm leading-relaxed max-w-xs">Ideas That Move Markets. Premium digital marketing for brands that refuse to blend in.</p>
                    <div className="flex gap-3 mt-6 justify-center md:justify-start">
                        {[
                            { Icon: Instagram, href: "https://instagram.com/sphendigital", id: "footer-social-instagram" },
                            { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61592640367989", id: "footer-social-facebook" },
                            { Icon: Linkedin, href: "https://linkedin.com/company/sphendigital", id: "footer-social-linkedin" },
                            { Icon: Youtube, href: "https://youtube.com/@sphendigital", id: "footer-social-youtube" },
                        ].map(({ Icon, href, id }) => (
                            <a key={id} href={href} target="_blank" rel="noreferrer" data-testid={id} aria-label={id} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:border-sphen-purple/60 hover:-translate-y-1 transition-all duration-300">
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="font-display font-bold text-white text-sm uppercase tracking-[0.25em] mb-5">Quick Links</h4>
                    <ul className="flex flex-col gap-3 items-center md:items-start">
                        {quickLinks.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    data-testid={`footer-link-${l.label.toLowerCase()}`}
                                    onClick={(e) => { e.preventDefault(); scrollToSection(l.href); }}
                                    className="text-sm text-white/50 hover:text-sphen-orange hover:pl-2 transition-all duration-300"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="font-display font-bold text-white text-sm uppercase tracking-[0.25em] mb-5">Growth Newsletter</h4>
                    <p className="text-sm text-white/50 mb-4">One sharp marketing idea in your inbox, every week.</p>
                    <form data-testid="newsletter-form" onSubmit={subscribe} className="flex gap-2 w-full max-w-sm">
                        <input
                            data-testid="newsletter-email-input"
                            type="email"
                            required
                            placeholder="you@business.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 min-w-0 rounded-full bg-white/[0.05] border border-white/10 px-5 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-sphen-purple transition-colors"
                        />
                        <button
                            data-testid="newsletter-subscribe-button"
                            disabled={sending}
                            aria-label="Subscribe"
                            className="w-11 h-11 rounded-full bg-gradient-to-r from-sphen-purple to-[#8b5cf6] flex items-center justify-center text-white glow-purple hover:scale-110 active:scale-95 transition-transform disabled:opacity-60"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
            <div className="relative border-t border-white/8 py-6 text-center text-xs text-white/35">
                © {new Date().getFullYear()} SPHEN DIGITAL · 27-28, Phase IV, Udyog Vihar, Sector 18, Gurugram, Haryana 122015 · Ideas That Move Markets.
            </div>
        </footer>
    );
};
