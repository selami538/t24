export async function onRequest(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");

  // ===================== VARSAYILANLAR =====================
  let playerLogo     = "";   // watermark
  let playerLogoyer  = "";   // position (top-left / top-right / bottom-left / bottom-right)
  let playerSite     = "";   // logolink (watermark tıklama linki)
  let playerPoster   = "";   // poster / arkaplan
  let reklamVideo    = "";
  let reklamSure     = 5;
  let reklamDurum    = 0;

  // --- 1. koddan gelen EK ALANLAR (verirepo.php'ye eklenecek) ---
  let playerTelegram   = "";
  let playerX          = "";
  let playerEkstraLink = "";
  let playerEkstraAd   = "";
  let playerButonKonum = "sag";  // 'sag' | 'sol'
  let playerBtnColor   = "";     // buton rengi (opsiyonel)

  try {
    const res2 = await fetch("https://panelnetspor.corepanel.pro/api/verirepo.php");
    const json = await res2.json();

    if (json.playerlogo) {
      const p = json.playerlogo;

      if (p.player_logo)        playerLogo    = p.player_logo;
      if (p.player_logoyeriki)  playerLogoyer = p.player_logoyeriki;
      if (p.player_site)        playerSite    = p.player_site;
      if (p.player_arkaplan)    playerPoster  = p.player_arkaplan;
      if (p.player_reklamvideo) reklamVideo   = p.player_reklamvideo;
      if (p.player_reklamsure)  reklamSure    = parseInt(p.player_reklamsure) || 5;
      if (p.player_reklamdurum) reklamDurum   = parseInt(p.player_reklamdurum) || 0;

      // --- yeni alanlar ---
      if (p.player_telegram)    playerTelegram   = p.player_telegram;
      if (p.player_x)           playerX          = p.player_x;
      if (p.player_ekstra_link) playerEkstraLink = p.player_ekstra_link;
      if (p.player_ekstra_ad)   playerEkstraAd   = p.player_ekstra_ad;
      if (p.player_buton_konum) playerButonKonum = p.player_buton_konum;
      if (p.player_btncolor)    playerBtnColor   = p.player_btncolor;
    }
  } catch (e) {
    console.error("Veriler alınamadı:", e);
  }

  // config.match yapısı (1. kodun beklediği format)
  const matchObj = {
    source: "",                 // stream JS ile async doldurulacak
    poster: playerPoster,
    watermark: playerLogo,
    position: playerLogoyer || "top-right",
    logolink: playerSite,
    telegram: playerTelegram,
    x: playerX,
    ekstralink: playerEkstraLink,
    ekstraad: playerEkstraAd,
    butonkonum: playerButonKonum,
    reklamvideo: reklamVideo,
    reklamdurum: String(reklamDurum),
    reklamsure: reklamSure
  };

  // dinamik renk için (1. koddaki veritabaniAyarlari.ayar_btncolor)
  const vaObj = {
    ayar_btncolor: playerBtnColor
  };

  const matchJson = JSON.stringify(matchObj);
  const vaJson    = JSON.stringify(vaObj);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    html, body { margin: 0; padding: 0; background: #000; height: 100%; }
    #app { width: 100%; height: 100vh; position: relative; overflow: hidden; }
  </style>
  <script src="https://cdn.jsdelivr.net/gh/clappr/clappr@latest/dist/clappr.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</head>
<body>
  <div id="app"></div>

  <script>
    // ===================== SUNUCUDAN GELEN VERİ =====================
    window.config = { match: ${matchJson} };
    window.veritabaniAyarlari = ${vaJson};
    var STREAM_ID = "${id}";
  </script>

  <script>
  (function($) {
    $(document).ready(function() {
      var customStyle = \`
        <style>
          .v-overlay-wrapper {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important; height: 100% !important;
            pointer-events: none !important;
            z-index: 2147483647 !important;
            font-family: 'Roboto', sans-serif !important;
          }
          .v-overlay-wrapper a, .v-close-btn { pointer-events: auto !important; }

          .v-top-left { position: absolute !important; top: 12px !important; left: 12px !important; display: flex !important; gap: 6px !important; flex-wrap: wrap !important; justify-content: flex-start !important; }
          .v-top-right { position: absolute !important; top: 12px !important; right: 12px !important; display: flex !important; gap: 6px !important; flex-wrap: wrap !important; justify-content: flex-end !important; }

          .v-btn-link {
            background: rgba(0, 0, 0, 0.8) !important;
            color: #fff !important;
            padding: 7px 14px !important;
            border-radius: 5px !important;
            text-decoration: none !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            text-transform: uppercase !important;
          }
          .v-btn-red { background: #e74c3c !important; border: none !important; }
          .v-btn-link svg { width: 17px; height: 17px; fill: currentColor; }

          .v-watermark {
            position: absolute !important;
            min-width: 20px !important;
            max-width: 200px !important;
            text-align: center !important;
            z-index: 10 !important;
            pointer-events: auto !important;
            cursor: pointer !important;
            transition: opacity 0.3s ease !important;
            display: none !important;
          }
          .v-watermark.v-show { display: block !important; }
          .v-watermark:hover { opacity: 1 !important; }
          .v-watermark img {
            max-width: 150px !important;
            opacity: 0.7 !important;
            transition: opacity 0.3s ease !important;
          }
          .v-watermark:hover img { opacity: 1 !important; }

          .v-poster-bg {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important; height: 100% !important;
            background-color: #000 !important;
            background-position: center center !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            z-index: 9998 !important;
            pointer-events: none !important;
          }

          .v-play-overlay {
            position: absolute !important;
            top: 0; left: 0;
            width: 100%; height: 100%;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
            cursor: pointer !important;
            background: rgba(0,0,0,0.3) !important;
          }
          .v-play-overlay .v-play-btn {
            width: 70px !important;
            height: 70px !important;
            background: rgba(0,0,0,0.7) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: 3px solid rgba(255,255,255,0.8) !important;
            transition: transform 0.2s !important;
          }
          .v-play-overlay:hover .v-play-btn { transform: scale(1.1) !important; }
          .v-play-overlay .v-play-btn svg {
            width: 30px; height: 30px; fill: #fff;
            margin-left: 5px;
          }

          .v-loading {
            position: absolute !important;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) !important;
            color: #fff !important;
            font: 600 14px/1 'Roboto', sans-serif !important;
            z-index: 9999 !important;
            background: rgba(0,0,0,0.6) !important;
            padding: 12px 20px !important;
            border-radius: 8px !important;
          }

          .v-ad-wrap {
            position: absolute !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important; height: 100% !important;
            background: #000 !important;
            z-index: 10000 !important;
            overflow: hidden !important;
          }
          .v-ad-wrap video {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            background: #000 !important;
          }
          .v-ad-badge {
            position: absolute !important;
            top: 14px !important; left: 14px !important;
            background: rgba(0,0,0,0.7) !important;
            color: #fff !important;
            font: 700 10px/1 'Roboto', sans-serif !important;
            letter-spacing: 0.5px !important;
            padding: 5px 8px !important;
            border-radius: 4px !important;
            text-transform: uppercase !important;
            z-index: 2 !important;
          }
          .v-ad-skip {
            position: absolute !important;
            bottom: 18px !important; right: 18px !important;
            background: rgba(0,0,0,0.75) !important;
            color: #fff !important;
            font: 600 13px/1 'Roboto', sans-serif !important;
            padding: 9px 15px !important;
            border-radius: 5px !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            z-index: 2 !important;
            user-select: none !important;
          }
          .v-ad-skip.ready { cursor: pointer !important; }
          .v-ad-skip.ready:hover { background: #e74c3c !important; border-color: #e74c3c !important; }

          .v-unmute {
            position: absolute !important;
            bottom: 16px !important; left: 16px !important;
            background: rgba(0,0,0,0.75) !important;
            color: #fff !important;
            font: 700 12px/1 'Roboto', sans-serif !important;
            padding: 9px 14px !important;
            border-radius: 6px !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            display: none !important;
            align-items: center !important;
            gap: 7px !important;
            cursor: pointer !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
            text-transform: uppercase !important;
          }
          .v-unmute.v-show { display: flex !important; }
          .v-unmute:hover { background: #e74c3c !important; border-color: #e74c3c !important; }
          .v-unmute svg { width: 15px; height: 15px; fill: #fff; }
        </style>
      \`;
      $('head').append(customStyle);

      if (!window.config) return;

      var realSource   = '';        // stream async gelecek
      var streamReady  = false;
      var pendingStart = false;
      var sourceLoaded = false;
      var logoShown    = false;
      var adPlayed     = false;

      // ===================== AYARLARI OKU =====================
      var M  = window.config.match || {};
      var VA = (typeof veritabaniAyarlari !== 'undefined' && veritabaniAyarlari) ? veritabaniAyarlari : {};

      function temizUrl(val) {
        val = (val || '').toString().trim();
        if (val === '#' || val === 'x') return '';
        return val;
      }

      // --- Reklam ---
      var adUrl   = (M.reklamvideo || '').toString().trim();
      var adDurum = (M.reklamdurum || '').toString().trim();
      var adSure  = parseInt(M.reklamsure || 5, 10);
      if (isNaN(adSure) || adSure < 1) adSure = 5;
      var adActive = (adDurum === '1') && adUrl !== '';

      // --- Butonlar ---
      var telegramUrl = temizUrl(M.telegram || '');
      var xUrl        = temizUrl(M.x || '');
      var ekstraLink  = temizUrl(M.ekstralink || '');
      var ekstraAd    = (M.ekstraad || '').toString().trim();

      // --- Buton konumu ---
      var butonKonum = (M.butonkonum || 'sag').toString().trim().toLowerCase();
      var topClass = (butonKonum === 'sol') ? 'v-top-left' : 'v-top-right';

      // ===================== PLAYER (source olmadan) =====================
      var player = new Clappr.Player({
        parentId: "#app",
        source: '',
        width: '100%',
        height: '100%',
        autoPlay: false,
        mute: true,
        playback: { playInline: true, recycleVideo: false, preload: 'none' },
        hlsPlayback: { playInline: true }
      });

      // Poster arka plan
      var posterUrl = M.poster || '';
      if (posterUrl) {
        var bgLayer = '<div id="vPosterBg" class="v-poster-bg" style="background-image:url(\\'' + posterUrl + '\\');"></div>';
        $('#app').css('position', 'relative').append(bgLayer);
      }

      // Ses durumu (otomatik oynatma için sessiz başlar)
      var wantSound = false;

      function applySound() {
        var av = document.getElementById('vAdVideo');
        if (av) { try { av.muted = !wantSound; } catch (e) {} }
        try { if (wantSound) { player.unmute(); } else { player.mute(); } } catch (e) {}
        try {
          var vp = player.core && player.core.activePlayback;
          var mv = vp && vp.el;
          if (mv && mv.tagName === 'VIDEO') mv.muted = !wantSound;
        } catch (e) {}
      }

      // Unmute butonu
      $('#app').css('position', 'relative').append(
        '<div id="vUnmute" class="v-unmute">' +
          '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>' +
          'Sesi Aç' +
        '</div>'
      );

      $(document).on('click', '#vUnmute', function() {
        wantSound = true;
        applySound();
        $('#vUnmute').removeClass('v-show');
      });

      // ===================== STREAM ÇÖZÜMLEME (2. kod mantığı) =====================
      function resolveStream(rawUrl) {
        if (!rawUrl) return;
        realSource  = rawUrl.replace(/edge4\\./g, "edge3.");
        streamReady = true;
        if (pendingStart) {
          pendingStart = false;
          $('#vLoading').remove();
          actuallyStart();
        }
      }

      async function loadStream(id) {
        if (!id) return;
        try {
          var results = await Promise.allSettled([
            fetch("https://teletv5.top/load/yayinlink.php?id=" + encodeURIComponent(id)),
            fetch("https://streamsport365.com/cinema", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Accept": "*/*" },
              body: JSON.stringify({
                AppId: "5000", AppVer: "1", VpcVer: "1.0.12",
                Language: "en", Token: "", VideoId: id
              })
            })
          ]);

          var analyticsRes = results[0];
          var cinemaRes    = results[1];
          var streamUrl = "";

          if (analyticsRes.status === "fulfilled") {
            try {
              var aData = await analyticsRes.value.json();
              if (aData.deismackanal && aData.deismackanal.includes("m3u8")) {
                streamUrl = aData.deismackanal;
              }
            } catch (e) {}
          }

          if (!streamUrl && cinemaRes.status === "fulfilled") {
            try {
              var cData = await cinemaRes.value.json();
              if (cData.URL) streamUrl = cData.URL;
            } catch (e) {}
          }

          if (streamUrl) {
            resolveStream(streamUrl);
          } else {
            console.error("Yayın bulunamadı");
          }
        } catch (err) {
          console.error("Yayın yüklenirken hata:", err);
        }
      }

      // ===================== GERÇEK YAYINI BAŞLAT =====================
      function actuallyStart() {
        $('#vPosterBg').remove();
        if (!sourceLoaded) {
          sourceLoaded = true;
          player.configure({ source: realSource, autoPlay: true, mute: !wantSound });
        } else {
          player.play();
        }
        if (!wantSound) $('#vUnmute').addClass('v-show');
      }

      function startRealStream() {
        if (!streamReady) {
          // stream henüz gelmedi -> gelince otomatik başlasın
          pendingStart = true;
          $('#app').append('<div id="vLoading" class="v-loading">Yayın yükleniyor…</div>');
          return;
        }
        actuallyStart();
      }

      // ===================== PRE-ROLL REKLAM =====================
      function playAd() {
        adPlayed = true;
        $('#vPosterBg').remove();

        var adHtml =
          '<div id="vAdWrap" class="v-ad-wrap">' +
            '<video id="vAdVideo" playsinline webkit-playsinline preload="auto" src="' + adUrl + '"></video>' +
            '<div class="v-ad-badge">Reklam</div>' +
            '<div id="vAdSkip" class="v-ad-skip">Geç ' + adSure + '</div>' +
          '</div>';
        $('#app').css('position', 'relative').append(adHtml);

        var adVideo = document.getElementById('vAdVideo');
        var skipBtn = document.getElementById('vAdSkip');
        var finished = false;

        adVideo.setAttribute('playsinline', '');
        adVideo.setAttribute('webkit-playsinline', '');
        adVideo.muted = !wantSound;

        function endAd() {
          if (finished) return;
          finished = true;
          clearInterval(countdown);
          $('#vAdWrap').remove();
          startRealStream();
        }

        var pr = adVideo.play();
        if (pr && pr.catch) {
          pr.catch(function() {
            adVideo.muted = true;
            adVideo.play().catch(function() { endAd(); });
          });
        }

        var remaining = adSure;
        var countdown = setInterval(function() {
          remaining--;
          if (remaining > 0) {
            skipBtn.textContent = 'Geç ' + remaining;
          } else {
            clearInterval(countdown);
            skipBtn.textContent = 'Reklamı Geç ›';
            skipBtn.classList.add('ready');
            skipBtn.addEventListener('click', endAd);
          }
        }, 1000);

        adVideo.addEventListener('ended', endAd);
        adVideo.addEventListener('error', endAd);
      }

      // ===================== PLAY BUTONU TIKLAMA =====================
      // ===================== OTOMATİK BAŞLAT =====================
      function autoBegin() {
        $('#vPlayOverlay').remove();
        if (adActive && !adPlayed) {
          playAd();
        } else {
          startRealStream();
        }
      }

      player.on(Clappr.Events.PLAYER_PLAY, function() {
        $('#vPosterBg').remove();
        applySound();
        if (!wantSound) $('#vUnmute').addClass('v-show');
        if (!logoShown) {
          $('.v-watermark').addClass('v-show');
          logoShown = true;
        }
      });

      player.on(Clappr.Events.PLAYER_READY, function() {
        if (!wantSound) { try { player.mute(); } catch (e) {} }
        var vp = player.core.activePlayback;
        var videoElement = vp && vp.el;
        if (videoElement && videoElement.tagName === 'VIDEO') {
          videoElement.setAttribute('playsinline', '');
          videoElement.setAttribute('webkit-playsinline', '');
          videoElement.setAttribute('x5-playsinline', '');
          videoElement.setAttribute('x5-video-player-type', 'h5');
          videoElement.setAttribute('x5-video-player-fullscreen', 'false');
          videoElement.removeAttribute('controls');
        }
      });

      // ===================== ARAYÜZ + DİNAMİK RENK =====================
      var checkUI = setInterval(function() {
        var target = $('#app [data-player]');
        if (target.length) {
          var v = (typeof veritabaniAyarlari !== 'undefined' && veritabaniAyarlari) ? veritabaniAyarlari : {};

          // Dinamik buton rengi
          if (v.ayar_btncolor && v.ayar_btncolor.trim() !== '') {
            var dRenk = v.ayar_btncolor.trim();
            $('head').append('<style>.v-btn-red { background: ' + dRenk + ' !important; } .v-ad-skip.ready:hover { background: ' + dRenk + ' !important; border-color: ' + dRenk + ' !important; }</style>');
          }

          var watermark = M.watermark || '';
          var position  = M.position || 'top-right';
          var logoLink  = M.logolink || '';

          var iconTele = \`<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.58-3.27 3.61-1.51 4.35-1.77 4.84-1.78.11 0 .35.03.5.16.12.1.16.23.18.33.02.09.03.28.02.4z"/></svg>\`;
          var iconX = \`<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>\`;

          var watermarkStyle = '';
          switch(position) {
            case 'top-left':     watermarkStyle = 'top: 50px !important; left: 20px !important;'; break;
            case 'top-right':    watermarkStyle = 'top: 50px !important; right: 20px !important;'; break;
            case 'bottom-left':  watermarkStyle = 'bottom: 50px !important; left: 20px !important;'; break;
            case 'bottom-right': watermarkStyle = 'bottom: 50px !important; right: 20px !important;'; break;
            default:             watermarkStyle = 'top: 50px !important; right: 20px !important;';
          }

          var watermarkHtml = '';
          if (watermark && watermark !== '') {
            if (logoLink && logoLink.trim() !== '') {
              watermarkHtml = \`<a href="\${logoLink}" target="_blank" class="v-watermark" style="\${watermarkStyle}"><img src="\${watermark}" alt="Logo"></a>\`;
            } else {
              watermarkHtml = \`<div class="v-watermark" style="\${watermarkStyle}; cursor:default !important;"><img src="\${watermark}" alt="Logo"></div>\`;
            }
          }

          var topButtons = '';
          if (telegramUrl) {
            topButtons += \`<a href="\${telegramUrl}" target="_blank" class="v-btn-link">\${iconTele} TELEGRAM</a>\`;
          }
          if (xUrl) {
            topButtons += \`<a href="\${xUrl}" target="_blank" class="v-btn-link">\${iconX} X</a>\`;
          }
          if (ekstraLink) {
            var ekstraText = ekstraAd ? ekstraAd : 'REKLAM';
            topButtons += \`<a href="\${ekstraLink}" target="_blank" class="v-btn-link v-btn-red">\${ekstraText}</a>\`;
          }
          var topRightHtml = topButtons ? \`<div class="\${topClass}">\${topButtons}</div>\` : '';

          var ui = \`<div class="v-overlay-wrapper">\${topRightHtml}\${watermarkHtml}</div>\`;
          target.append(ui);
          clearInterval(checkUI);
        }
      }, 100);

      // ===================== STREAM'İ ARKA PLANDA ÇÖZMEYE BAŞLA =====================
      loadStream(STREAM_ID);

      // Otomatik başlat (reklam varsa önce reklam, sessiz -> sonra yayın)
      autoBegin();
    });
  })(jQuery);
  </script>
</body>
</html>
`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" }
  });
}
