(function($) {
    $(document).ready(function() {
        var customStyle = `
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
                /* Varsayılan kırmızı (Veritabanından gelmezse yedek olarak kalır) */
                .v-btn-red { background: #e74c3c !important; border: none !important; }
                .v-btn-link svg { width: 17px; height: 17px; fill: currentColor; }

                .v-hd-container {
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 5px !important;
                    margin: 0 10px !important;
                    vertical-align: middle !important;
                }
                .v-hd-tag {
                    color: #fff !important;
                    font-size: 11px !important;
                    font-weight: bold !important;
                    border: 1.5px solid #fff !important;
                    padding: 1px 4px !important;
                    border-radius: 3px !important;
                    line-height: 1 !important;
                }
                .v-live-dot {
                    width: 7px !important;
                    height: 7px !important;
                    background: #ff0000 !important;
                    border-radius: 50% !important;
                    box-shadow: 0 0 5px #ff0000 !important;
                    animation: v-blink 1s infinite !important;
                }
                @keyframes v-blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

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

                .v-bottom-ads {
                    position: absolute !important;
                    bottom: 0px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: 260px !important;
                    z-index: 10 !important;
                }
                .v-bottom-ads img { 
                    width: 100% !important; 
                    border-radius: 5px 5px 0 0 !important; 
                    box-shadow: 0 -2px 15px rgba(0,0,0,0.5) !important;
                }

                .v-close-btn {
                    position: absolute !important;
                    top: -10px !important; right: -5px !important;
                    background: #fff !important; color: #000 !important;
                    width: 20px !important; height: 20px !important;
                    border-radius: 50% !important; text-align: center !important;
                    line-height: 20px !important; font-weight: bold !important;
                    cursor: pointer !important; font-size: 13px !important;
                    z-index: 11 !important;
                }

                .v-poster-bg {
                    position: absolute !important;
                    top: 0 !important; left: 0 !important;
                    width: 100% !important; height: 100% !important;
                    background-color: #000 !important;
                    background-position: center !important;
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
                .v-play-overlay:hover .v-play-btn {
                    transform: scale(1.1) !important;
                }
                .v-play-overlay .v-play-btn svg {
                    width: 30px; height: 30px; fill: #fff;
                    margin-left: 5px;
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

                .bar-container.seek-disabled .bar-background,
                .bar-container.seek-disabled .bar-scrubber {
                    visibility: hidden !important;
                }
            </style>
        `;
        $('head').append(customStyle);

        if (window.config) {
            var realSource = window.config.match.source; 
            var sourceLoaded = false;
            var logoShown = false;
            var adPlayed = false;

            // ===================== AYARLARI OKU =====================
            var M  = window.config.match || {};
            var VA = (typeof veritabaniAyarlari !== 'undefined' && veritabaniAyarlari) ? veritabaniAyarlari : {};

            function temizUrl(val) {
                val = (val || '').toString().trim();
                if (val === '#' || val === 'x') return '';
                return val;
            }

            // --- Reklam ---
            var adUrl   = (M.reklamvideo  || M.player_reklamvideo  || VA.player_reklamvideo  || VA.reklamvideo  || '').toString().trim();
            var adDurum = (M.reklamdurum  || M.player_reklamdurum  || VA.player_reklamdurum  || VA.reklamdurum  || '').toString().trim();
            var adSure  = parseInt(M.reklamsure || M.player_reklamsure || VA.player_reklamsure || VA.reklamsure || 5, 10);
            if (isNaN(adSure) || adSure < 1) adSure = 5;
            var adActive = (adDurum === '1') && adUrl !== '';

            // --- Telegram ---
            var telegramUrl = temizUrl(M.telegram || M.player_telegram || '');

            // --- X (Twitter) ---
            var xUrl = temizUrl(M.x || M.player_x || '');

            // --- Ekstra Buton ---
            var ekstraLink = temizUrl(M.ekstralink || M.player_ekstra_link || '');
            var ekstraAd   = (M.ekstraad || M.player_ekstra_ad || '').toString().trim();

            // --- Buton Konumu ---
            var butonKonum = (M.butonkonum || M.player_buton_konum || VA.player_buton_konum || 'sag').toString().trim().toLowerCase();
            var topClass = (butonKonum === 'sol') ? 'v-top-left' : 'v-top-right';

            // Player'ı SOURCE OLMADAN başlat
            var player = new Clappr.Player({
                parentId: "#app",
                source: '',               
                poster: window.config.match.poster,
                width: '100%',
                height: '100%',
                autoPlay: false,
                playback: {
                    playInline: true,
                    recycleVideo: false,
                    preload: 'none'
                },
                hlsPlayback: {
                    playInline: true
                }
            });

            var posterUrl = window.config.match.poster || '';
            if (posterUrl) {
                var bgLayer = '<div id="vPosterBg" class="v-poster-bg" style="background-image:url(\'' + posterUrl + '\');"></div>';
                $('#app').css('position', 'relative').append(bgLayer);
            }

            var playOverlay = `
                <div class="v-play-overlay" id="vPlayOverlay">
                    <div class="v-play-btn">
                        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
            `;
            $('#app').css('position', 'relative').append(playOverlay);

            // ===================== GERÇEK YAYINI BAŞLAT =====================
            function startRealStream() {
                $('#vPosterBg').remove();
                if (!sourceLoaded) {
                    sourceLoaded = true;
                    player.configure({
                        source: realSource,
                        autoPlay: true
                    });
                } else {
                    player.play();
                }
            }

            // ===================== PRE-ROLL REKLAM OYNAT =====================
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

            $(document).on('click', '#vPlayOverlay', function() {
                $('#vPlayOverlay').remove();
                if (adActive && !adPlayed) {
                    playAd();          
                } else {
                    startRealStream(); 
                }
            });

            player.on(Clappr.Events.PLAYER_PLAY, function() {
                $('#vPosterBg').remove();
                if (!logoShown) {
                    $('.v-watermark').addClass('v-show');
                    logoShown = true;
                }
            });

            player.on(Clappr.Events.PLAYER_READY, function() {
                var videoElement = player.core.activePlayback.el;
                if (videoElement && videoElement.tagName === 'VIDEO') {
                    videoElement.setAttribute('playsinline', '');
                    videoElement.setAttribute('webkit-playsinline', '');
                    videoElement.setAttribute('x5-playsinline', '');
                    videoElement.setAttribute('x5-video-player-type', 'h5');
                    videoElement.setAttribute('x5-video-player-fullscreen', 'false');
                    videoElement.removeAttribute('controls');
                }
            });

            // ===================== ARAYÜZ KONTROLÜ VE DİNAMİK RENK ENJEKSİYONU =====================
            var checkUI = setInterval(function() {
                var target = $('#app [data-player]');
                if (target.length) {
                    var v = (typeof veritabaniAyarlari !== 'undefined' && veritabaniAyarlari) ? veritabaniAyarlari : {};
                    
                    // 1. Dinamik Rengi Tam Bu Anda Güvenle Çekiyoruz (PHP ile asla çakışmaz)
                    if (v.ayar_btncolor && v.ayar_btncolor.trim() !== '') {
                        var dRenk = v.ayar_btncolor.trim();
                        $('head').append('<style>.v-btn-red { background: ' + dRenk + ' !important; } .v-ad-skip.ready:hover { background: ' + dRenk + ' !important; border-color: ' + dRenk + ' !important; }</style>');
                    }

                    var gif = v.ayar_reklam1;
                    var watermark = window.config.match.watermark || '';
                    var position = window.config.match.position || 'top-right';
                    var logoLink = window.config.match.logolink || '';

                    var iconTele = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.58-3.27 3.61-1.51 4.35-1.77 4.84-1.78.11 0 .35.03.5.16.12.1.16.23.18.33.02.09.03.28.02.4z"/></svg>`;
                    var iconX = `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;

                    var watermarkStyle = '';
                    switch(position) {
                        case 'top-left':    watermarkStyle = 'top: 50px !important; left: 20px !important;'; break;
                        case 'top-right':   watermarkStyle = 'top: 50px !important; right: 20px !important;'; break;
                        case 'bottom-left': watermarkStyle = 'bottom: 50px !important; left: 20px !important;'; break;
                        case 'bottom-right':watermarkStyle = 'bottom: 50px !important; right: 20px !important;'; break;
                        default:            watermarkStyle = 'top: 50px !important; right: 20px !important;';
                    }

                    var watermarkHtml = '';
                    if (watermark && watermark !== '') {
                        if (logoLink && logoLink.trim() !== '') {
                            watermarkHtml = `
                                <a href="${logoLink}" target="_blank" class="v-watermark" style="${watermarkStyle}">
                                    <img src="${watermark}" alt="Logo">
                                </a>
                            `;
                        } else {
                            watermarkHtml = `
                                <div class="v-watermark" style="${watermarkStyle}; cursor:default !important;">
                                    <img src="${watermark}" alt="Logo">
                                </div>
                            `;
                        }
                    }

                    var topButtons = '';
                    if (telegramUrl) {
                        topButtons += `<a href="${telegramUrl}" target="_blank" class="v-btn-link">${iconTele} TELEGRAM</a>`;
                    }
                    if (xUrl) {
                        topButtons += `<a href="${xUrl}" target="_blank" class="v-btn-link">${iconX} X</a>`;
                    }
                    if (ekstraLink) {
                        var ekstraText = ekstraAd ? ekstraAd : 'REKLAM';
                        topButtons += `<a href="${ekstraLink}" target="_blank" class="v-btn-link v-btn-red">${ekstraText}</a>`;
                    }
                    var topRightHtml = topButtons ? `<div class="${topClass}">${topButtons}</div>` : '';

                    var ui = `
                        <div class="v-overlay-wrapper">
                            ${topRightHtml}
                            ${watermarkHtml}
                        </div>
                    `;
                    target.append(ui);
                    clearInterval(checkUI);
                }
            }, 100);
        }
    });
})(jQuery);
