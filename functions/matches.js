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
      // DÜZELTME: Clappr "top-right" gibi İngilizce format bekliyor,
      // bu yüzden player_logoyeriki değil player_logoyer okunuyor
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
      // DÜZELTME: pasif durumda "!1" geliyor, parseInt NaN döndürüyordu
      reklamDurum = json.playerlogo.player_reklamdurum === "1" ? 1 : 0;

      if (json.playerlogo.player_arkaplan) {
        playerPoster = json.playerlogo.player_arkaplan;
        // Göreceli yol geldiyse kökten başlat (assets/img/... -> /assets/img/...)
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
      body { margin: 0; padding: 0; background: #000; }
      #player { width: 100%; height: 100vh; position: relative; }

      /* DÜZELTME: poster'ın kırpılmadan tamamının görünmesi için */
      .player-poster {
        background-size: contain !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-color: #000 !important;
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

      #ad-timer {
        bottom: 40px;
      }

      #skip-btn {
        bottom: 10px;
        display: none;
        cursor: pointer;
        background: #d33;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/gh/clappr/clappr@latest/dist/clappr.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="/assets/js/clappr.js"></script>
  </head>
  <body>
    <div id="player">
      <div id="ad-timer" style="display: none;"></div>
      <div id="skip-btn" onclick="skipAd()">Reklamı Atla</div>
    </div>
    <script>
      const id = "${id}";
      const reklamVideo = "${reklamVideo}";
      const reklamSure = ${reklamSure};
      const reklamDurum = ${reklamDurum};
      let adPlayer = null;
      let countdown = null;

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
        ${playerPoster ? `options.poster = "${playerPoster}";` : ""}

        new Clappr.Player(options);
      }

      function skipAd() {
        if (adPlayer) adPlayer.destroy();
        clearInterval(countdown);
        document.getElementById("ad-timer").style.display = "none";
        document.getElementById("skip-btn").style.display = "none";
        startMainPlayer(window.mainStreamUrl);
      }

      function startAdThenMain(mainUrl) {
        mainUrl = mainUrl.replace(/edge4\\./g, "edge3.");
        window.mainStreamUrl = mainUrl;

        if (reklamDurum === 1 && reklamVideo && reklamSure > 0) {
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
        loadStream(id);
      });
    </script>
  </body>
</html>
`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" }
  });
}
