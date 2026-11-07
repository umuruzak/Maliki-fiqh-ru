/* ============================================================================
   АУДИОПЛЕЕР (НИЖНЯЯ ПАНЕЛЬ)
   ----------------------------------------------------------------------------
   Задача: при клике на кнопку «Слушать» у любой аудиозаписи открывается
   фиксированная панель внизу, где можно:
     • воспроизвести / поставить на паузу
     • перемотать кликом по полосе прогресса
     • видеть текущее и общее время
     • закрыть плеер

   Мы используем единственный <audio> и подменяем в нём src.
   Это позволяет иметь один плеер на всей странице.
   ============================================================================ */

(function () {
  'use strict';

  /* ---------- 1. Создаём audio-элемент один раз ---------- */
  const audio = new Audio();
  audio.preload = 'metadata';   // подгружаем только метаданные, пока не нажали play

  /* ---------- 2. Кэшируем DOM-элементы плеера ---------- */
  const player        = document.getElementById('player');
  const playerTitle   = document.getElementById('player-title');
  const playerSub     = document.getElementById('player-subtitle');
  const playerBtn     = document.getElementById('player-toggle');
  const playerClose   = document.getElementById('player-close');
  const progressBar   = document.getElementById('player-progress');
  const progressFill  = document.getElementById('player-fill');
  const timeCurrent   = document.getElementById('player-time-current');
  const timeTotal     = document.getElementById('player-time-total');

  // Если плеера нет на странице — скрипт не нужен
  if (!player) return;

  /* ---------- 3. Утилиты ---------- */

  /**
   * Форматирует секунды в MM:SS или H:MM:SS.
   * @param {number} sec
   * @returns {string}
   */
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  /**
   * Меняет иконку кнопки play/pause внутри кнопки.
   * @param {boolean} playing
   */
  function setPlayIcon(playing) {
    playerBtn.innerHTML = playing
      ? '<span class="icon-pause-css"></span>'
      : '<span class="icon-play-css"></span>';
    playerBtn.setAttribute('aria-label', playing ? 'Пауза' : 'Воспроизвести');
  }

  /**
   * Обновляет положение полосы прогресса (в процентах).
   */
  function updateProgress() {
    const duration = audio.duration;
    const current = audio.currentTime;
    if (!isFinite(duration) || duration === 0) {
      progressFill.style.width = '0%';
      progressFill.style.setProperty('--progress', '0%');
      return;
    }
    const percent = (current / duration) * 100;
    progressFill.style.width = percent + '%';
    progressFill.style.setProperty('--progress', percent + '%');
    timeCurrent.textContent = formatTime(current);
  }

  /* ---------- 4. Публичный API для кнопок «Слушать» на карточках ---------- */

  /**
   * Запускает воспроизведение указанного трека.
   * @param {Object} track — { src, title, subtitle }
   */
  function playTrack(track) {
    // Устанавливаем источник
    audio.src = track.src;

    // Заполняем панель
    playerTitle.textContent = track.title || 'Без названия';
    playerSub.textContent = track.subtitle || '';

    // Показываем плеер и сдвигаем контент
    player.classList.add('is-visible');
    document.body.classList.add('has-player');

    // Сбрасываем прогресс и время
    progressFill.style.width = '0%';
    progressFill.style.setProperty('--progress', '0%');
    timeCurrent.textContent = '0:00';
    timeTotal.textContent = '0:00';

    // Запускаем
    audio.play().catch(err => {
      // Автовоспроизведение может быть заблокировано браузером —
      // это нормально, пользователь нажмёт play в панели.
      console.warn('Автовоспроизведение отклонено:', err);
    });
  }

  /* ---------- 5. Привязываем кнопки «Слушать» на всей странице ---------- */

  /**
   * Все элементы с классом .js-play содержат data-атрибуты:
   *   data-src   — ссылка на mp3
   *   data-title — название трека
   *   data-sub   — подзаголовок (например, автор/чтец)
   */
  document.querySelectorAll('.js-play').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      playTrack({
        src: btn.dataset.src,
        title: btn.dataset.title,
        subtitle: btn.dataset.sub,
      });
    });
  });

  /* ---------- 6. Обработчики событий audio ---------- */

  // Метаданные загружены — можно показать длительность
  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatTime(audio.duration);
  });

  // Обновление времени каждые ~250 мс
  audio.addEventListener('timeupdate', updateProgress);

  // Play/pause синхронизируют иконку
  audio.addEventListener('play',  () => setPlayIcon(true));
  audio.addEventListener('pause', () => setPlayIcon(false));
  audio.addEventListener('ended', () => setPlayIcon(false));

  /* ---------- 7. Кнопка play/pause в панели ---------- */

  playerBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  /* ---------- 8. Перемотка кликом по полосе ---------- */

  progressBar.addEventListener('click', e => {
    const rect = progressBar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;  // 0…1
    if (isFinite(audio.duration)) {
      audio.currentTime = ratio * audio.duration;
    }
  });

  /* ---------- 9. Закрытие плеера ---------- */

  playerClose.addEventListener('click', () => {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();          // освобождает ресурсы
    player.classList.remove('is-visible');
    document.body.classList.remove('has-player');
  });

  /* ---------- 10. Экспорт в window (для отладки) ---------- */
  window.MalikiPlayer = { playTrack };
})();