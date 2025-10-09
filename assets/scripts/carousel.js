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
    console.log(index);
    if (Number.isNaN(index)) index = 0;

    const clamp = (i) => (i + slides.length) % slides.length;

    function render() {
      root.style.setProperty("--index", String(index));
      // cập nhật dots + a11y
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === index);
        d.setAttribute("aria-current", i === index ? "true" : "false");
      });
      slides.forEach((el, i) =>
        el.setAttribute("aria-hidden", i === index ? "false" : "true")
      );
    }

    function go(i) {
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

    // Init
    render();

    // (optional) Autoplay each carousel
    // let timer = setInterval(next, 5000);
    // root.addEventListener('pointerenter', () => clearInterval(timer));
    // root.addEventListener('pointerleave', () => timer = setInterval(next, 5000));
  }
})();
