// YouTube Radio Controller and Play/Pause Component
const VIDEO_ID = '4xDzrJKXOOY';
const DEFAULT_TRACK_TITLE = 'lofi hip hop radio 🎧 beats to relax/study to';

let ytPlayer = null;
let isPlayerReady = false;
let isPlaying = false;
let isInitializing = false;
let playPending = false;
let currentTrackTitle = DEFAULT_TRACK_TITLE;

// Ensure hidden container for YouTube player exists in the document
function ensureContainer() {
  let container = document.getElementById('yt-radio-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'yt-radio-container';
    container.style.cssText = 'position:fixed;bottom:-100px;right:-100px;width:10px;height:10px;opacity:0.001;pointer-events:none;z-index:-999;overflow:hidden;';
    const playerDiv = document.createElement('div');
    playerDiv.id = 'yt-radio-player';
    container.appendChild(playerDiv);
    document.body.appendChild(container);
  }
  return container;
}

// Load YouTube IFrame API script dynamically if needed
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) {
    initPlayer();
    return;
  }

  if (document.getElementById('yt-iframe-api-script')) return;

  const tag = document.createElement('script');
  tag.id = 'yt-iframe-api-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  const prevOnReady = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = function() {
    if (typeof prevOnReady === 'function') {
      try { prevOnReady(); } catch (e) {}
    }
    initPlayer();
  };
}

function updateTrackInfo() {
  if (ytPlayer && typeof ytPlayer.getVideoData === 'function') {
    try {
      const data = ytPlayer.getVideoData();
      if (data && data.title) {
        currentTrackTitle = data.title;
      }
    } catch (e) {}
  }
}

function initPlayer() {
  if (ytPlayer || isPlayerReady || isInitializing) return;
  isInitializing = true;
  ensureContainer();

  try {
    ytPlayer = new window.YT.Player('yt-radio-player', {
      height: '100',
      width: '100',
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event) => {
          isPlayerReady = true;
          isInitializing = false;
          updateTrackInfo();
          if (playPending) {
            playPending = false;
            play();
          }
        },
        onStateChange: (event) => {
          updateTrackInfo();
          if (event.data === window.YT.PlayerState.PLAYING) {
            setPlaying(true);
          } else if (
            event.data === window.YT.PlayerState.PAUSED ||
            event.data === window.YT.PlayerState.ENDED ||
            event.data === window.YT.PlayerState.CUED
          ) {
            setPlaying(false);
          }
        },
        onError: (err) => {
          console.warn('[YouTube Radio] Player error:', err);
          setPlaying(false);
          isInitializing = false;
        }
      }
    });
  } catch (err) {
    console.error('[YouTube Radio] Failed to create player:', err);
    isInitializing = false;
  }
}

function setPlaying(playing) {
  isPlaying = playing;
  updateTrackInfo();
  updateButtons();
  window.dispatchEvent(new CustomEvent('radio-state-changed', { detail: { isPlaying, track: currentTrackTitle } }));
}

export function play() {
  if (!isPlayerReady) {
    playPending = true;
    loadYouTubeApi();
    return;
  }
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.playVideo();
    setPlaying(true);
  }
}

export function pause() {
  playPending = false;
  if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
    ytPlayer.pauseVideo();
    setPlaying(false);
  }
}

export function toggle() {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

export function getIsPlaying() {
  return isPlaying;
}

export function updateButtons() {
  const buttons = document.querySelectorAll('.radio-toggle-btn');
  buttons.forEach((btn) => {
    btn.classList.toggle('is-playing', isPlaying);
    const icon = btn.querySelector('.radio-icon i');
    const tooltip = isPlaying ? 'Пауза (Радио)' : 'Пусни радио (YouTube)';
    btn.setAttribute('title', tooltip);
    btn.setAttribute('aria-label', tooltip);
    if (icon) {
      if (isPlaying) {
        icon.className = 'fa-solid fa-pause';
      } else {
        icon.className = 'fa-solid fa-play';
      }
    }

    const marquee = btn.querySelector('.radio-marquee-container');
    if (marquee) {
      if (isPlaying) {
        const text = currentTrackTitle || DEFAULT_TRACK_TITLE;
        marquee.innerHTML = `
          <div class="radio-ticker-track">
            <span class="radio-ticker-item">${text} &nbsp;•&nbsp; </span>
            <span class="radio-ticker-item">${text} &nbsp;•&nbsp; </span>
          </div>
        `;
      } else {
        marquee.innerHTML = '';
      }
    }
  });
}

export function renderRadioControl() {
  const playing = isPlaying;
  const text = currentTrackTitle || DEFAULT_TRACK_TITLE;

  return `
    <div class="header-radio-space">
      <button type="button" class="radio-toggle-btn ${playing ? 'is-playing' : ''}" id="radio-toggle-btn" title="${playing ? 'Пауза (Радио)' : 'Пусни радио (YouTube)'}" aria-label="${playing ? 'Пауза (Радио)' : 'Пусни радио (YouTube)'}">
        <span class="radio-icon">
          <i class="${playing ? 'fa-solid fa-pause' : 'fa-solid fa-play'}"></i>
        </span>
        <span class="radio-label-group">
          <span class="radio-marquee-container">
            ${playing 
              ? `<div class="radio-ticker-track">
                  <span class="radio-ticker-item">${text} &nbsp;•&nbsp; </span>
                  <span class="radio-ticker-item">${text} &nbsp;•&nbsp; </span>
                </div>`
              : ''
            }
          </span>
          <span class="radio-eq" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </span>
        </span>
      </button>
    </div>
  `;
}

export function initRadioControl() {
  const btn = document.getElementById('radio-toggle-btn');
  if (btn) {
    btn.onclick = (e) => {
      e.preventDefault();
      toggle();
    };
  }
  updateButtons();
}

