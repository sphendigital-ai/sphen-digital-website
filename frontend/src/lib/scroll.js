export const scrollToSection = (hash) => {
    if (window.__lenis) {
        window.__lenis.scrollTo(hash, { offset: -72, duration: 1.4 });
    } else {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }
};
