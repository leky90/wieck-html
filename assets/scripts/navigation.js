(() => {
  const boot = () => {
    const header = document.querySelector(".header");
    if (header) {
      const updateHeight = () => {
        if (window.scrollY > 0) {
          header.style.padding = "10px 0";
        } else {
          header.style.padding = "";
        }
      };

      updateHeight();
      window.addEventListener("scroll", updateHeight, { passive: true });
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
