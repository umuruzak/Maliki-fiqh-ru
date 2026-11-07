/* ============================================================================
   ГАМБУРГЕР-МЕНЮ
   Управляет открытием/закрытием мобильной навигации. На десктопе меню
   видно всегда — здесь логика не срабатывает (но и не мешает).
   ============================================================================ */

(function () {
  'use strict';   // строгий режим: ловит случайные ошибки

  // Находим элементы по id/классу.
  // Если какого-то нет (например, на странице без шапки) — код просто не выполнится.
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (!burger || !nav) return;  // защита от страниц без меню

  /**
   * Открывает или закрывает меню.
   * @param {boolean} [force] — если передано, принудительно ставит состояние.
   */
  function toggleMenu(force) {
    // Если force не передан — инвертируем текущее состояние
    const isOpen = force !== undefined
      ? force
      : !nav.classList.contains('is-open');

    nav.classList.toggle('is-open', isOpen);            // оверлей меню
    burger.classList.toggle('is-active', isOpen);        // анимация бургера → крестик
    document.body.classList.toggle('menu-open', isOpen); // блокируем скролл
    burger.setAttribute('aria-expanded', String(isOpen));// доступность
  }

  // Клик по бургеру
  burger.addEventListener('click', () => toggleMenu());

  // Клик по любой ссылке в меню — закрываем (важно для якорных переходов)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Нажатие Escape — тоже закрывает
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
})();