import { useEffect, useState } from "react";
import "@/App.css";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/Cursor";
import { Galaxy } from "@/components/Galaxy";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { BrandMark } from "@/components/BrandMark";
import { About } from "@/components/About";
import { MeetSphen } from "@/components/MeetSphen";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { Portfolio } from "@/components/Portfolio";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { Blog } from "@/components/Blog";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Divider } from "@/components/Divider";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Chatbot } from "@/components/Chatbot";
import { LeadPopup } from "@/components/LeadPopup";
import { SoundConsent } from "@/components/SoundConsent";
import { PaymentSuccess, PaymentCancel } from "@/components/PaymentPages";
import { LeadFormModal } from "@/components/LeadFormModal";
import AdminPage from "@/components/Admin";
import { sound } from "@/lib/sound";

function HomePage() {
    const [leadModal, setLeadModal] = useState(null);

    useEffect(() => {
        const open = (e) => setLeadModal(e.detail);
        window.addEventListener("open-lead-modal", open);
        return () => window.removeEventListener("open-lead-modal", open);
    }, []);

    return (
        <>
            <Navbar />
            <ScrollProgress />
            <main className="relative z-10">
                <Hero />
                <Marquee />
                <BrandMark />
                <About />
                <Divider />
                <MeetSphen />
                <Divider />
                <Services />
                <Divider />
                <WhyUs />
                <Divider />
                <Process />
                <Divider />
                <Pricing />
                <Divider />
                <Portfolio />
                <Stats />
                <Divider />
                <Testimonials />
                <Divider />
                <Blog />
                <Divider />
                <FAQ />
                <Divider />
                <Contact />
            </main>
            <Footer />
            <FloatingButtons />
            <Chatbot />
            <LeadPopup />
            {leadModal && <LeadFormModal config={leadModal} onClose={() => setLeadModal(null)} />}
        </>
    );
}

function App() {
    const isHome = window.location.pathname === "/";
    const [loading, setLoading] = useState(isHome);
    const [askSound, setAskSound] = useState(() => isHome && !localStorage.getItem("sphen_sound"));

    useEffect(() => {
        if (!isHome) return;
        if (localStorage.getItem("sphen_sound") === "on") {
            sound.setEnabled(true);
            sound.epicOpening();
            const resume = () => {
                if (sound.ctx && sound.ctx.state === "suspended") {
                    sound.ctx.resume();
                    sound.epicOpening();
                }
            };
            window.addEventListener("pointerdown", resume, { once: true });
            return () => window.removeEventListener("pointerdown", resume);
        }
    }, []);

    useEffect(() => {
        const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
        window.__lenis = lenis;
        let rafId;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            window.__lenis = null;
        };
    }, []);

    useEffect(() => {
        if (!isHome) return;
        const t = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(t);
    }, [isHome]);

    useEffect(() => {
        const onOver = (e) => {
            if (e.target.closest?.("button,a,[role='button']") && sound.throttled("tick", 100)) sound.tick();
            else if (e.target.closest?.("[data-testid^='service-card'],[data-testid^='pricing-card'],[data-testid^='portfolio-item'],[data-testid^='blog-card'],[data-testid^='testimonial-card']") && sound.throttled("pop", 160)) sound.pop();
        };
        const onClick = (e) => {
            if (e.target.closest?.("button,a,[role='button']")) sound.click();
        };
        document.addEventListener("mouseover", onOver);
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("mouseover", onOver);
            document.removeEventListener("click", onClick);
        };
    }, []);

    return (
        <div className="App font-body">
            <CustomCursor />
            <Galaxy />
            <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
            <AnimatePresence>{askSound && <SoundConsent key="sound" onDone={() => setAskSound(false)} />}</AnimatePresence>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/cancel" element={<PaymentCancel />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </BrowserRouter>
            <Toaster theme="dark" position="top-center" richColors />
        </div>
    );
}

export default App;
