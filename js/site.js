const NAV = [
  { href: "company.html", label: "COMPANY" },
  { href: "mission.html", label: "MISSION" },
  { href: "service.html", label: "SERVICE" },
  { href: "bim.html", label: "BIM" },
  { href: "career.html", label: "CAREER" },
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
    <a class="skip" href="#main">コンテンツへスキップ</a>
    <header class="header${solid}" data-header>
      <div class="header-inner">
        <a class="brand" href="index.html">
          <img src="${LOGO}" alt="Tojo nexus">
          <span class="brand-text">
            <strong>Tojo nexus</strong>
            <span>Construction BIM</span>
          </span>
        </a>
        <nav class="nav" data-nav aria-label="メイン">
          ${NAV.map(
            (item) =>
              `<a href="${item.href}" class="${file === item.href ? "is-current" : ""}">${item.label}</a>`
          ).join("")}
        </nav>
        <a class="header-cta" href="contact.html">お問い合わせ</a>
        <button class="menu-btn" type="button" data-menu aria-label="メニュー">☰</button>
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
          <p>株式会社Tojo nexus</p>
          <p>〒651-0087 兵庫県神戸市中央区御幸通8丁目1-6<br>神戸国際会館 22F</p>
        </div>
        <div>
          <h3>Hours / Contact</h3>
          <p>月—金 9:00 — 18:00</p>
          <p><a href="mailto:tojo-h@tojo-nexus.com">tojo-h@tojo-nexus.com</a></p>
          <p><a href="tel:0785705766">078-570-5766</a></p>
        </div>
        <div>
          <h3>Hubs</h3>
          <p>Kobe, Japan</p>
          <p>Da Nang, Vietnam</p>
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
