// Modal toggle and dynamic content insertion
(function () {
  "use strict";

  // Utility: get elements once
  let modal = document.querySelector(".modal");
  if (!modal) return;
  let modalContainer = modal.querySelector(".modal__container");
  let closeBtn = modal.querySelector(".modal__close");

  // Create overlay click by listening on modal itself (outside container)
  function isClickOutsideContainer(event) {
    return event.target === modal && !modalContainer.contains(event.target);
  }

  function openModal() {
    modal.style.display = "flex"; // allow centering if needed via CSS
    document.documentElement.style.overflow = "hidden";
  }

  function closeModal() {
    modal.style.display = "none";
    document.documentElement.style.overflow = "";
  }

  // Build content for modal from a trigger element
  function buildModalContentFromTrigger(trigger) {
    // Clear previous dynamic content but keep close button
    let persistentClose = modalContainer.querySelector(".modal__close");
    // Remove all children first
    while (modalContainer.firstChild) {
      modalContainer.removeChild(modalContainer.firstChild);
    }
    // Re-add close button as the first element
    if (persistentClose) {
      modalContainer.appendChild(persistentClose);
    }

    // Extract data
    let imgEl = trigger.querySelector("[data-modal-image]");
    let infoEl = trigger.querySelector("[data-modal-info]");
    let contentEl = trigger.querySelector("[data-modal-content]");

    // Clone and append if exist
    if (imgEl) {
      let figure = document.createElement("div");
      figure.className = "modal__image";
      let clonedImg = imgEl.cloneNode(true);
      // Ensure image tag is used if the source was the <img>
      if (clonedImg.tagName === "IMG") {
        figure.appendChild(clonedImg);
      } else {
        figure.appendChild(clonedImg.querySelector("img") || clonedImg);
      }
      modalContainer.appendChild(figure);
    }

    if (infoEl) {
      let header = document.createElement("div");
      header.className = "modal__header";
      header.appendChild(infoEl.cloneNode(true));
      modalContainer.appendChild(header);
    }

    if (contentEl) {
      let body = document.createElement("div");
      body.className = "modal__body";
      // Unhide hidden content when cloning
      let clonedContent = contentEl.cloneNode(true);
      if (clonedContent.hasAttribute("hidden")) {
        clonedContent.removeAttribute("hidden");
      }
      body.appendChild(clonedContent);
      modalContainer.appendChild(body);
    }
  }

  // Event: open from triggers
  function onTriggerClick(event) {
    let trigger = event.currentTarget;
    buildModalContentFromTrigger(trigger);
    openModal();
  }

  // Attach listeners to triggers
  let triggers = document.querySelectorAll("[data-modal-trigger]");
  for (let i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener("click", onTriggerClick);
  }

  // Close interactions
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", function (event) {
    if (isClickOutsideContainer(event)) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
})();
