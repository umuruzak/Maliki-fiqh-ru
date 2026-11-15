// js/layout.js
(function() {

  let currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const PAGE_TO_SECTION = {
    'books.html':          'books.html',
    'lectures.html':       'lectures.html',
    'lecture-questions.html': 'lectures.html',
    'recitations.html':    'recitations.html',
    'reciter-1.html':      'recitations.html',
    'links.html':          'links.html',
    'albums.html':       'albums.html',
    'album-1.html':      'albums.html',
    'album-2.html':      'albums.html',
    'album-3.html':      'albums.html',
  };

  const activeSection = PAGE_TO_SECTION[currentPage] || '';

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
          <li><a href="books.html">Переводы</a></li>
          <li><a href="lectures.html">Аудиолекции</a></li>
          <li><a href="recitations.html">Афро-Коранистика</a></li>
          <li><a href="links.html">Полезные ссылки</a></li>
          <li><a href="albums.html">Галерея</a></li>
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
        <h4>Контакты</h4>
        <ul>
          <li>
          <span style="white-space: nowrap;">Email: <a href="mailto:ru.maliki.fiqh@gmail.com?">ru.maliki.fiqh@gmail.com</a></span>
          </li>
        </ul>
      </div>
    </div>
  `;

  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;

  if (activeSection) {
    const activeLink = headerEl?.querySelector(`#nav a[href="${activeSection}"]`);
    if (activeLink) activeLink.classList.add('active');
  }
})();