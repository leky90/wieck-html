(() => {
  const boot = () => {
    document.querySelectorAll(".carousel").forEach(initCarousel);
  };

  // run at the right time (even if you put <script> in <head>)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  function initCarousel(root) {
    const content = root.querySelector(".carousel__track");
    if (!content) return;

    // Each slide is a direct child of .carousel__track
    const slides = Array.from(content.children).filter(
      (el) => el.nodeType === 1
    );
    if (!slides.length) return;

    const btnPrev = root.querySelector(".carousel__prev");
    const btnNext = root.querySelector(".carousel__next");
    const dotsWrap = root.querySelector(".carousel__dots");

    // Check if this is an images carousel (flexible width)
    const isImagesCarousel = root.classList.contains("carousel--images");

    // (Important) Rebuild dots to match the number of slides
    let dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const b = document.createElement("button");
        b.className = "carousel__dot";
        b.type = "button";
        b.innerHTML = "<span></span>"; // match with current CSS
        b.addEventListener("click", () => go(i));
        dotsWrap.appendChild(b);
      });
      dots = Array.from(dotsWrap.querySelectorAll(".carousel__dot"));
    }

    // index init (if you set inline: style="--index:1" will be read)
    let index = parseInt(
      getComputedStyle(root).getPropertyValue("--index"),
      10
    );
    if (Number.isNaN(index)) index = 0;

    const clamp = (i) => (i + slides.length) % slides.length;

    // Calculate slide positions for flexible width carousel
    function calculateSlidePositions() {
      if (!isImagesCarousel) return;

      let cumulativeWidth = 0;
      const positions = [];

      slides.forEach((slide, i) => {
        positions[i] = cumulativeWidth;
        cumulativeWidth += slide.offsetWidth;
      });

      return positions;
    }

    function render() {
      if (isImagesCarousel) {
        // For images carousel, calculate actual positions
        const positions = calculateSlidePositions() || [];
        const requestedX = positions[index] || 0;
        const viewportWidth = content.parentElement
          ? content.parentElement.clientWidth
          : 0;
        const totalWidth = content.scrollWidth;
        const maxScrollX = Math.max(0, totalWidth - viewportWidth);
        const translateX = Math.min(requestedX, maxScrollX);
        content.style.transform = `translateX(-${translateX}px)`;
        root.style.setProperty("--translate-x", `${translateX}px`);
      } else {
        // For regular carousel, use percentage-based positioning
        root.style.setProperty("--index", String(index));
      }

      // Update dots + a11y
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === index);
        d.setAttribute("aria-current", i === index ? "true" : "false");
      });
      slides.forEach((el, i) =>
        el.setAttribute("aria-hidden", i === index ? "false" : "true")
      );
    }

    function go(i) {
      // Wrap indices using clamp: last -> first, first -> last
      index = clamp(i);
      render();
    }

    const next = () => go(index + 1);
    const prev = () => go(index - 1);

    btnNext?.addEventListener("click", next);
    btnPrev?.addEventListener("click", prev);

    // keyboard support for each carousel
    root.tabIndex = 0;
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    });

    // Handle window resize and image load for images carousel
    if (isImagesCarousel) {
      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          render();
        }, 100);
      });

      // Re-render after each image loads to correct widths and positions
      slides.forEach((el) => {
        if (el.tagName === "IMG") {
          if (el.complete) return; // already loaded
          el.addEventListener("load", () => render(), { once: true });
        }
      });
    }

    // Init
    render();

    // (optional) Autoplay each carousel
    // let timer = setInterval(next, 5000);
    // root.addEventListener('pointerenter', () => clearInterval(timer));
    // root.addEventListener('pointerleave', () => timer = setInterval(next, 5000));
  }
})();
