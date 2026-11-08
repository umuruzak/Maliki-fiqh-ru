(function () {
  'use strict';

  const thumbs      = document.querySelectorAll('.gallery-thumb');
  const lightbox    = document.getElementById('lightbox');
  if (!lightbox || thumbs.length === 0) return;

  const stage       = document.getElementById('lightbox-stage');
  const btnPrev     = document.getElementById('lightbox-prev');
  const btnNext     = document.getElementById('lightbox-next');
  const btnClose    = document.getElementById('lightbox-close');
  const counter     = document.getElementById('lightbox-counter');
  const slides = Array.from(thumbs).map(t => ({
    src: t.dataset.src || '',
    caption: t.dataset.caption || '',
  }));

  let currentIndex = 0;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    const slide = slides[currentIndex];

    stage.innerHTML = '';

    if (slide.src) {
      const img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.caption || 'Фотография';
      stage.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'placeholder';
      ph.textContent = slide.caption || 'Фото будет добавлено';
      stage.appendChild(ph);
    }
    counter.textContent = `${currentIndex + 1} / ${slides.length}`;
  }

  function openLightbox(index) {
    showSlide(index);
    lightbox.classList.add('is-open');
    document.body.classList.add('menu-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => openLightbox(i));
  });

  btnPrev.addEventListener('click', () => showSlide(currentIndex - 1));
  btnNext.addEventListener('click', () => showSlide(currentIndex + 1));
  btnClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight')  showSlide(currentIndex + 1);
  });

  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) showSlide(currentIndex + 1);
      else          showSlide(currentIndex - 1);
    }
  }, { passive: true });
})();