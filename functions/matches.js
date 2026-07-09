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

  // YENİ: Buton bilgileri
  let playerTelegram = "";
  let playerX = "";
  let playerEkstraAd = "";
  let playerEkstraLink = "";
  let playerButonKonum = "sag"; // sag = sağ üst, sol = sol üst

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

      // YENİ: Buton verilerini çek
      if (json.playerlogo.player_telegram) {
        playerTelegram = json.playerlogo.player_telegram;
      }
      if (json.playerlogo.player_x) {
        playerX = json.playerlogo.player_x;
      }
      if (json.playerlogo.player_ekstra_ad) {
        playerEkstraAd = json.playerlogo.player_ekstra_ad;
      }
      if (json.playerlogo.player_ekstra_link) {
        playerEkstraLink = json.playerlogo.player_ekstra_link;
      }
      if (json.playerlogo.player_buton_konum === "sol") {
        playerButonKonum = "sol";
      }

    }

  } catch (e) {

    console.error("Veriler alınamadı:", e);

  }

  // YENİ: Butonların HTML'ini hazırla (sadece dolu olanlar eklenir)
  let butonlarHtml = "";

  if (playerTelegram) {
    butonlarHtml += `
        <a class="p-btn p-btn-tg" href="${playerTelegram}" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="12" height="12" fill="#fff"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.227.05-.01.12-.022.166.022.047.044.042.124.037.146-.03.129-1.227 1.241-1.846 1.83-.193.186-.33.33-.32.526.004.043.013.107.03.155.02.054.04.1.05.111l.012.011c.18.118.31.2.31.2l.06.05c.193.16.318.282.452.395.13.11.281.214.41.214.18 0 .29-.165.36-.39.18-.65.4-1.71.42-1.81.03-.14.02-.27-.03-.36-.05-.09-.16-.13-.27-.13z"/></svg>
          TELEGRAM
        </a>`;
  }

  if (playerX) {
    butonlarHtml += `
        <a class="p-btn p-btn-x" href="${playerX}" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="11" height="11" fill="#fff"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-5.094l-3.97-4.804-4.034 4.804H.448l5.547-6.65L0 .75h5.117l3.595 4.39L12.6.75z"/></svg>
          X
        </a>`;
  }

  if (playerEkstraLink) {
    butonlarHtml += `
        <a class="p-btn p-btn-ekstra" href="${playerEkstraLink}" target="_blank" rel="noopener">
          ${playerEkstraAd ? playerEkstraAd : "TIKLA"}
        </a>`;
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



      /* ============================= */
      /* YENİ: PLAYER ÜSTÜ BUTONLAR    */
      /* ============================= */
      #player-buttons {
        position: absolute;
        top: 10px;
        ${playerButonKonum === "sol" ? "left: 10px;" : "right: 10px;"}
        z-index: 9998;
        display: flex;
        gap: 6px;
        align-items: center;
        font-family: Arial, sans-serif;
      }

      .p-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #fff;
        text-decoration: none;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.4px;
        text-transform: uppercase;
        padding: 6px 10px;
        border-radius: 6px;
        line-height: 1;
        white-space: nowrap;
        opacity: 0.95;
        transition: opacity 0.15s ease, transform 0.15s ease;
      }

      .p-btn:hover { opacity: 1; transform: scale(1.05); }

      .p-btn-tg     { background: #229ED9; }
      .p-btn-x      { background: #000; border: 1px solid rgba(255,255,255,0.35); }
      .p-btn-ekstra { background: #e74c3c; }

      /* Küçük ekranlarda butonlar biraz ufalsın */
      @media (max-width: 480px) {
        .p-btn { font-size: 9px; padding: 4px 7px; }
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

      <!-- YENİ: Butonlar -->
      <div id="player-buttons">${butonlarHtml}</div>

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



        // Yayın oynamaya başlayınca posteri kaldır, boyutu tazele

        mainPlayer.on(Clappr.Events.PLAYER_PLAY, function() {

          hidePoster();

          mainPlayer.resize({ width: "100%", height: "100%" });

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



        showPoster(); // yayın gelene kadar arkaplan görünsün



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
