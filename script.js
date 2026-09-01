const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = [...document.querySelectorAll(".site-nav a")];
const themeButton = document.querySelector(".theme-toggle");
const sections = document.querySelectorAll("main section[id]");
const themeColor = document.querySelector('meta[name="theme-color"]');

const storedTheme = localStorage.getItem("theme");
const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  const isDark = theme === "dark";
  themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  themeColor.setAttribute("content", isDark ? "#191a18" : "#fbfaf7");
}

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
}

setTheme(storedTheme || (prefersDarkTheme ? "dark" : "light"));

themeButton.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  navigation.classList.toggle("open", !isOpen);
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  document.body.classList.toggle("menu-open", !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) closeMenu();
});

window.addEventListener(
  "scroll",
  () => header.classList.toggle("scrolled", window.scrollY > 8),
  { passive: true },
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: 0 },
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelector("#current-year").textContent = new Date().getFullYear();
