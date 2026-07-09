export async function onRequest(context) {

  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");

  let playerLogo = "";
  let playerLogoyer = "";
  let playerSite = "";
  let reklamVideo = "";
  let reklamSure = 0;
  let reklamDurum = 0;
  let playerPoster = "";

  try {
    const res2 = await fetch("https://origin.altinoksoft.com/api/verirepo.php");
    const json = await res2.json();

    if (json.playerlogo) {
      if (json.playerlogo.player_logo) {
        playerLogo = json.playerlogo.player_logo;
      }

      if (json.playerlogo.player_logoyer) {
        playerLogoyer = json.playerlogo.player_logoyer;
      }

      if (json.playerlogo.player_site) {
        playerSite = json.playerlogo.player_site;
      }

      if (json.playerlogo.player_reklamvideo) {
        reklamVideo = json.playerlogo.player_reklamvideo;
      }

      if (json.playerlogo.player_reklamsure) {
        reklamSure = parseInt(json.playerlogo.player_reklamsure) || 0;
      }

      reklamDurum = json.playerlogo.player_reklamdurum === "1" ? 1 : 0;

      if (json.playerlogo.player_arkaplan) {
        playerPoster = json.playerlogo.player_arkaplan;

        if (!/^https?:\/\//.test(playerPoster) && !playerPoster.startsWith("/")) {
          playerPoster = "/" + playerPoster;
        }
      }
    }

  } catch (e) {
    console.error("Veriler alınamadı:", e);
  }

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">

    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #000;
        overflow: hidden;
      }

      #player {
        width: 100%;
        height: 100vh;
        position: relative;
        background: #000;
      }

      /* YAYIN EKRANI KÜÇÜLMESİN */
      #player [data-player] {
        width: 100% !important;
        height: 100% !important;
      }

      #player [data-player] video {
        width: 100% !important;
        height: 100% !important;
        object-fit: fill;
      }

      /* ARKAPLAN: Clappr poster yerine kendi katmanımız */
      #custom-poster {
        position: absolute;
        inset: 0;
        z-index: 5;
        background-color: #000;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        pointer-events: none;
        display: none;
      }

      /* YÜKLENİYOR ... LOADER */
      #custom-loader {
        position: absolute;
        inset: 0;
        z-index: 9998;
        display: none;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        background: transparent;
      }

      #custom-loader .dots {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        padding: 12px 16px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.35);
      }

      #custom-loader .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #fff;
        opacity: 0.35;
        animation: loaderDot 1s infinite ease-in-out;
      }

      #custom-loader .dot:nth-child(2) {
        animation-delay: 0.15s;
      }

      #custom-loader .dot:nth-child(3) {
        animation-delay: 0.3s;
      }

      @keyframes loaderDot {
        0%, 80%, 100% {
          opacity: 0.35;
          transform: scale(0.85);
        }

        40% {
          opacity: 1;
          transform: scale(1.25);
        }
      }

      #ad-timer,
      #skip-btn {
        position: absolute;
        right: 10px;
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 9999;
      }

      #ad-timer {
        bottom: 40px;
      }

      #skip-btn {
        bottom: 10px;
        display: none;
        cursor: pointer;
        background: #d33;
      }

      /* Üstteki kırmızı çizgi/bar */
      #player [data-player] [data-border],
      #player [data-player] .player-border {
        display: none !important;
      }

      /* Sadece SEEK ilerleme çizgisini gizle — ses barına dokunma */
      #player [data-player] .media-control .bar-container[data-seekbar],
      #player [data-player] .media-control .bar-background[data-seekbar],
      #player [data-player] .media-control .bar-fill-1[data-seekbar],
      #player [data-player] .media-control .bar-fill-2[data-seekbar] {
        display: none !important;
      }

      /* Ses çizgisi görünür kalsın */
      #player [data-player] .media-control .bar-container[data-volume],
      #player [data-player] .drawer-container[data-volume],
      #player [data-player] .segmented-bar-element {
        display: block !important;
      }
    </style>

    <script src="https://cdn.jsdelivr.net/gh/clappr/clappr@latest/dist/clappr.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="/assets/js/clappr.js"></script>
  </head>

  <body>
    <div id="player">
      <div id="custom-poster"></div>

      <div id="custom-loader">
        <div class="dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>

      <div id="ad-timer" style="display: none;"></div>
      <div id="skip-btn" onclick="skipAd()">Reklamı Atla</div>
    </div>

    <script>
      const id = ${JSON.stringify(id)};
      const reklamVideo = ${JSON.stringify(reklamVideo)};
      const reklamSure = ${reklamSure};
      const reklamDurum = ${reklamDurum};
      const playerPoster = ${JSON.stringify(playerPoster)};

      const playerLogo = ${JSON.stringify(playerLogo)};
      const playerSite = ${JSON.stringify(playerSite)};
      const playerLogoyer = ${JSON.stringify(playerLogoyer)};

      let adPlayer = null;
      let mainPlayer = null;
      let countdown = null;
      let videoWatchInterval = null;

      function showLoader() {
        const loader = document.getElementById("custom-loader");
        if (loader) {
          loader.style.display = "flex";
        }
      }

      function hideLoader() {
        const loader = document.getElementById("custom-loader");
        if (loader) {
          loader.style.display = "none";
        }
      }

      function showPoster() {
        if (!playerPoster) return;

        const p = document.getElementById("custom-poster");
        p.style.backgroundImage = "url('" + playerPoster + "')";
        p.style.display = "block";
      }

      function hidePoster() {
        const p = document.getElementById("custom-poster");
        if (p) {
          p.style.display = "none";
        }
      }

      function attachVideoEvents() {
        setTimeout(function () {
          const videos = document.querySelectorAll("#player video");

          videos.forEach(function (video) {
            if (video.dataset.loaderAttached === "1") return;
            video.dataset.loaderAttached = "1";

            video.addEventListener("waiting", function () {
              if (!video.paused && !video.ended) {
                showLoader();
              }
            });

            video.addEventListener("stalled", function () {
              if (!video.paused && !video.ended) {
                showLoader();
              }
            });

            video.addEventListener("seeking", function () {
              showLoader();
            });

            video.addEventListener("playing", function () {
              hideLoader();
              hidePoster();
            });

            video.addEventListener("canplay", function () {
              hideLoader();
            });

            video.addEventListener("canplaythrough", function () {
              hideLoader();
            });

            video.addEventListener("pause", function () {
              hideLoader();
            });

            video.addEventListener("ended", function () {
              hideLoader();
            });

            video.addEventListener("error", function () {
              hideLoader();
            });
          });
        }, 300);
      }

      function startVideoWatch() {
        if (videoWatchInterval) {
          clearInterval(videoWatchInterval);
        }

        videoWatchInterval = setInterval(function () {
          const video = document.querySelector("#player video");

          if (!video) return;

          if (!video.paused && !video.ended && video.readyState < 3) {
            showLoader();
          }
        }, 700);
      }

      function bindLoaderEvents(player, isMainPlayer) {
        if (!player || !window.Clappr || !Clappr.Events) return;

        const showEvents = [
          Clappr.Events.PLAYER_BUFFERING,
          Clappr.Events.PLAYBACK_BUFFERING,
          Clappr.Events.PLAYBACK_STALL,
          Clappr.Events.PLAYBACK_STALLED
        ].filter(Boolean);

        const hideEvents = [
          Clappr.Events.PLAYER_PLAY,
          Clappr.Events.PLAYBACK_PLAY,
          Clappr.Events.PLAYBACK_PLAYING,
          Clappr.Events.PLAYBACK_BUFFERFULL
        ].filter(Boolean);

        showEvents.forEach(function (eventName) {
          player.on(eventName, function () {
            showLoader();
          });
        });

        hideEvents.forEach(function (eventName) {
          player.on(eventName, function () {
            hideLoader();

            if (isMainPlayer) {
              hidePoster();
            }
          });
        });

        player.on(Clappr.Events.PLAYER_READY, function () {
          attachVideoEvents();
          startVideoWatch();
        });

        player.on(Clappr.Events.PLAYER_ERROR, function () {
          hideLoader();
        });
      }

      function startMainPlayer(mainUrl) {
        mainUrl = mainUrl.replace(/edge4\\./g, "edge3.");

        showLoader();

        const options = {
          source: mainUrl,
          parentId: "#player",
          autoPlay: true,
          width: "100%",
          height: "100%",
          mimeType: "application/x-mpegURL"
        };

        if (playerLogo) {
          options.watermark = playerLogo;
        }

        if (playerSite) {
          options.watermarkLink = playerSite;
        }

        if (playerLogoyer) {
          options.position = playerLogoyer;
        }

        mainPlayer = new Clappr.Player(options);

        bindLoaderEvents(mainPlayer, true);

        mainPlayer.on(Clappr.Events.PLAYER_PLAY, function () {
          hidePoster();
          hideLoader();

          mainPlayer.resize({
            width: "100%",
            height: "100%"
          });
        });

        mainPlayer.on(Clappr.Events.PLAYER_READY, function () {
          attachVideoEvents();

          mainPlayer.resize({
            width: "100%",
            height: "100%"
          });
        });

        window.addEventListener("resize", function () {
          if (mainPlayer) {
            mainPlayer.resize({
              width: "100%",
              height: "100%"
            });
          }
        });
      }

      function skipAd() {
        if (adPlayer) {
          adPlayer.destroy();
        }

        adPlayer = null;

        clearInterval(countdown);

        document.getElementById("ad-timer").style.display = "none";
        document.getElementById("skip-btn").style.display = "none";

        showLoader();

        startMainPlayer(window.mainStreamUrl);
      }

      function startAdThenMain(mainUrl) {
        mainUrl = mainUrl.replace(/edge4\\./g, "edge3.");
        window.mainStreamUrl = mainUrl;

        if (reklamDurum === 1 && reklamVideo && reklamSure > 0) {
          hidePoster();
          showLoader();

          adPlayer = new Clappr.Player({
            source: reklamVideo,
            parentId: "#player",
            autoPlay: true,
            width: "100%",
            height: "100%"
          });

          bindLoaderEvents(adPlayer, false);

          const timerDiv = document.getElementById("ad-timer");
          const skipBtn = document.getElementById("skip-btn");

          let remaining = reklamSure;

          timerDiv.style.display = "block";
          timerDiv.innerText = "Reklamın bitmesine kalan süre: " + remaining + " saniye";

          countdown = setInterval(function () {
            remaining--;

            if (remaining <= 0) {
              clearInterval(countdown);

              if (adPlayer) {
                adPlayer.destroy();
              }

              adPlayer = null;

              timerDiv.style.display = "none";
              skipBtn.style.display = "none";

              showLoader();

              startMainPlayer(mainUrl);
            } else {
              timerDiv.innerText = "Reklamın bitmesine kalan süre: " + remaining + " saniye";

              if (remaining <= reklamSure - 5) {
                skipBtn.style.display = "block";
              }
            }
          }, 1000);

        } else {
          startMainPlayer(mainUrl);
        }
      }

      async function loadStream(id) {
        if (!id) {
          hideLoader();

          document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:20px'>ID eksik</h2>";
          return;
        }

        showPoster();
        showLoader();

        try {
          const [analyticsRes, cinemaRes] = await Promise.allSettled([
            fetch("https://teletv5.top/load/yayinlink.php?id=" + encodeURIComponent(id)),
            fetch("https://streamsport365.com/cinema", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
              },
              body: JSON.stringify({
                AppId: "5000",
                AppVer: "1",
                VpcVer: "1.0.12",
                Language: "en",
                Token: "",
                VideoId: id
              })
            })
          ]);

          let streamUrl = "";

          if (analyticsRes.status === "fulfilled") {
            const analyticsData = await analyticsRes.value.json();

            if (analyticsData.deismackanal && analyticsData.deismackanal.includes("m3u8")) {
              streamUrl = analyticsData.deismackanal;
            }
          }

          if (!streamUrl && cinemaRes.status === "fulfilled") {
            const cinemaData = await cinemaRes.value.json();

            if (cinemaData.URL) {
              streamUrl = cinemaData.URL;
            }
          }

          if (streamUrl) {
            startAdThenMain(streamUrl);
          } else {
            hideLoader();

            document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:20px'>Yayın bulunamadı</h2>";
          }

        } catch (err) {
          console.error("Yayın yüklenirken hata:", err);

          hideLoader();

          document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:20px'>Yayın hatası</h2>";
        }
      }

      document.addEventListener("DOMContentLoaded", function () {
        loadStream(id);
      });
    </script>
  </body>
</html>
`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8"
    }
  });
}
