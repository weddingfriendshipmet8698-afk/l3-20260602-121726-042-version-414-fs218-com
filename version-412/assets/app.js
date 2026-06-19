(function () {
  var header = document.querySelector('[data-header]');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  function syncHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 18) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide-dot]'));
    var prev = carousel.querySelector('[data-prev]');
    var next = carousel.querySelector('[data-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('is-active', position === current);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('is-active', position === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  document.querySelectorAll('[data-search-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-search-input]');
    var year = scope.querySelector('[data-filter-year]');
    var type = scope.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var empty = scope.querySelector('[data-empty-state]');

    function includesValue(source, value) {
      return !value || String(source || '').indexOf(value) !== -1;
    }

    function applyFilters() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';
      var selectedType = type ? type.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matched = includesValue(text, query) && includesValue(cardYear, selectedYear) && includesValue(cardType, selectedType);
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [input, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  });
})();
