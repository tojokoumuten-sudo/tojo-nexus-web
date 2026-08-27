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
