(function () {
  'use strict';
  const audio = new Audio();
  audio.preload = 'metadata';

  const player        = document.getElementById('player');
  const playerTitle   = document.getElementById('player-title');
  const playerSub     = document.getElementById('player-subtitle');
  const playerBtn     = document.getElementById('player-toggle');
  const playerClose   = document.getElementById('player-close');
  const progressBar   = document.getElementById('player-progress');
  const progressFill  = document.getElementById('player-fill');
  const timeCurrent   = document.getElementById('player-time-current');
  const timeTotal     = document.getElementById('player-time-total');

  if (!player) return;
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  }
  function setPlayIcon(playing) {
    playerBtn.innerHTML = playing
      ? '<span class="icon-pause-css"></span>'
      : '<span class="icon-play-css"></span>';
    playerBtn.setAttribute('aria-label', playing ? 'Пауза' : 'Воспроизвести');
  }

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

  function playTrack(track) {
    audio.src = track.src;

    playerTitle.textContent = track.title || 'Без названия';
    playerSub.textContent = track.subtitle || '';

    player.classList.add('is-visible');
    document.body.classList.add('has-player');

    progressFill.style.width = '0%';
    progressFill.style.setProperty('--progress', '0%');
    timeCurrent.textContent = '0:00';
    timeTotal.textContent = '0:00';

    audio.play().catch(err => {
      console.warn('Автовоспроизведение отклонено:', err);
    });
  }
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

  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', updateProgress);

  audio.addEventListener('play',  () => setPlayIcon(true));
  audio.addEventListener('pause', () => setPlayIcon(false));
  audio.addEventListener('ended', () => setPlayIcon(false));


  playerBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  progressBar.addEventListener('click', e => {
    const rect = progressBar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;  // 0…1
    if (isFinite(audio.duration)) {
      audio.currentTime = ratio * audio.duration;
    }
  });

  playerClose.addEventListener('click', () => {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    player.classList.remove('is-visible');
    document.body.classList.remove('has-player');
  });

  window.MalikiPlayer = { playTrack };
})();