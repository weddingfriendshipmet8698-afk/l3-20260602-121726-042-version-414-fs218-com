(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupNavigation() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-site-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                restart();
            });
        });
        show(0);
        restart();
    }

    function textContains(card, keyword) {
        if (!keyword) {
            return true;
        }
        var combined = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.genre,
            card.dataset.tags,
            card.textContent
        ].join(" ").toLowerCase();
        return combined.indexOf(keyword.toLowerCase()) !== -1;
    }

    function setupFilters() {
        var container = document.querySelector("[data-filterable]");
        if (!container) {
            return;
        }
        var input = document.querySelector("[data-search-input]");
        var yearSelect = document.querySelector("[data-year-filter]");
        var typeSelect = document.querySelector("[data-type-filter]");
        var cards = Array.prototype.slice.call(container.querySelectorAll("[data-movie-card]"));
        var status = document.querySelector("[data-filter-status]");
        var empty = document.querySelector("[data-empty-result]");
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q");
        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function apply() {
            var keyword = input ? input.value.trim() : "";
            var year = yearSelect ? yearSelect.value : "";
            var type = typeSelect ? typeSelect.value : "";
            var shown = 0;
            cards.forEach(function (card) {
                var match = textContains(card, keyword);
                if (year && card.dataset.year !== year) {
                    match = false;
                }
                if (type && card.dataset.type !== type) {
                    match = false;
                }
                card.style.display = match ? "" : "none";
                if (match) {
                    shown += 1;
                }
            });
            if (status) {
                status.textContent = "当前显示 " + shown + " 部影片";
            }
            if (empty) {
                empty.classList.toggle("show", shown === 0);
            }
        }

        [input, yearSelect, typeSelect].forEach(function (element) {
            if (element) {
                element.addEventListener("input", apply);
                element.addEventListener("change", apply);
            }
        });
        apply();
    }

    window.initMoviePlayer = function (videoId, overlayId, source) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var hlsInstance = null;
        if (!video || !source) {
            return;
        }

        function bindSource() {
            if (video.dataset.bound === "1") {
                return;
            }
            video.dataset.bound = "1";
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function startPlayback() {
            bindSource();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }
        video.addEventListener("click", function () {
            if (!video.dataset.bound) {
                startPlayback();
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    };

    ready(function () {
        setupNavigation();
        setupHero();
        setupFilters();
    });
})();
