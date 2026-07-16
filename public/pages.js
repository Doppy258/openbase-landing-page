// Shared behaviour for the subpages: the download terms-gate modal.

const DOWNLOADS = {
  mac: {
    subject: "Mac app",
    label: "Mac app",
    url: "https://openbase-coder-desktop-releases-632795836081-us-east-1.s3.amazonaws.com/mac/Openbase-Coder-latest-arm64.dmg",
  },
  android: {
    subject: "Android test build",
    label: "Android test build",
    url: "https://openbase-coder-desktop-releases-632795836081-us-east-1.s3.us-east-1.amazonaws.com/android/Openbase-Coder-latest-debug.apk",
  },
  linux: {
    subject: "Linux AppImage test build",
    label: "Linux AppImage test build",
    url: "https://openbase-coder-desktop-releases-632795836081-us-east-1.s3.amazonaws.com/linux/Openbase-Coder-latest-x86_64.AppImage",
  },
};

// Footer year (no build step, so stamp it at runtime).
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const legacyRoot = document.querySelector("[data-legacy-page]");
const betaAccessGranted = legacyRoot?.dataset.betaAccess === "true";

if (betaAccessGranted) {
  document.querySelectorAll("[data-beta-link]").forEach((link) => {
    link.setAttribute("href", "/install");
    link.querySelectorAll("[data-beta-label]").forEach((label) => {
      label.textContent = "Open Downloads";
    });
  });
}

(function () {
  const modal = document.getElementById("termsModal");
  if (!modal) return;

  const titleEl = modal.querySelector("[data-modal-title]");
  const subjectEls = modal.querySelectorAll("[data-modal-subject]");
  const checkbox = modal.querySelector("#termsAgree");
  const confirmBtn = modal.querySelector("[data-modal-confirm]");
  const cancelEls = modal.querySelectorAll("[data-modal-close]");
  const panel = modal.querySelector(".modal");

  let pending = null;
  let lastFocus = null;

  function open(key) {
    const cfg = DOWNLOADS[key];
    if (!cfg) return;
    pending = cfg;
    lastFocus = document.activeElement;
    titleEl.textContent = "Before downloading the " + cfg.label;
    subjectEls.forEach((el) => (el.textContent = cfg.subject));
    checkbox.checked = false;
    confirmBtn.disabled = true;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    checkbox.focus();
  }

  function close() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    pending = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  checkbox.addEventListener("change", () => {
    confirmBtn.disabled = !checkbox.checked;
  });

  confirmBtn.addEventListener("click", () => {
    if (!pending || !checkbox.checked) return;
    const url = pending.url;
    close();
    window.location.href = url;
  });

  cancelEls.forEach((el) => el.addEventListener("click", close));

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") {
      close();
    } else if (e.key === "Tab") {
      // Simple focus trap within the modal panel.
      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  document.querySelectorAll("[data-download]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      open(btn.getAttribute("data-download"));
    });
  });
})();
