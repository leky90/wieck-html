(() => {
  const boot = () => {
    const header = document.querySelector(".header");
    const hero = document.querySelector(".hero-section");
    if (header) {
      const updateHeaderState = () => {
        const scrolledPastHero = hero
          ? window.scrollY >= hero.offsetHeight - header.offsetHeight
          : window.scrollY > 0;
        const scrolled = window.scrollY > 0;

        header.style.padding = scrolled ? "10px 0" : "";

        header.classList.toggle("header--scrolled", scrolledPastHero);
      };

      updateHeaderState();
      window.addEventListener("scroll", updateHeaderState, { passive: true });
      window.addEventListener("resize", updateHeaderState);
    }

    const mobileToggle = document.querySelector(".mobile-nav__checkbox");
    if (mobileToggle) {
      const contactLinks = document.querySelectorAll(
        '.mobile-nav [href="#contact-us"]'
      );
      const closeNav = () => {
        mobileToggle.checked = false;
      };

      contactLinks.forEach((link) => {
        link.addEventListener("click", () => {
          closeNav();
        });
      });

      const footerButtons = document.querySelectorAll(
        '.mobile-nav__footer a[href="#contact-us"], .mobile-nav__content .button[href="#contact-us"]'
      );

      footerButtons.forEach((button) => {
        button.addEventListener("click", () => {
          closeNav();
        });
      });
    }

    // Smooth scroll for Services link on any page
    const servicesLinks = document.querySelectorAll(
      'a[href="#services"], a[href$="index.html#services"]'
    );
    const servicesSection = document.getElementById("services");
    const isOnHome = !!servicesSection;

    const smoothScrollToServices = (e) => {
      if (!servicesSection) return;
      e?.preventDefault();

      // Close mobile nav if open
      const mobileToggleEl = document.querySelector(".mobile-nav__checkbox");
      if (mobileToggleEl) mobileToggleEl.checked = false;

      // Account for fixed header height
      const headerEl = document.querySelector(".header");
      const headerOffset = headerEl ? headerEl.offsetHeight : 0;
      const y =
        servicesSection.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset -
        8;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    };

    servicesLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // If we're already on home (services section exists), intercept and smooth scroll
        if (isOnHome) {
          smoothScrollToServices(e);
        }
        // Else allow normal navigation to index.html#services
      });
    });

    // If landing on the page with #services in URL, smooth-scroll after load
    if (isOnHome && location.hash === "#services") {
      // allow layout settle first
      setTimeout(() => smoothScrollToServices(), 0);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
