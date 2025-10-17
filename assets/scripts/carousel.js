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
        // enable dot navigation for both modes
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

    // Helpers for images carousel seamless loop
    let logicalIndex = 0; // for dots only
    let isAnimating = false;
    const originalCount = slides.length;

    function updateDots() {
      dots.forEach((d, i) => {
        const active =
          i ===
          ((logicalIndex % originalCount) + originalCount) % originalCount;
        d.classList.toggle("active", active);
        d.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    function animateTo(targetX, onDone) {
      content.style.transition = "transform 300ms ease";
      content.style.transform = `translateX(-${targetX}px)`;
      const handler = () => {
        content.removeEventListener("transitionend", handler);
        onDone?.();
      };
      content.addEventListener("transitionend", handler);
    }

    function nextImages() {
      if (isAnimating) return;
      isAnimating = true;
      const first = slides[0];
      const shift = first.offsetWidth;
      animateTo(shift, () => {
        content.style.transition = "none";
        content.appendChild(first);
        slides.push(slides.shift());
        content.style.transform = "translateX(0px)";
        logicalIndex = (logicalIndex + 1) % originalCount;
        updateDots();
        isAnimating = false;
      });
    }

    function prevImages() {
      if (isAnimating) return;
      isAnimating = true;
      const last = slides[slides.length - 1];
      const shift = last.offsetWidth;
      content.style.transition = "none";
      content.insertBefore(last, slides[0]);
      slides.unshift(slides.pop());
      content.style.transform = `translateX(-${shift}px)`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          animateTo(0, () => {
            content.style.transition = "none";
            content.style.transform = "translateX(0px)";
            logicalIndex = (logicalIndex - 1 + originalCount) % originalCount;
            updateDots();
            isAnimating = false;
          });
        });
      });
    }

    // Instant jump to target logical index (dot click) without sliding through
    function jumpTo(target) {
      if (!isImagesCarousel) return;
      const normalizedTarget =
        ((target % originalCount) + originalCount) % originalCount;
      let delta =
        (normalizedTarget - logicalIndex + originalCount) % originalCount;
      if (delta === 0) return;
      content.style.transition = "none";
      // Rotate DOM in the shorter direction but instantly (no animation frames)
      if (delta <= originalCount / 2) {
        while (delta-- > 0) {
          const first = slides[0];
          content.appendChild(first);
          slides.push(slides.shift());
        }
      } else {
        let steps = originalCount - delta;
        while (steps-- > 0) {
          const last = slides[slides.length - 1];
          content.insertBefore(last, slides[0]);
          slides.unshift(slides.pop());
        }
      }
      content.style.transform = "translateX(0px)";
      logicalIndex = normalizedTarget;
      updateDots();
    }

    function render() {
      if (isImagesCarousel) {
        // Images carousel: enforce left-edge alignment at init
        content.style.transition = "none";
        content.style.transform = "translateX(0px)";
        root.style.setProperty("--translate-x", "0px");
        updateDots();
      } else {
        // For regular carousel, use percentage-based positioning
        root.style.setProperty("--index", String(index));
        // Update dots + a11y
        dots.forEach((d, i) => {
          d.classList.toggle("active", i === index);
          d.setAttribute("aria-current", i === index ? "true" : "false");
        });
        slides.forEach((el, i) =>
          el.setAttribute("aria-hidden", i === index ? "false" : "true")
        );
      }
    }

    function go(i) {
      if (isImagesCarousel) {
        // Dot click or programmatic jump: reposition instantly without per-slide animation
        jumpTo(i);
      } else {
        index = clamp(i);
        render();
      }
    }

    const next = () => (isImagesCarousel ? nextImages() : go(index + 1));
    const prev = () => (isImagesCarousel ? prevImages() : go(index - 1));

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
          // No-op: layout adjusts automatically since we use DOM reordering
        }, 100);
      });

      // Ensure initial dots state after images load
      slides.forEach((el) => {
        if (el.tagName === "IMG") {
          if (el.complete) return; // already loaded
          el.addEventListener("load", () => updateDots(), { once: true });
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
