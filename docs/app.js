(function () {
  "use strict";

  const nav = document.getElementById("side-nav");
  const toggle = document.getElementById("nav-toggle");
  const links = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  // Mobile nav toggle
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Contents";
    });

    links.forEach((a) => {
      a.addEventListener("click", () => {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "Contents";
        }
      });
    });
  }

  // Smooth scroll already via CSS; reinforce for older browsers / offset
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  // Active section highlight via IntersectionObserver
  if (sections.length && "IntersectionObserver" in window) {
    const linkById = new Map(
      links.map((a) => [a.getAttribute("href").slice(1), a])
    );

    const setActive = (id) => {
      links.forEach((a) => a.classList.remove("active"));
      const link = linkById.get(id);
      if (link) link.classList.add("active");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // Collapsible appendix sections
  document.querySelectorAll("[data-collapse-toggle]").forEach((btn) => {
    const targetId = btn.getAttribute("aria-controls");
    const panel = document.getElementById(targetId);
    if (!panel) return;

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (expanded) {
        panel.setAttribute("hidden", "");
      } else {
        panel.removeAttribute("hidden");
      }
    });
  });
})();
