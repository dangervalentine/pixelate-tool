export function getInitialTheme() {
  const stored = localStorage.getItem("pixelate-tool-theme");
  if (stored === "light" || stored === "dark") return stored;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

export function setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("pixelate-tool-theme", mode);
}
