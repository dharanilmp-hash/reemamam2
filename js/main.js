const dust = document.getElementById("dust");
const stars = document.getElementById("stars");
const year = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (year) year.textContent = new Date().getFullYear();

if (stars) {
  for (let i = 0; i < 24; i += 1) {
    const dot = document.createElement("i");
    if (i < 13) dot.classList.add("on");
    stars.appendChild(dot);
  }
}

const ctx = dust ? dust.getContext("2d") : null;
const glyphs = ["॥", "ॐ", "و", "س", "अ", "र", "·", "✦"];
let particles = [];
let mouse = { x: 0, y: 0 };

function sizeCanvas() {
  dust.width = window.innerWidth;
  dust.height = window.innerHeight;
}

function spawn() {
  particles = Array.from({ length: 42 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    v: 0.15 + Math.random() * 0.45,
    g: glyphs[Math.floor(Math.random() * glyphs.length)],
    a: 0.08 + Math.random() * 0.16,
  }));
}

function drawDust() {
  ctx.clearRect(0, 0, dust.width, dust.height);
  ctx.font = "14px Tiro Devanagari Hindi, serif";
  particles.forEach((p) => {
    p.y -= p.v;
    p.x += Math.sin((p.y + mouse.x) * 0.002) * 0.4;
    if (p.y < -20) p.y = innerHeight + 20;
    ctx.fillStyle = `rgba(138,100,32,${p.a})`;
    ctx.fillText(p.g, p.x, p.y);
  });
  requestAnimationFrame(drawDust);
}

if (dust && ctx) {
  sizeCanvas();
  spawn();
  drawDust();
  window.addEventListener("resize", () => {
    sizeCanvas();
    spawn();
  });
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
}

const layers = document.querySelectorAll("[data-depth]");
window.addEventListener("pointermove", (e) => {
  const x = (e.clientX / innerWidth - 0.5) * 2;
  const y = (e.clientY / innerHeight - 0.5) * 2;
  layers.forEach((layer) => {
    const d = Number(layer.dataset.depth);
    layer.style.transform = `translate(${x * 18 * d}px, ${y * 14 * d}px) scale(1.08)`;
  });
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-on"));
    btn.classList.add("is-on");
    const kind = btn.dataset.filter;
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("is-hidden", kind !== "all" && card.dataset.kind !== kind);
    });
  });
});

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks.querySelectorAll(".has-drop > a").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (window.innerWidth > 1200) return;
    event.preventDefault();
    link.parentElement.classList.toggle("is-open");
  });
});

navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    if (a.parentElement.classList.contains("has-drop") && window.innerWidth <= 1200) return;
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const sectionIds = ["home", "about", "research", "publications", "teaching", "projects", "news", "contact"];
const topLinks = [...navLinks.querySelectorAll(".nav-item > a")];
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      topLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        link.classList.toggle("is-on", href === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.28 }
);
sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

