export async function onRequest(context) {

  const url = new URL(context.request.url);

  const id = url.searchParams.get("id");

  let playerLogo = "";
  let playerLogoyer = "";
  let playerSite = "";
  // Buton bilgileri
  let playerTelegram = "";
  let playerX = "";
  let playerEkstraAd = "";
  let playerEkstraLink = "";
  let playerButonKonum = "sag"; // sag = sağ üst, sol = sol üst

  // Ekstra buton rengi (panelden ayar_btncolor)
  let ekstraButonRenk = "#5c1212"; // panelden renk gelmezse koyu kırmızı

  try {

    const res2 = await fetch("https://taraftarium.corepanel.pro/api/verirepo.php", {
      cf: { cacheTtl: 60, cacheEverything: true }
    });

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

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <style>

      html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; }

      #player-shell, #player { width: 100%; height: 100vh; position: relative; }

      #ios-player-container {
        display: none;
        position: absolute;
        inset: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background: #000;
      }

      #ios-video {
        width: 100%;
        height: 100%;
        background: #000;
        object-fit: contain;
      }

      #ios-play-overlay {
        position: absolute;
        inset: 0;
        z-index: 3;
        display: none;
        align-items: center;
        justify-content: center;
        background: #000;
        cursor: pointer;
      }

      #ios-play-overlay.visible { display: flex; }

      #ios-play-button {
        width: 76px;
        height: 76px;
        padding: 0 0 0 6px;
        border: 3px solid #fff;
        border-radius: 50%;
        background: rgba(0, 0, 0, .7);
        color: #fff;
        font-size: 32px;
        cursor: pointer;
      }

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

      /* iPhone, canlı HLS penceresini 8-12 saniyelik video gibi gösterebilir.
         Clappr'ın değişen süre bilgisini gizleyip sabit CANLI etiketi göster. */
      #player [data-player] [data-duration],
      #player [data-player] .media-control-indicator[data-duration] {
        display: none !important;
      }

      #live-badge {
        position: absolute;
        left: 12px;
        bottom: 12px;
        z-index: 2147483646;
        padding: 5px 9px;
        border-radius: 4px;
        background: rgba(190, 0, 0, .92);
        color: #fff;
        font: 700 11px/1 Arial, Helvetica, sans-serif;
        letter-spacing: .35px;
        pointer-events: none;
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

    <script src="https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.min.js"></script>

    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <script src="/assets/js/clappr.js"></script>

  </head>

  <body>

    <div id="player-shell">

      <div id="player"></div>

      <div id="ios-player-container">
        <video id="ios-video" playsinline webkit-playsinline controls x-webkit-airplay="allow"></video>
        <div id="ios-play-overlay">
          <button id="ios-play-button" type="button" aria-label="Yayını oynat">▶</button>
        </div>
      </div>

      <!-- Butonlar -->
      <div id="player-buttons">${butonlarHtml}</div>
      <div id="live-badge">CANLI</div>

    </div>

    <script>

      const id = "${id}";

      let mainPlayer = null;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const iosPlayerContainer = document.getElementById("ios-player-container");
      const iosVideo = document.getElementById("ios-video");
      const iosPlayOverlay = document.getElementById("ios-play-overlay");
      const clapprPlayerContainer = document.getElementById("player");
      const liveBadge = document.getElementById("live-badge");

      // ============================================
      // HATA / RETRY AYARLARI
      // Error code 3 vb. hatalarda sayfayı yenilemeden
      // player'ı otomatik yeniden başlatmak için.
      // ============================================
      let sonUrl = "";
      let retrySayisi = 0;
      const MAX_RETRY = 10;        // En fazla kaç kez denesin
      const RETRY_BEKLEME = 2000;  // Denemeler arası bekleme (ms)
      let yenidenBaslatmaZamani = null;
      let oynatmaBasladi = false;
      let sonVideoZamani = -1;
      let sonIlerlemeAni = Date.now();

      function playeriYenidenBaslat(neden) {
        if (!sonUrl || yenidenBaslatmaZamani) return;

        console.warn("Yayın yeniden başlatılıyor:", neden);

        if (retrySayisi >= MAX_RETRY) {
          console.error("Maksimum deneme sayısına ulaşıldı.");
          return;
        }

        retrySayisi++;
        yenidenBaslatmaZamani = setTimeout(function() {
          yenidenBaslatmaZamani = null;
          oynatmaBasladi = false;
          sonVideoZamani = -1;
          sonIlerlemeAni = Date.now();

          try {
            if (mainPlayer) mainPlayer.destroy();
          } catch (e) {}

          mainPlayer = null;

          if (isIOS && iosVideo) {
            iosVideo.pause();
            iosVideo.removeAttribute("src");
            iosVideo.load();
          }

          startMainPlayer(sonUrl);
        }, RETRY_BEKLEME);
      }

      // ============================================
      // TAM EKRAN DÜZELTMESİ:
      // Tam ekrana geçince butonları tam ekran olan
      // elemanın içine taşı, çıkınca geri getir.
      // ============================================
      function tamEkranButonDuzelt() {
        const btns = document.getElementById("player-buttons");
        const playerEl = document.getElementById("player-shell");
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

      function startIOSPlayer(mainUrl) {
        clapprPlayerContainer.style.display = "none";
        iosPlayerContainer.style.display = "block";
        liveBadge.style.display = "none";

        iosVideo.src = mainUrl;
        iosVideo.load();

        const playPromise = iosVideo.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function() {
            iosPlayOverlay.classList.add("visible");
          });
        }
      }

      function startMainPlayer(mainUrl) {

        mainUrl = mainUrl.replace(/edge4\\./g, "edge3.");
        sonUrl = mainUrl;

        if (isIOS) {
          startIOSPlayer(mainUrl);
          return;
        }

        clapprPlayerContainer.style.display = "block";
        iosPlayerContainer.style.display = "none";
        liveBadge.style.display = "block";

        const options = {

          source: mainUrl,

          parentId: "#player",

          autoPlay: true,

          mute: false,

          volume: 100,

          width: "100%",

          height: "100%",

          mimeType: "application/x-mpegURL",

          playback: { playInline: true } // iOS: video native tam ekrana zorla atlamasın

        };

        ${playerLogo ? `options.watermark = "${playerLogo}";` : ""}

        ${playerSite ? `options.watermarkLink = "${playerSite}";` : ""}

        ${playerLogoyer ? `options.position = "${playerLogoyer}";` : ""}

        mainPlayer = new Clappr.Player(options);

        // ============================================
        // HATA YAKALA (error code 3 dahil):
        // Sayfa yenilemeden player'ı yıkıp yeniden kur.
        // ============================================
        mainPlayer.on(Clappr.Events.PLAYER_ERROR, function(err) {

          console.warn("Player hatası, yeniden deneniyor:", err);
          playeriYenidenBaslat("Clappr hatası");

        });

        // Yayın oynamaya başlayınca player boyutunu tazele

        mainPlayer.on(Clappr.Events.PLAYER_PLAY, function() {

          // Başarıyla oynadıysa retry sayacını sıfırla
          retrySayisi = 0;
          oynatmaBasladi = true;
          sonIlerlemeAni = Date.now();

          // Tarayıcı veya önceki player sessiz bıraktıysa sesi geri aç.
          if (typeof mainPlayer.unmute === "function") {
            mainPlayer.unmute();
          }
          if (typeof mainPlayer.setVolume === "function") {
            mainPlayer.setVolume(100);
          }

          mainPlayer.resize({ width: "100%", height: "100%" });

        });

      }

      // Pencere boyutu değişince player'ı da uydur
      // (Bir kez bağlanır; retry'da tekrar tekrar eklenmesin diye
      // startMainPlayer'ın dışında.)
      window.addEventListener("resize", function() {

        if (mainPlayer) mainPlayer.resize({ width: "100%", height: "100%" });

      });

      iosPlayOverlay.addEventListener("click", function() {
        iosPlayOverlay.classList.remove("visible");
        const playPromise = iosVideo.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function() {
            iosPlayOverlay.classList.add("visible");
          });
        }
      });

      iosVideo.addEventListener("playing", function() {
        oynatmaBasladi = true;
        retrySayisi = 0;
        sonIlerlemeAni = Date.now();
        iosPlayOverlay.classList.remove("visible");
      });

      iosVideo.addEventListener("error", function() {
        playeriYenidenBaslat("iPhone native video hatası");
      });

      // iOS bazen hata olayı vermeden siyah ekranda/donmuş halde kalır.
      // Video zamanı 10 saniye ilerlemezse player'ı yeniden kur.
      setInterval(function() {
        const video = isIOS ? iosVideo : document.querySelector("#player video");
        if (!video || !oynatmaBasladi || video.paused || video.ended) return;

        if (Math.abs(video.currentTime - sonVideoZamani) > 0.05) {
          sonVideoZamani = video.currentTime;
          sonIlerlemeAni = Date.now();
          return;
        }

        if (Date.now() - sonIlerlemeAni > 10000) {
          playeriYenidenBaslat("iOS görüntüsü ilerlemedi");
        }
      }, 2000);

      // Safari arka plandan geri gelince HLS bağlantısını tekrar uyandır.
      document.addEventListener("visibilitychange", function() {
        if (document.visibilityState !== "visible") return;

        const video = isIOS ? iosVideo : document.querySelector("#player video");
        if (!video) {
          playeriYenidenBaslat("sayfaya dönüşte video bulunamadı");
          return;
        }

        if (video.readyState < 2 || video.networkState === 3) {
          playeriYenidenBaslat("sayfaya dönüşte yayın hazır değil");
          return;
        }

        if (oynatmaBasladi && video.paused) {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function() {
              playeriYenidenBaslat("sayfaya dönüşte oynatma başlamadı");
            });
          }
        }
      });

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

            startMainPlayer(streamUrl);

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
