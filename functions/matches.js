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
        overflow: hidden;
      }

      /*
        Sadece ana player/video alanını büyütüyoruz.
        media-control alanına dokunmuyoruz.
        Çünkü ses, canlı yazısı ve kontrol barını yukarı kaydıran şey oydu.
      */
      #player [data-player],
      #player [data-player] .container,
      #player [data-player] .playback,
      #player [data-player] .playback-wrapper {
        width: 100% !important;
        height: 100% !important;
      }

      /*
        Siyah boşluğu azaltan kısım.
        Sadece video için cover kullanıyoruz.
      */
      #player video,
      #player [data-player] video {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        background: #000 !important;
      }

      /*
        Player arkaplanı bozulmasın diye contain.
        cover yaparsak görsel kırpılır veya bozuk görünür.
      */
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

      /*
        Kontrol barı normal yerinde kalsın.
        Önceki kodda bunlara height:100% verdiğimiz için yukarı çıkmıştı.
      */
      #player [data-player] .media-control {
        width: 100% !important;
        height: auto !important;
        bottom: 0 !important;
        top: auto !important;
      }

      #player [data-player] .media-control-layer {
        height: auto !important;
      }

      /*
        Üstteki kırmızı çizgi/bar gizleme
      */
      #player [data-player] [data-border],
      #player [data-player] .player-border {
        display: none !important;
      }

      /*
        Sadece seek/progress çizgisini gizle.
        Ses barına dokunmuyoruz.
      */
      #player [data-player] .media-control .bar-container[data-seekbar],
      #player [data-player] .media-control .bar-background[data-seekbar],
      #player [data-player] .media-control .bar-fill-1[data-seekbar],
      #player [data-player] .media-control .bar-fill-2[data-seekbar] {
        display: none !important;
      }

      /*
        Ses çizgisi garanti görünür kalsın.
      */
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
      <div id="ad-timer" style="display: none;"></div>
      <div id="skip-btn" onclick="skipAd()">Reklamı Atla</div>
    </div>

    <script>
      const id = "${id}";
      const reklamVideo = "${reklamVideo}";
      const reklamSure = ${reklamSure};
      const reklamDurum = ${reklamDurum};
      const playerPoster = "${playerPoster}";

      let adPlayer = null;
      let mainPlayer = null;
      let countdown = null;

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

      function resizePlayer(player) {
        if (!player) return;

        try {
          player.resize({
            width: "100%",
            height: "100%"
          });
        } catch (e) {}
      }

      function startMainPlayer(mainUrl) {
        mainUrl = mainUrl.replace(/edge4\\./g, "edge3.");

        const options = {
          source: mainUrl,
          parentId: "#player",
          autoPlay: true,
          width: "100%",
          height: "100%",
          mimeType: "application/x-mpegURL"
        };

        ${playerLogo ? `options.watermark = "${playerLogo}";` : ""}
        ${playerSite ? `options.watermarkLink = "${playerSite}";` : ""}
        ${playerLogoyer ? `options.position = "${playerLogoyer}";` : ""}

        mainPlayer = new Clappr.Player(options);

        mainPlayer.on(Clappr.Events.PLAYER_READY, function () {
          resizePlayer(mainPlayer);
        });

        mainPlayer.on(Clappr.Events.PLAYER_PLAY, function () {
          hidePoster();
          resizePlayer(mainPlayer);
        });

        window.addEventListener("resize", function () {
          resizePlayer(mainPlayer);
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

        startMainPlayer(window.mainStreamUrl);
      }

      function startAdThenMain(mainUrl) {
        mainUrl = mainUrl.replace(/edge4\\./g, "edge3.");
        window.mainStreamUrl = mainUrl;

        if (reklamDurum === 1 && reklamVideo && reklamSure > 0) {
          hidePoster();

          adPlayer = new Clappr.Player({
            source: reklamVideo,
            parentId: "#player",
            autoPlay: true,
            width: "100%",
            height: "100%"
          });

          resizePlayer(adPlayer);

          const timerDiv = document.getElementById("ad-timer");
          const skipBtn = document.getElementById("skip-btn");

          let remaining = reklamSure;

          timerDiv.style.display = "block";
          timerDiv.innerText = "Reklamın bitmesine kalan süre: " + remaining + " saniye";

          countdown = setInterval(() => {
            remaining--;

            if (remaining <= 0) {
              clearInterval(countdown);

              if (adPlayer) {
                adPlayer.destroy();
              }

              adPlayer = null;

              timerDiv.style.display = "none";
              skipBtn.style.display = "none";

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
          document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:20px'>ID eksik</h2>";
          return;
        }

        showPoster();

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
            document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:20px'>Yayın bulunamadı</h2>";
          }
        } catch (err) {
          console.error("Yayın yüklenirken hata:", err);
          document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:20px'>Yayın hatası</h2>";
        }
      }

      document.addEventListener("DOMContentLoaded", () => {
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
