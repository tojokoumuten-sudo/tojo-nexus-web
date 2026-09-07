const NAV = [
  { href: "company.html", label: "COMPANY" },
  { href: "mission.html", label: "MISSION" },
  { href: "service.html", label: "SERVICE" },
  { href: "bim.html", label: "BIM" },
  { href: "career.html", label: "CAREER" },
  { href: "contact.html", label: "CONTACT" },
];

const LOGO =
  "https://hirorin0706-evxfa.wordpress.com/wp-content/uploads/2026/01/cc8cb5a5-8102-4845-9734-566bd3517bea-2.png";

function currentFile() {
  const name = location.pathname.split("/").pop();
  return name === "" || name === "index.html" ? "index.html" : name;
}

function headerHTML() {
  const file = currentFile();
  const solid = file !== "index.html" ? " is-solid" : "";
  return `
    <a class="skip" href="#main">Skip / コンテンツへスキップ</a>
    <header class="header${solid}" data-header>
      <div class="header-inner">
        <a class="brand" href="index.html">
          <img src="${LOGO}" alt="Tojo nexus">
          <span class="brand-text">
            <strong>Tojo nexus</strong>
            <span>Construction BIM</span>
          </span>
        </a>
        <nav class="nav" data-nav aria-label="Main / メイン">
          ${NAV.map(
            (item) =>
              `<a href="${item.href}" class="${file === item.href ? "is-current" : ""}">${item.label}</a>`
          ).join("")}
        </nav>
        <div class="header-actions">
          <span class="lang-mark" aria-hidden="true">JA · EN</span>
          <a class="header-cta" href="contact.html">お問い合わせ<small lang="en">Contact</small></a>
          <button class="menu-btn" type="button" data-menu aria-label="Menu">☰</button>
        </div>
      </div>
    </header>
  `;
}

function footerHTML() {
  return `
    <footer class="footer">
      <div class="wrap footer-grid">
        <div>
          <h3>Studio</h3>
          <p>株式会社Tojo nexus<br><span lang="en" style="font-family:var(--en);font-style:italic">Tojo nexus Co., Ltd.</span></p>
          <p>〒651-0087 兵庫県神戸市中央区御幸通8丁目1-6<br>神戸国際会館 22F<br><span lang="en" style="font-family:var(--en);font-style:italic">22F, Kobe Kokusai Kaikan</span></p>
        </div>
        <div>
          <h3>Hours / Contact</h3>
          <p>月—金 9:00 — 18:00<br><span lang="en" style="font-family:var(--en);font-style:italic">Mon–Fri, 9:00–18:00</span></p>
          <p><a href="mailto:tojo-h@tojo-nexus.com">tojo-h@tojo-nexus.com</a></p>
          <p class="line-label">LINE</p>
          <img class="line-qr" src="images/line-qr.png" alt="LINE QR code / 公式LINE">
        </div>
        <div>
          <h3>Hubs</h3>
          <p>Kobe, Japan</p>
          <p>Da Nang, Vietnam<br>3F, Indochina Riverside Office Tower<br>74 Bạch Đằng, Hải Châu<br>Đà Nẵng 550000</p>
        </div>
      </div>
      <div class="wrap copyright">© ${new Date().getFullYear()} Tojo nexus Co., Ltd.</div>
    </footer>
  `;
}

document.body.insertAdjacentHTML("afterbegin", headerHTML());
document.body.insertAdjacentHTML("beforeend", footerHTML());

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menu = document.querySelector("[data-menu]");

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
});

menu?.addEventListener("click", () => {
  nav.classList.toggle("is-open");
});

/* ===== 2026-09: scroll reveal ===== */
(function () {
  const els = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!els.length) return;
  els.forEach((el) => Array.from(el.children).forEach((c, i) => c.style.setProperty("--i", i)));
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
})();

/* ===== 2026-09: hero wireframe（ライブラリ不要・BIMの線画が奥で静かに回る） ===== */
(function () {
  const cv = document.querySelector("[data-wire]");
  if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, t = 0, mx = 0, my = 0, sy = 0;
  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  addEventListener("resize", size);
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  addEventListener("scroll", () => { sy = Math.min(scrollY, 1200); }, { passive: true });
  // 建物群（抽象・実案件ではない）: x, z, 幅, 奥行, 高さ, 層数
  const B = [
    { x: -2.6, z: -1.6, w: 1.5, d: 1.3, h: 4.2 },
    { x:  0.1, z: -2.6, w: 1.1, d: 1.1, h: 2.6 },
    { x:  1.9, z: -0.9, w: 1.8, d: 1.5, h: 1.3 },
    { x: -0.8, z:  0.9, w: 2.9, d: 1.7, h: 0.9 },
    { x:  2.8, z:  1.5, w: 1.0, d: 1.0, h: 2.0 },
    { x: -4.0, z:  1.3, w: 1.2, d: 1.2, h: 1.5 },
  ];
  function proj(x, y, z, ang) {
    const c = Math.cos(ang), s = Math.sin(ang);
    const rx = x * c - z * s, rz = x * s + z * c;
    const zz = rz + 9.5, f = Math.min(W, H) * 0.95, sc = f / zz;
    return { x: W * 0.64 + rx * sc + mx * 18, y: H * 0.56 - (y - 1.3) * sc + my * 10, d: zz };
  }
  function edge(p, q, a) {
    ctx.strokeStyle = "rgba(232,199,90," + a.toFixed(3) + ")";
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  }
  function frame() {
    t += 0.0022;
    const ang = t + sy * 0.00055;
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      edge(proj(i, 0, -6, ang), proj(i, 0, 6, ang), 0.045);
      edge(proj(-6, 0, i, ang), proj(6, 0, i, ang), 0.045);
    }
    B.forEach((b) => {
      const c = [[b.x, b.z], [b.x + b.w, b.z], [b.x + b.w, b.z + b.d], [b.x, b.z + b.d]];
      const lo = c.map((p) => proj(p[0], 0, p[1], ang)), hi = c.map((p) => proj(p[0], b.h, p[1], ang));
      const depth = (lo[0].d + lo[2].d) / 2;
      const al = Math.max(0.05, Math.min(0.42, (15 - depth) / 11));
      for (let i = 0; i < 4; i++) { edge(lo[i], lo[(i + 1) % 4], al * 0.7); edge(hi[i], hi[(i + 1) % 4], al); edge(lo[i], hi[i], al); }
      const nf = Math.max(1, Math.round(b.h / 0.42));
      for (let k = 1; k < nf; k++) {
        const y = (k * b.h) / nf, f = c.map((p) => proj(p[0], y, p[1], ang));
        for (let i = 0; i < 4; i++) edge(f[i], f[(i + 1) % 4], al * 0.32);
      }
    });
    requestAnimationFrame(frame);
  }
  frame();
})();
