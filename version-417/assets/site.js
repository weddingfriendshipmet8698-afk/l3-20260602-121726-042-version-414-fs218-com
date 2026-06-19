(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navButton && mobileNav) {
    navButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    var showSlide = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  }

  var filterForm = document.querySelector('[data-filter-form]');
  var filterInput = document.querySelector('[data-filter-input]');
  var filterYear = document.querySelector('[data-filter-year]');
  var filterList = document.querySelector('[data-filter-list]');

  if (filterForm && filterInput && filterList) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('[data-card]'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery) {
      filterInput.value = initialQuery;
    }

    var runFilter = function () {
      var query = filterInput.value.trim().toLowerCase();
      var year = filterYear ? filterYear.value : '';

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.textContent
        ].join(' ').toLowerCase();
        var yearMatched = !year || card.getAttribute('data-year') === year;
        var queryMatched = !query || haystack.indexOf(query) !== -1;

        card.style.display = yearMatched && queryMatched ? '' : 'none';
      });
    };

    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      runFilter();
    });

    filterInput.addEventListener('input', runFilter);

    if (filterYear) {
      filterYear.addEventListener('change', runFilter);
    }

    runFilter();
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var button = player.querySelector('[data-play-button]');
    var video = player.querySelector('video');
    var sourceUrl = player.getAttribute('data-src');
    var hlsInstance = null;
    var loaded = false;

    var playVideo = function () {
      if (!video || !sourceUrl) {
        return;
      }

      if (!loaded) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls();
          hlsInstance.loadSource(sourceUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = sourceUrl;
        }

        loaded = true;
      }

      if (button) {
        button.classList.add('is-hidden');
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (button) {
            button.classList.remove('is-hidden');
          }
        });
      }
    };

    if (button) {
      button.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!loaded) {
          playVideo();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
