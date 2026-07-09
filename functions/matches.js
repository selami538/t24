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
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; }
      #player { width: 100%; height: 100vh; position: relative; }

      /* YAYIN EKRANI KÜÇÜLMESİN: Clappr player ve video her zaman tam boy */
      #player [data-player] {
        width: 100% !important;
        height: 100% !important;
      }
      #player [data-player] video {
        width: 100% !important;
        height: 100% !important;
        object-fit: fill; /* Görüntüyü kesmez ve siyah boşluk bırakmaz (görüntüyü alana göre esnetir) */
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

      /* ORTADAKİ PLAY BUTONU (sadece mobilde gösterilir) */
      #play-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
        background: rgba(0,0,0,0.3);
      }
      #play-overlay .play-btn {
        width: 70px;
        height: 70px;
        background: rgba(0,0,0,0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid rgba(255,255,255,0.8);
        transition: transform 0.2s;
      }
      #play-overlay:active .play-btn,
      #play-overlay:hover .play-btn { transform: scale(1.1); }
      #play-overlay .play-btn svg {
        width: 30px;
        height: 30px;
        fill: #fff;
        margin-left: 5px;
      }

      /* TAM EKRAN BUTONU */
      #fs-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: rgba(0,0,0,0.6);
        border: 1px solid rgba(255,255,255,0.4);
        border-radius: 6px;
        width: 40px;
        height: 40px;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      #fs-btn svg { width: 22px; height: 22px; fill: #fff; }

      /* YÜKLENİYOR: Clappr'ın orijinal spinner-three-bounce animasyonunun aynısı */
      #loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        display: none;
        pointer-events: none;
        text-align: center;
      }
      #loading-spinner > div {
        display: inline-block;
        width: 18px;
        height: 18px;
        background-color: #FFFFFF;
        border-radius: 100%;
        -webkit-animation: loading-bouncedelay 1.4s infinite ease-in-out both;
        animation: loading-bouncedelay 1.4s infinite ease-in-out both;
      }
      #loading-spinner .bounce1 {
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
      }
      #loading-spinner .bounce2 {
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
      }
      @-webkit-keyframes loading-bouncedelay {
        0%, 80%, 100% { -webkit-transform: scale(0); }
        40% { -webkit-transform: scale(1); }
      }
      @keyframes loading-bouncedelay {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }

      #ad-timer, #skip-btn {
        position: absolute;
        right: 10px;
        background: rgba(0,0,0,0.75);
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 9999;
      }

      #ad-timer { bottom: 40px; }

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

      /* Sadece SEEK (ilerleme) çizgisini gizle — ses barına dokunma */
      #player [data-player] .media-control .bar-container[data-seekbar],
      #player [data-player] .media-control .bar-background[data-seekbar],
      #player [data-player] .media-control .bar-fill-1[data-seekbar],
      #player [data-player] .media-control .bar-fill-2[data-seekbar] {
        display: none !important;
      }

      /* Ses çizgisi görünür kalsın (garanti olsun diye geri açıyoruz) */
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
      <div id="play-overlay">
        <div class="play-btn">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div id="loading-spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
      <div id="ad-timer" style="display: none;"></div>
      <div id="skip-btn" onclick="skipAd()">Reklamı Atla</div>
      <div id="fs-btn">
        <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
      </div>
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

      // Kendi poster katmanımızı göster
      function showPoster() {
        if (!playerPoster) return;
        const p = document.getElementById("custom-poster");
        p.style.backgroundImage = "url('" + playerPoster + "')";
        p.style.display = "block";
      }
      function hidePoster() {
        document.getElementById("custom-poster").style.display = "none";
      }

      // Yükleniyor animasyonu (Clappr spinner'ının aynısı)
      function showLoading() {
        document.getElementById("loading-spinner").style.display = "block";
      }
      function hideLoading() {
        document.getElementById("loading-spinner").style.display = "none";
      }

      // TAM EKRAN: Android'de container tam ekran + yatay, iPhone'da videonun native tam ekranı
      let fsReady = false;
      function setupFullscreen() {
        if (fsReady) return;
        fsReady = true;
        const btn = document.getElementById("fs-btn");
        btn.style.display = "flex";
        btn.addEventListener("click", () => {
          const container = document.getElementById("player");
          const video = container.querySelector("video");

          if (document.fullscreenElement || document.webkitFullscreenElement) {
            // Zaten tam ekransa çık
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            return;
          }

          if (container.requestFullscreen) {
            container.requestFullscreen();
          } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
          } else if (video && video.webkitEnterFullscreen) {
            // iPhone Safari: sadece video kendi tam ekranına girebilir
            video.webkitEnterFullscreen();
          }

          // Tam ekranda yatay moda çevir (destekleyen Android'lerde)
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch(() => {});
          }
        });
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

        // Yayın oynamaya başlayınca posteri ve spinner'ı kaldır, boyutu tazele
        mainPlayer.on(Clappr.Events.PLAYER_PLAY, function() {
          hidePoster();
          hideLoading();
          mainPlayer.resize({ width: "100%", height: "100%" });
          setupFullscreen();
        });

        // Pencere boyutu değişince player'ı da uydur
        window.addEventListener("resize", function() {
          if (mainPlayer) mainPlayer.resize({ width: "100%", height: "100%" });
        });
      }

      function skipAd() {
        if (adPlayer) adPlayer.destroy();
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
          hideLoading();
          adPlayer = new Clappr.Player({
            source: reklamVideo,
            parentId: "#player",
            autoPlay: true,
            width: "100%",
            height: "100%"
          });

          const timerDiv = document.getElementById("ad-timer");
          const skipBtn = document.getElementById("skip-btn");

          let remaining = reklamSure;
          timerDiv.style.display = "block";
          timerDiv.innerText = "Reklamın bitmesine kalan süre: " + remaining + " saniye";

          countdown = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
              clearInterval(countdown);
              adPlayer.destroy();
              adPlayer = null;
              timerDiv.style.display = "none";
              skipBtn.style.display = "none";
              startMainPlayer(mainUrl);
            } else {
              timerDiv.innerText = "Reklamın bitmesine kalan süre: " + remaining + " saniye";
              if (remaining <= reklamSure - 5) skipBtn.style.display = "block";
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

        showLoading(); // Clappr tarzı üç nokta spinner

        try {
          const [analyticsRes, cinemaRes] = await Promise.allSettled([
            fetch("https://teletv5.top/load/yayinlink.php?id=" + encodeURIComponent(id)),
            fetch("https://streamsport365.com/cinema", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Accept": "*/*" },
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
            if (cinemaData.URL) streamUrl = cinemaData.URL;
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
        showPoster();

        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || ('ontouchstart' in window && window.innerWidth < 1024);
        const overlay = document.getElementById("play-overlay");

        if (isMobile) {
          // Mobil: butona basınca başlat
          overlay.addEventListener("click", () => {
            overlay.remove();
            loadStream(id);
          });
        } else {
          // PC: buton yok, direkt başlat
          overlay.remove();
          loadStream(id);
        }
      });
    </script>
  </body>
</html>
`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" }
  });
}
