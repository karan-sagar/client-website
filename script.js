const canvas = document.getElementById("electronCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let logicalWidth = 0;
let logicalHeight = 0;
let lastTime = 0;

function randNormal(mean = 0, stdDev = 1) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

function initParticles() {
  particles = [];
  const cx = logicalWidth / 2;
  const cy = logicalHeight / 2;

  const outerRadius = logicalWidth * 0.32;  // slightly smaller to fit 0.60em
  const outerSpread = logicalWidth * 0.06;
  const nucleusRadius = logicalWidth * 0.06;

  const outerCount = 220;
  const nucleusCount = 80;

  for (let i = 0; i < outerCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const baseR = outerRadius + randNormal(0, outerSpread);
    particles.push({
      type: "outer",
      angle,
      radius: baseR,
      baseRadius: baseR,
      cx,
      cy,
      angVel: (Math.random() * 0.8 + 0.4) * (Math.random() < 0.5 ? 1 : -1),
      jitterPhase: Math.random() * Math.PI * 2,
      jitterSpeed: Math.random() * 2 + 0.5,
      jitterAmount: outerSpread * 0.35
    });
  }

  for (let i = 0; i < nucleusCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const baseR = Math.abs(randNormal(0, nucleusRadius * 0.7));
    particles.push({
      type: "nucleus",
      angle,
      radius: baseR,
      baseRadius: baseR,
      cx,
      cy,
      angVel: (Math.random() * 1.0 - 0.5),
      jitterPhase: Math.random() * Math.PI * 2,
      jitterSpeed: Math.random() * 2 + 1,
      jitterAmount: nucleusRadius * 0.3
    });
  }
}

function placeCanvas() {
  const span = document.querySelector(".electron-o");
  const rect = span.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  logicalWidth = rect.width;
  logicalHeight = rect.height;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  initParticles();
}

function update(dt) {
  particles.forEach(p => {
    p.angle += p.angVel * dt;

    const t = performance.now() / 1000;
    const jitter = Math.sin(2 * Math.PI * p.jitterSpeed * t + p.jitterPhase) * p.jitterAmount;
    p.radius = p.baseRadius + jitter;
  });
}

function draw() {
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);

  ctx.fillStyle = "#000";
  particles.forEach(p => {
    const x = p.cx + p.radius * Math.cos(p.angle);
    const y = p.cy + p.radius * Math.sin(p.angle);
    const size = p.type === "nucleus" ? 1.4 : 1.0;
    ctx.fillRect(x, y, size, size);
  });
}

function animate(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(dt);
  draw();
  requestAnimationFrame(animate);
}

window.addEventListener("load", () => {
  placeCanvas();
  requestAnimationFrame(animate);
});

window.addEventListener("resize", placeCanvas);

document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
  
    if (!navToggle || !navLinks) return;
  
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("nav-links--open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  
    // Optional: close menu when a link is clicked
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("nav-links--open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });