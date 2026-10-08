const selectors = [
  "nextjs-portal",
  "astro-dev-toolbar",
  "vercel-live-feedback",
  "#nuxt-devtools-container",
  ".tsqd-parent-container",
  ".phpdebugbar",
];

addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `${selectors.join(", ")} { display: none !important; }`;
  document.head.append(style);
});
