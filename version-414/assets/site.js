(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-site-nav]");

    if (menuButton && nav) {
        menuButton.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-hero-tab]"));
        var image = document.querySelector("[data-hero-image]");
        var title = document.querySelector("[data-hero-title]");
        var desc = document.querySelector("[data-hero-desc]");
        var link = document.querySelector("[data-hero-link]");
        var meta = document.querySelector("[data-hero-meta]");
        var index = 0;

        function render(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;
            var slide = slides[index];

            hero.style.setProperty("--hero-image", "url('" + slide.dataset.image + "')");

            if (image) {
                image.src = slide.dataset.image;
                image.alt = slide.dataset.title || "";
            }

            if (title) {
                title.textContent = slide.dataset.title || "";
            }

            if (desc) {
                desc.textContent = slide.dataset.desc || "";
            }

            if (link) {
                link.href = slide.dataset.link || "#";
            }

            if (meta) {
                meta.textContent = slide.dataset.meta || "";
            }

            tabs.forEach(function (tab, tabIndex) {
                tab.classList.toggle("active", tabIndex === index);
            });
        }

        tabs.forEach(function (tab, tabIndex) {
            tab.addEventListener("click", function () {
                render(tabIndex);
            });
        });

        render(0);

        window.setInterval(function () {
            render(index + 1);
        }, 5200);
    }

    function setupFilters() {
        var filterWraps = Array.prototype.slice.call(document.querySelectorAll("[data-filter-wrap]"));

        filterWraps.forEach(function (wrap) {
            var input = wrap.querySelector("[data-filter-input]");
            var chips = Array.prototype.slice.call(wrap.querySelectorAll("[data-filter-chip]"));
            var targetSelector = wrap.dataset.filterTarget || "[data-card]";
            var cards = Array.prototype.slice.call(document.querySelectorAll(targetSelector));
            var noResults = document.querySelector(wrap.dataset.noResults || "[data-no-results]");
            var activeChip = "";

            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }

            function apply() {
                var query = normalize(input ? input.value : "");
                var visibleCount = 0;

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.dataset.title,
                        card.dataset.type,
                        card.dataset.region,
                        card.dataset.category,
                        card.dataset.year,
                        card.dataset.keywords,
                        card.textContent
                    ].join(" "));

                    var chipOk = !activeChip || haystack.indexOf(normalize(activeChip)) !== -1;
                    var queryOk = !query || haystack.indexOf(query) !== -1;
                    var visible = chipOk && queryOk;

                    card.style.display = visible ? "" : "none";

                    if (visible) {
                        visibleCount += 1;
                    }
                });

                if (noResults) {
                    noResults.style.display = visibleCount ? "none" : "block";
                }
            }

            if (input) {
                input.addEventListener("input", apply);
            }

            chips.forEach(function (chip) {
                chip.addEventListener("click", function () {
                    var value = chip.dataset.filterChip || "";
                    activeChip = activeChip === value ? "" : value;

                    chips.forEach(function (item) {
                        item.classList.toggle("active", item === chip && activeChip);
                    });

                    apply();
                });
            });

            apply();
        });
    }

    function setupSearchRedirect() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));

        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();

                var input = form.querySelector("input");
                var query = input ? input.value.trim() : "";
                var action = form.getAttribute("action") || "./search.html";

                window.location.href = action + (query ? "?q=" + encodeURIComponent(query) : "");
            });
        });

        var searchInput = document.querySelector("[data-filter-input][data-read-query]");
        if (searchInput) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");

            if (q) {
                searchInput.value = q;
                searchInput.dispatchEvent(new Event("input"));
            }
        }
    }

    function setupPlayer() {
        var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-play-button]"));

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                var shell = button.closest("[data-player]");
                if (!shell) {
                    return;
                }

                var video = shell.querySelector("video");
                var overlay = shell.querySelector(".player-overlay");
                var source = shell.dataset.hls || "";

                if (!video || !source) {
                    return;
                }

                function playNow() {
                    video.play().catch(function () {
                        video.setAttribute("controls", "controls");
                    });
                }

                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, playNow);
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                    video.addEventListener("loadedmetadata", playNow, { once: true });
                } else {
                    video.src = source;
                    video.addEventListener("loadedmetadata", playNow, { once: true });
                }

                if (overlay) {
                    overlay.classList.add("is-hidden");
                }

                video.setAttribute("controls", "controls");
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupHero();
        setupFilters();
        setupSearchRedirect();
        setupPlayer();
    });
})();
