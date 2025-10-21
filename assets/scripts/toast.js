class Toast {
  static timeout = null;

  static show({ id, type, title, message, duration = 3000 }) {
    let toastEl = document.getElementById(id);
    if (!toastEl) {
      toastEl = document.querySelector(".toast");
    }

    toastEl.classList.add(`toast--${type}`);
    toastEl.classList.add("toast--show");
    toastEl.querySelector(".toast__title").textContent = title;
    toastEl.querySelector(".toast__message").textContent = message;

    this.timeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  static hide() {
    clearTimeout(this.timeout);

    const toastEl = document.querySelector(".toast");
    if (!toastEl) {
      toastEl = document.querySelector(".toast");
    }

    toastEl.classList.remove("toast--show");
  }
}
