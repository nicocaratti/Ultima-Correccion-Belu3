(() => {
    "use strict";

    // 1. Spotlight (Efecto linterna)
    const spot = document.querySelector(".spotlight");
    if (spot) {
        window.addEventListener("pointermove", e => {
            spot.style.setProperty("--mx", e.clientX + "px");
            spot.style.setProperty("--my", e.clientY + "px");
        }, { passive: true });
    }

    // 2. Intersection Observer (Reveal suave)
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add("in");
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.12 });
    
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));

    // 3. Mar de Iguales
    const sea = document.querySelector("#sea");
    if (sea) {
        const TOTAL = 36;
        const STAR = 22;
        
        for (let i = 0; i < TOTAL; i++) {
            const d = document.createElement("span");
            d.className = "same" + (i === STAR ? " same--star" : "");
            sea.appendChild(d);
        }
    }

    // 4. Hamburger menu
    const nav = document.getElementById("nav");
    const hamburger = document.querySelector(".nav__hamburger");
    if (nav && hamburger) {
        hamburger.addEventListener("click", () => {
            const open = nav.classList.toggle("nav--open");
            hamburger.setAttribute("aria-expanded", open);
        });
        document.querySelectorAll(".nav__links a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("nav--open");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    }

    // 5. Auto-scroll carrusel de reseñas
    const carousel = document.querySelector(".review-carousel");
    if (carousel) {
        let paused = false;
        carousel.addEventListener("mouseenter", () => paused = true);
        carousel.addEventListener("mouseleave", () => paused = false);
        setInterval(() => {
            if (paused) return;
            const card = carousel.querySelector(".review-card");
            if (!card) return;
            const step = card.offsetWidth + 19;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (carousel.scrollLeft >= maxScroll - 10) {
                carousel.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                carousel.scrollBy({ left: step, behavior: "smooth" });
            }
        }, 3800);
    }

    // 6. Count-up animation en Stats Strip
    const statsStrip = document.querySelector(".stats-strip");
    if (statsStrip) {
        const statsObserver = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                statsObserver.unobserve(en.target);
                en.target.querySelectorAll(".stat-item__num[data-count-to]").forEach(el => {
                    const target = parseInt(el.dataset.countTo, 10);
                    const suffix = el.dataset.suffix || "";
                    const duration = 1600;
                    const startTime = performance.now();
                    el.textContent = "0" + suffix;
                    const step = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.round(target * eased) + suffix;
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                });
            });
        }, { threshold: 0.4 });
        statsObserver.observe(statsStrip);
    }

    // 7. ParalaX en la Galería Masonry
    const items = document.querySelectorAll(".mg__item");
    if (items.length > 0) {
        window.addEventListener("scroll", () => {
            const vh = window.innerHeight;
            items.forEach(it => {
                const r = it.getBoundingClientRect();
                if (r.bottom < 0 || r.top > vh) return;
                const speed = parseFloat(it.dataset.speed || "1");
                it.style.transform = `translateY(${(r.top - vh / 2) * (speed - 1) * 0.12}px)`;
            });
        }, { passive: true });
    }
})();