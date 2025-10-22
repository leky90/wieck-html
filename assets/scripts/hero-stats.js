(() => {
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateValue = (el, target, decimals, suffix, duration) => {
    const start = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const value = start + (target - start) * eased;
      el.textContent = `${value.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const boot = () => {
    const stats = document.querySelectorAll(".hero-section .text-stat");
    if (!stats.length) return;

    stats.forEach((el) => {
      const finalText = el.textContent.trim();
      if (!finalText) return;

      const match = finalText.match(/^(\d+[.,]?\d*)(.*)$/);
      if (!match) return;

      const numericPart = match[1];
      const suffix = match[2] || "";

      const decimalSeparator = numericPart.includes(".")
        ? "."
        : numericPart.includes(",")
          ? ","
          : null;
      const decimals = decimalSeparator
        ? numericPart.split(decimalSeparator)[1].length
        : 0;

      const normalizedNumber = decimalSeparator
        ? numericPart.replace(decimalSeparator, ".")
        : numericPart;
      const target = parseFloat(normalizedNumber);
      if (Number.isNaN(target)) return;

      const duration = parseInt(el.dataset.countDuration || "1600", 10);

      el.textContent = `${(0).toFixed(decimals)}${suffix}`;
      animateValue(el, target, decimals, suffix, duration);
    });

    // Add active class to card-stat elements
    const cardStats = document.querySelectorAll(".card-stat");
    cardStats.forEach((card) => {
      card.classList.add("card-stat--active");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
