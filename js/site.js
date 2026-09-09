const NAV = [
  { href: "company.html", label: "COMPANY" },
  { href: "mission.html", label: "MISSION" },
  { href: "service.html", label: "SERVICE" },
  { href: "bim.html", label: "BIM" },
  { href: "career.html", label: "CAREER" },
  { href: "contact.html", label: "CONTACT" },
];

const LOGO =
  "images/logo.png";

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
          <img src="${LOGO}" alt="Tojo nexus" width="944" height="1088">
          <span class="brand-text">
            <strong>Tojo nexus</strong>
            <span>Construction BIM</span>
          </span>
        </a>
        <nav class="nav" id="main-navigation" data-nav aria-label="Main / メイン">
          ${NAV.map(
            (item) =>
              `<a href="${item.href}" class="${file === item.href ? "is-current" : ""}"${file === item.href ? ' aria-current="page"' : ''}>${item.label}</a>`
          ).join("")}
        </nav>
        <div class="header-actions">
          <span class="lang-mark" aria-hidden="true">JA · EN</span>
          <a class="header-cta" href="contact.html">お問い合わせ<small lang="en">Contact</small></a>
          <button class="menu-btn" type="button" data-menu aria-label="メニューを開く" aria-expanded="false" aria-controls="main-navigation">☰</button>
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
          <img class="line-qr" src="images/line-qr.png" alt="LINE QR code / 公式LINE" width="317" height="317" loading="lazy">
        </div>
        <div>
          <h3>Hubs</h3>
          <p>Kobe, Japan</p>
          <p>Da Nang, Vietnam<br>3F, Indochina Riverside Office Tower<br>74 Bạch Đằng, Hải Châu<br>Đà Nẵng 550000</p>
        </div>
      </div>
      <nav class="wrap footer-links" aria-label="ページと施工BIMの活用ガイド">
        <a href="service.html">施工BIMの外注・制作支援</a>
        <a href="bim.html">施工BIMとは</a>
        <a href="bim-clash-detection.html">干渉チェックの進め方</a>
        <a href="bim-meeting-documents.html">打ち合わせ資料のつくり方</a>
        <a href="company.html">会社概要</a>
        <a href="contact.html">相談・見積依頼</a>
      </nav>
      <div class="wrap copyright">© ${new Date().getFullYear()} Tojo nexus Co., Ltd.</div>
    </footer>
  `;
}

/* Runtime navigation */
// Published HTML already contains the shared layout. Keep a fallback for older pages.
if (!document.querySelector("[data-header]")) document.body.insertAdjacentHTML("afterbegin", headerHTML());
if (!document.querySelector(".footer")) document.body.insertAdjacentHTML("beforeend", footerHTML());

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menu = document.querySelector("[data-menu]");

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
});

function closeMenu() { nav.classList.remove("is-open"); menu.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-label", "メニューを開く"); }
menu?.addEventListener("click", () => { const opened = nav.classList.toggle("is-open"); menu.setAttribute("aria-expanded", String(opened)); menu.setAttribute("aria-label", opened ? "メニューを閉じる" : "メニューを開く"); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && nav.classList.contains("is-open")) { closeMenu(); menu.focus(); } });
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
matchMedia("(min-width: 901px)").addEventListener("change", (event) => { if (event.matches) closeMenu(); });
