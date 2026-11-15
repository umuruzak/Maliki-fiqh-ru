// js/layout.js
(function() {
  const headerHTML = `
    <div class="nav-wrap">
      <a href="index.html" class="logo">
        <div class="logo-mark">
          <span></span><span></span>
          <span></span><span></span>
        </div>
        <span class="logo-text">Маликитский<br>Мазхаб</span>
      </a>

      <button class="burger" id="burger" aria-label="Открыть меню" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>

      <nav id="nav">
        <ul>
          <li><a href="books.html">Библиотека</a></li>
          <li><a href="lectures.html">Аудиолекции</a></li>
          <li><a href="recitations.html">Афро-Коранистика</a></li>
          <li><a href="links.html">Полезные ссылки</a></li>
          <li><a href="scholars.html">Алимы</a></li>
        </ul>
      </nav>
    </div>
  `;
  const footerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">
          <div class="logo-mark">
            <span></span><span></span>
            <span></span><span></span>
          </div>
          <span class="logo-text">Маликитский<br>Мазхаб</span>
        </div>
        <p>Пространство для изучения маликитской правовой школы.</p>
      </div>
      <div>
        <h4>Связаться</h4>
        <ul>
          <li><a href="#">Telegram</a></li>
          <li><a href="#">Email</a></li>
        </ul>
      </div>
    </div>
  `;

  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;
})();