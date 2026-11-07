/* ============================================================================
   ГАЛЕРЕЯ С ЛАЙТБОКСОМ (для страниц алимов)
   ----------------------------------------------------------------------------
   • Клик по миниатюре — открывает фото в полноэкранном лайтбоксе
   • Стрелки ← → или кнопки на экране — листают между фотографиями
   • Escape — закрывает
   ============================================================================ */

(function () {
  'use strict';

  /* ---------- 1. Находим элементы ---------- */
  const thumbs      = document.querySelectorAll('.gallery-thumb');
  const lightbox    = document.getElementById('lightbox');
  if (!lightbox || thumbs.length === 0) return;   // страница без галереи

  const stage       = document.getElementById('lightbox-stage');
  const btnPrev     = document.getElementById('lightbox-prev');
  const btnNext     = document.getElementById('lightbox-next');
  const btnClose    = document.getElementById('lightbox-close');
  const counter     = document.getElementById('lightbox-counter');

  /* ---------- 2. Собираем данные слайдов из data-атрибутов ----------
     Каждая миниатюра имеет:
       data-src    — путь к большому изображению (или пусто — тогда плейсхолдер)
       data-caption — подпись (необязательно)
     ------------------------------------------------------------------ */
  const slides = Array.from(thumbs).map(t => ({
    src: t.dataset.src || '',
    caption: t.dataset.caption || '',
  }));

  let currentIndex = 0;

  /* ---------- 3. Отрисовка слайда ---------- */

  /**
   * Показывает слайд с указанным индексом.
   * @param {number} index
   */
  function showSlide(index) {
    // Защита от выхода за границы (цикличная навигация)
    currentIndex = (index + slides.length) % slides.length;
    const slide = slides[currentIndex];

    // Очищаем сцену
    stage.innerHTML = '';

    if (slide.src) {
      // Реальное изображение
      const img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.caption || 'Фотография';
      stage.appendChild(img);
    } else {
      // Плейсхолдер, если фото ещё не добавлено
      const ph = document.createElement('div');
      ph.className = 'placeholder';
      ph.textContent = slide.caption || 'Фото будет добавлено';
      stage.appendChild(ph);
    }

    // Счётчик «1 / 5»
    counter.textContent = `${currentIndex + 1} / ${slides.length}`;
  }

  /* ---------- 4. Открытие / закрытие ---------- */

  function openLightbox(index) {
    showSlide(index);
    lightbox.classList.add('is-open');
    document.body.classList.add('menu-open');   // блокируем скролл
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  /* ---------- 5. Обработчики ---------- */

  // Клик по миниатюре — открываем по индексу
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => openLightbox(i));
  });

  // Кнопки навигации
  btnPrev.addEventListener('click', () => showSlide(currentIndex - 1));
  btnNext.addEventListener('click', () => showSlide(currentIndex + 1));
  btnClose.addEventListener('click', closeLightbox);

  // Клик по тёмному фону (но не по содержимому) — закрывает
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Клавиатура
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight')  showSlide(currentIndex + 1);
  });

  /* ---------- 6. Свайпы для мобильных ---------- */
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    // Свайп влево — следующий, свайп вправо — предыдущий
    if (Math.abs(diff) > 50) {
      if (diff < 0) showSlide(currentIndex + 1);
      else          showSlide(currentIndex - 1);
    }
  }, { passive: true });
})();