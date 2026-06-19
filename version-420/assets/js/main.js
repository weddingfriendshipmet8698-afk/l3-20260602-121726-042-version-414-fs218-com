(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
                document.body.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var active = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(active + 1);
            }, 5000);
        }

        var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
        var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
        var currentFilter = "all";

        function cardText(card) {
            return [
                card.getAttribute("data-title"),
                card.getAttribute("data-category"),
                card.getAttribute("data-region"),
                card.getAttribute("data-year"),
                card.getAttribute("data-tags")
            ].join(" ").toLowerCase();
        }

        function applyFilters() {
            var term = searchInputs.map(function (input) {
                return input.value.trim().toLowerCase();
            }).filter(Boolean).join(" ");
            var areas = Array.prototype.slice.call(document.querySelectorAll("[data-search-area]"));
            var visibleTotal = 0;

            areas.forEach(function (area) {
                var cards = Array.prototype.slice.call(area.querySelectorAll("[data-card]"));
                cards.forEach(function (card) {
                    var matchesTerm = !term || cardText(card).indexOf(term) !== -1;
                    var category = card.getAttribute("data-category") || "";
                    var region = card.getAttribute("data-region") || "";
                    var matchesFilter = currentFilter === "all" || category === currentFilter || region === currentFilter || (card.getAttribute("data-title") || "").indexOf(currentFilter) !== -1;
                    var visible = matchesTerm && matchesFilter;
                    card.hidden = !visible;
                    if (visible) {
                        visibleTotal += 1;
                    }
                });
            });

            var empty = document.querySelector("[data-empty-result]");
            if (empty) {
                empty.hidden = visibleTotal !== 0;
            }
        }

        searchInputs.forEach(function (input) {
            input.addEventListener("input", applyFilters);
        });

        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                currentFilter = button.getAttribute("data-filter") || "all";
                filterButtons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                applyFilters();
            });
        });
    });
})();
