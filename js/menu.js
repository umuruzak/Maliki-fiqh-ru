(function () {
  'use strict';
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (!burger || !nav) return;

  function toggleMenu(force) {
    const isOpen = force !== undefined
      ? force
      : !nav.classList.contains('is-open');

    nav.classList.toggle('is-open', isOpen);
    burger.classList.toggle('is-active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  }

  burger.addEventListener('click', () => toggleMenu());

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
})();