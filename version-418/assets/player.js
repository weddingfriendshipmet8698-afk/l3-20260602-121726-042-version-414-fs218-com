(function () {
  var video = document.getElementById('movie-player');
  var button = document.querySelector('[data-player-button]');
  var card = document.querySelector('.player-card');
  if (!video) {
    return;
  }

  var started = false;
  var hlsInstance = null;

  var playVideo = function () {
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  };

  var startPlayer = function () {
    if (started) {
      playVideo();
      return;
    }
    started = true;
    if (card) {
      card.classList.add('is-playing');
    }
    var source = video.getAttribute('data-src');
    if (!source) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      playVideo();
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        playVideo();
      });
      return;
    }
    video.src = source;
    playVideo();
  };

  if (button) {
    button.addEventListener('click', startPlayer);
  }
  video.addEventListener('click', startPlayer);
  video.addEventListener('play', function () {
    if (card) {
      card.classList.add('is-playing');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
