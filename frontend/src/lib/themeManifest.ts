function updateManifest(e: MediaQueryList | MediaQueryListEvent) {
  const manifestFile = e.matches
    ? "/manifest-dark.json"
    : "/manifest-light.json";

  let link = document.querySelector(
    'link[rel="manifest"]'
  ) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.rel = "manifest";
    document.head.appendChild(link);
  }

  link.href = manifestFile;
}

export function initThemeManifest() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", updateManifest);
  updateManifest(mediaQuery);
}
