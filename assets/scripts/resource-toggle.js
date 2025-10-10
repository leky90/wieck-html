(() => {
  const boot = () => {
    const checkbox = document.querySelector("#view-more-posts");
    const toggleLabel = document.querySelector('label[for="view-more-posts"]');
    if (!checkbox || !toggleLabel) return;

    const defaultText = toggleLabel.textContent.trim();
    const expandedText = toggleLabel.dataset.expandedLabel || "View Less Posts";

    const updateLabel = () => {
      toggleLabel.textContent = checkbox.checked ? expandedText : defaultText;
    };

    checkbox.addEventListener("change", updateLabel);
    updateLabel();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
