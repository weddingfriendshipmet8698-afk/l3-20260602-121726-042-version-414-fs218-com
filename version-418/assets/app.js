(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };

    var start = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        start();
      });
    });

    if (slides.length > 1) {
      start();
    }
  }

  var input = document.querySelector('[data-search-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  if (input && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (query) {
      input.value = query;
    }

    var filterCards = function () {
      var value = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.textContent
        ].join(' ').toLowerCase();
        card.style.display = !value || text.indexOf(value) !== -1 ? '' : 'none';
      });
    };

    input.addEventListener('input', filterCards);
    filterCards();
  }
})();
