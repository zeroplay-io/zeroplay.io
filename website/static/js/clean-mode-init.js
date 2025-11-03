(function () {
  if (typeof window === "undefined") {
    return;
  }

  try {
    var params = new URLSearchParams(window.location.search || "");
    var mode = params.get("mode");
    if (mode && mode.toLowerCase() === "clean") {
      document.documentElement.classList.add("clean-mode");

      if (document.body) {
        document.body.classList.add("clean-mode");
      } else {
        document.addEventListener(
          "DOMContentLoaded",
          function () {
            document.body && document.body.classList.add("clean-mode");
          },
          { once: true },
        );
      }
    }

    var theme = params.get("theme");
    if (theme && (theme === "light" || theme === "dark")) {
      document.documentElement.setAttribute("data-theme", theme);
      try {
        window.localStorage.setItem("theme", theme);
      } catch (_) {
        /* ignore */
      }
    }
  } catch (error) {
    // Silently ignore malformed query strings.
  }
})();
