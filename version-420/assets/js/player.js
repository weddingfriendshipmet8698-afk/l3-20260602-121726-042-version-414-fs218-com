(function () {
    window.startMoviePlayer = function (streamUrl) {
        var video = document.getElementById("movie-player");
        var trigger = document.querySelector("[data-play-trigger]");
        var loaded = false;
        var hls = null;

        function attach() {
            if (!video || loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function play() {
            attach();
            if (trigger) {
                trigger.classList.add("is-hidden");
            }
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        if (trigger) {
            trigger.addEventListener("click", play);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (!loaded || video.paused) {
                    play();
                }
            });
            video.addEventListener("play", function () {
                if (trigger) {
                    trigger.classList.add("is-hidden");
                }
            });
        }

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
