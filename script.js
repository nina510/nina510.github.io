const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = [...document.querySelectorAll(".site-nav a")];
const themeButton = document.querySelector(".theme-toggle");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const projectList = document.querySelector(".project-list");
const projectCards = [...document.querySelectorAll(".project-row")];
let projectLayoutFrame;

const storedTheme = localStorage.getItem("theme");
const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeButton.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
}

setTheme(storedTheme || (prefersDarkTheme ? "dark" : "light"));

themeButton.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
}

function resetProjectLayout() {
  projectList.classList.remove("masonry-ready");
  projectList.style.height = "";
  projectCards.forEach((card) => {
    card.style.width = "";
    card.style.left = "";
    card.style.top = "";
  });
}

function layoutProjectCards() {
  if (!projectList) return;
  if (window.innerWidth <= 620) {
    resetProjectLayout();
    return;
  }

  const gap = 18;
  const rightColumnOffset = 52;
  const cardWidth = (projectList.clientWidth - gap) / 2;
  const columnHeights = [0, rightColumnOffset];

  projectList.classList.add("masonry-ready");
  projectCards.forEach((card) => {
    card.style.width = `${cardWidth}px`;
  });

  projectCards.forEach((card, index) => {
    const column = index % 2;
    card.style.left = `${column * (cardWidth + gap)}px`;
    card.style.top = `${columnHeights[column]}px`;
    columnHeights[column] += card.offsetHeight + gap;
  });

  projectList.style.height = `${Math.max(...columnHeights) - gap}px`;
}

function scheduleProjectLayout() {
  cancelAnimationFrame(projectLayoutFrame);
  projectLayoutFrame = requestAnimationFrame(layoutProjectCards);
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  navigation.classList.toggle("open", !isOpen);
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  document.body.classList.toggle("menu-open", !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeMenu();
  scheduleProjectLayout();
});

window.addEventListener(
  "scroll",
  () => header.classList.toggle("scrolled", window.scrollY > 12),
  { passive: true },
);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

revealElements.forEach((element) => revealObserver.observe(element));

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

document.querySelectorAll(".project-visual img").forEach((image) => {
  if (!image.complete) image.addEventListener("load", scheduleProjectLayout, { once: true });
});

document.fonts?.ready.then(scheduleProjectLayout);
scheduleProjectLayout();

document.querySelector("#current-year").textContent = new Date().getFullYear();
