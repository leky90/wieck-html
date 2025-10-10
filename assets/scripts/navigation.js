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
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
