export async function onRequest(context) {

  const url = new URL(context.request.url);

  const id = url.searchParams.get("id");

  let playerLogo = "";
  let playerLogoyer = "";
  let playerSite = "";
  let reklamVideo = "";
  let reklamSure = 0;
  let reklamDurum = 0;
  // Buton bilgileri
  let playerTelegram = "";
  let playerX = "";
  let playerEkstraAd = "";
  let playerEkstraLink = "";
  let playerButonKonum = "sag"; // sag = sağ üst, sol = sol üst

  // Ekstra buton rengi (panelden ayar_btncolor)
  let ekstraButonRenk = "#5c1212"; // panelden renk gelmezse koyu kırmızı

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

      // Buton verileri
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

      // ayar_btncolor playerlogo içinde de olabilir
      if (json.playerlogo.ayar_btncolor) {
        ekstraButonRenk = json.playerlogo.ayar_btncolor;
      }

    }

    // ayar_btncolor "ayar" veya "ayarlar" tablosundan geliyorsa oradan da dene
    if (json.ayar && json.ayar.ayar_btncolor) {
      ekstraButonRenk = json.ayar.ayar_btncolor;
    }
    if (json.ayarlar && json.ayarlar.ayar_btncolor) {
      ekstraButonRenk = json.ayarlar.ayar_btncolor;
    }

  } catch (e) {

    console.error("Veriler alınamadı:", e);

  }

  // Butonların HTML'ini hazırla (sadece dolu olanlar eklenir)
  let butonlarHtml = "";

  if (playerTelegram) {
    butonlarHtml += `
        <a class="p-btn p-btn-dark" href="${playerTelegram}" target="_blank" rel="noopener">
          <span class="p-ico-tg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="11" height="11" fill="#fff"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
          </span>
          <span class="p-txt">TELEGRAM</span>
        </a>`;
  }

  if (playerX) {
    butonlarHtml += `
        <a class="p-btn p-btn-dark" href="${playerX}" target="_blank" rel="noopener">
          <span class="p-ico-x">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="10" height="10" fill="#fff"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-5.094l-3.97-4.804-4.034 4.804H.448l5.547-6.65L0 .75h5.117l3.595 4.39L12.6.75z"/></svg>
          </span>
          <span class="p-txt">X</span>
        </a>`;
  }

  if (playerEkstraLink) {
    butonlarHtml += `
        <a class="p-btn p-btn-ekstra" href="${playerEkstraLink}" target="_blank" rel="noopener">
          <span class="p-txt">${playerEkstraAd ? playerEkstraAd : "TIKLA"}</span>
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



      /* ============================================== */
      /* PLAYER ÜSTÜ BUTONLAR                           */
      /* NOT: Tam ekranda butonlar Clappr player'ın     */
      /* içine taşınıyor ve Clappr'ın kendi CSS'i bizim */
      /* stilleri eziyordu. Bu yüzden HER ÖZELLİKTE     */
      /* !important var — tam ekranda da aynı görünsün. */
      /* ============================================== */
      #player-buttons {
        position: absolute !important;
        top: 8px !important;
        ${playerButonKonum === "sol" ? "left: 8px !important; right: auto !important;" : "right: 8px !important; left: auto !important;"}
        bottom: auto !important;
        z-index: 2147483647 !important;
        display: flex !important;
        gap: 7px !important;
        align-items: center !important;
        font-family: Arial, Helvetica, sans-serif !important;
        width: auto !important;
        height: auto !important;
        background: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Tam ekranda butonlar üst kenara yapışmasın */
      .player-fullscreen-root {
        position: relative !important;
      }

      #player-buttons.tam-ekran-butonlari {
        top: 12px !important;
      }

      #player-buttons .p-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        color: #fff !important;
        text-decoration: none !important;
        padding: 6px 12px !important;      /* Biraz ufaltıldı */
        border-radius: 14px !important;
        line-height: 1 !important;
        white-space: nowrap !important;
        box-shadow: 0 2px 5px rgba(0,0,0,0.5) !important;
        width: auto !important;
        height: auto !important;
        margin: 0 !important;
        opacity: 1 !important;
        visibility: visible !important;
        cursor: pointer !important;
        transition: transform 0.15s ease, filter 0.15s ease !important;
      }

      #player-buttons .p-btn:hover {
        transform: scale(1.04) !important;
        filter: brightness(1.2) !important;
      }

      /* Yazı: kalın + eğik + büyük harf (biraz ufaltıldı) */
      #player-buttons .p-txt {
        font-size: 12px !important;
        font-weight: 900 !important;
        font-style: italic !important;
        letter-spacing: 0.3px !important;
        text-transform: uppercase !important;
        color: #fff !important;
        font-family: Arial, Helvetica, sans-serif !important;
        line-height: 1 !important;
      }

      /* Telegram ve X: simsiyah zemin */
      #player-buttons .p-btn-dark {
        background: #0d0d0d !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
      }

      /* Telegram'ın mavi yuvarlak ikonu (biraz ufaltıldı) */
      #player-buttons .p-ico-tg {
        width: 18px !important;
        height: 18px !important;
        border-radius: 50% !important;
        background: #2AABEE !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      /* X ikonu */
      #player-buttons .p-ico-x {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      /* Ekstra buton: rengi panelden (ayar_btncolor) */
      #player-buttons .p-btn-ekstra {
        background: ${ekstraButonRenk} !important;
        border: 1px solid rgba(255,255,255,0.06) !important;
      }

      /* Küçük ekranlarda butonlar biraz daha ufalsın */
      @media (max-width: 480px) {
        #player-buttons .p-btn { padding: 4px 9px !important; gap: 4px !important; border-radius: 11px !important; }
        #player-buttons .p-txt { font-size: 9px !important; }
        #player-buttons .p-ico-tg { width: 14px !important; height: 14px !important; }
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

      <!-- Butonlar -->
      <div id="player-buttons">${butonlarHtml}</div>

      <div id="ad-timer" style="display: none;"></div>

      <div id="skip-btn" onclick="skipAd()">Reklamı Atla</div>

    </div>

    <script>

      const id = "${id}";

      const reklamVideo = "${reklamVideo}";

      const reklamSure = ${reklamSure};

      const reklamDurum = ${reklamDurum};

      let adPlayer = null;

      let mainPlayer = null;

      let countdown = null;



      // ============================================
      // TAM EKRAN DÜZELTMESİ:
      // Tam ekrana geçince butonları tam ekran olan
      // elemanın içine taşı, çıkınca geri getir.
      // ============================================
      function tamEkranButonDuzelt() {
        const btns = document.getElementById("player-buttons");
        const playerEl = document.getElementById("player");
        if (!btns || !playerEl) return;

        const fsEl = document.fullscreenElement || document.webkitFullscreenElement;

        // Önceden eklenen tam ekran sınıfını temizle
        document.querySelectorAll(".player-fullscreen-root").forEach(function(el) {
          el.classList.remove("player-fullscreen-root");
        });

        if (fsEl) {
          fsEl.classList.add("player-fullscreen-root");
          fsEl.appendChild(btns);

          // Tam ekranda ekranın üstünden 12 px boşluk bırak
          btns.classList.add("tam-ekran-butonlari");
          btns.style.setProperty("top", "12px", "important");
        } else {
          playerEl.appendChild(btns);

          // Normal görünümde eski 8 px değeri kullanılsın
          btns.classList.remove("tam-ekran-butonlari");
          btns.style.setProperty("top", "8px", "important");
        }
      }
      document.addEventListener("fullscreenchange", tamEkranButonDuzelt);
      document.addEventListener("webkitfullscreenchange", tamEkranButonDuzelt);



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



        // Yayın oynamaya başlayınca player boyutunu tazele

        mainPlayer.on(Clappr.Events.PLAYER_PLAY, function() {

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
