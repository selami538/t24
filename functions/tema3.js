export function getTema3Html(params) {
  const {
    hostname, nextDomain,
    title, description, logo, logowidth, logoheight,
    favicon, amp, canlisonuc,
    twitter, telegram, facebook, instagram, youtube,
    headerapi, bodyapi, footerapi, analyticsapi, apilinkcikisi,
    pageskincolor, footermetin,
    reklam1, reklam2, reklam3, reklam4, reklam5, reklam6,
    hrefreklam1, hrefreklam2, hrefreklam4, hrefreklam5, hrefreklam6,
    hrefpageskin, menuler,
    matchesUrl, channelsUrl
  } = params;

  const kanallar = [
    { ad: "S Sport 1",     img: "https://piabettv21.live/assets/v5/images/s-sport.png",      id: "s-sport-1" },
    { ad: "S Sport 2",     img: "https://piabettv21.live/assets/v5/images/s-sport-2.png",     id: "s-sport-2" },
    { ad: "A Spor",        img: "https://piabettv21.live/assets/v5/images/a-spor.png",        id: "a-spor" },
    { ad: "Spor Smart",    img: "https://piabettv21.live/assets/v5/images/spor-smart.png",    id: "spor-smart" },
    { ad: "Tivibu Spor 1", img: "https://piabettv21.live/assets/v5/images/tivibu-spor-1.png", id: "tivibu-spor-1" },
    { ad: "Tivibu Spor 2", img: "https://piabettv21.live/assets/v5/images/tivibu-spor-2.png", id: "tivibu-spor-2" },
    { ad: "Tivibu Spor 3", img: "https://piabettv21.live/assets/v5/images/tivibu-spor-3.png", id: "tivibu-spor-3" },
    { ad: "Bein Sports 1", img: "https://piabettv21.live/assets/v5/images/bein-sports-1.png", id: "bein-sports-1" },
    { ad: "Bein Sports 2", img: "https://piabettv21.live/assets/v5/images/bein-sports-2.png", id: "bein-sports-2" },
    { ad: "Bein Sports 3", img: "https://piabettv21.live/assets/v5/images/bein-sports-3.png", id: "bein-sports-3" },
    { ad: "Bein Sports 4", img: "https://piabettv21.live/assets/v5/images/bein-sports-4.png", id: "bein-sports-4" },
  ];

  const menuHTML = menuler.map(m =>
    '<a href="' + m.url + '"><i class="' + m.icon + '"></i> ' + m.ad + '</a>'
  ).join('');

  const footerMenuHTML = menuler.map(m =>
    '<a href="' + m.url + '" rel="noopener">' + m.ad + '</a>'
  ).join('');

  const kanalHTML = kanallar.map(k =>
    '<button class="channel-btn" data-kanal="' + k.id + '" onclick="kanalSec(\'' + k.id + '\')">' +
    '<img src="' + k.img + '" alt="' + k.ad + '" onerror="this.style.display=\'none\'"/>' +
    k.ad + '</button>'
  ).join('');

  const rek1HTML = reklam1
    ? '<div class="ads-bar">' + (hrefreklam1 ? '<a href="' + hrefreklam1 + '" target="_blank"><img src="' + reklam1 + '" alt="reklam"/></a>' : '<img src="' + reklam1 + '" alt="reklam"/>') + '</div>'
    : '';
  const rek4HTML = reklam4
    ? '<div class="ads-bar">' + (hrefreklam4 ? '<a href="' + hrefreklam4 + '" target="_blank"><img src="' + reklam4 + '" alt="reklam"/></a>' : '<img src="' + reklam4 + '" alt="reklam"/>') + '</div>'
    : '';
  const rek2HTML = reklam2
    ? '<div class="ads-bar">' + (hrefreklam2 ? '<a href="' + hrefreklam2 + '" target="_blank"><img src="' + reklam2 + '" alt="reklam"/></a>' : '<img src="' + reklam2 + '" alt="reklam"/>') + '</div>'
    : '';
  const rek5HTML = reklam5
    ? '<div class="ads-bar">' + (hrefreklam5 ? '<a href="' + hrefreklam5 + '" target="_blank"><img src="' + reklam5 + '" alt="reklam"/></a>' : '<img src="' + reklam5 + '" alt="reklam"/>') + '</div>'
    : '';
  const rek6HTML = reklam6
    ? '<div class="sticky-ad" id="stickyAd"><div class="sticky-ad-inner"><button class="sticky-close" onclick="document.getElementById(\'stickyAd\').style.display=\'none\'">×</button>' +
      (hrefreklam6 ? '<a href="' + hrefreklam6 + '" target="_blank"><img src="' + reklam6 + '" alt="reklam"/></a>' : '<img src="' + reklam6 + '" alt="reklam"/>') +
      '</div></div>'
    : '';

  const pageskinHTML = hrefpageskin
    ? '<a href="' + hrefpageskin + '" target="_blank" rel="noopener"><div class="sayfa-arka nomobile"></div></a>'
    : '<div class="sayfa-arka nomobile"></div>';

  const scoreboardHTML = canlisonuc == 0
    ? '<div class="scoreboard-wrap"><iframe src="https://www.sporx.com/_iframe/mac-merkezi/scoreboard.php"></iframe><div class="scoreboard-cover"></div></div>'
    : '';

  const twHTML = twitter ? '<a href="' + twitter + '" target="_blank" rel="noopener" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg></a>' : '';
  const igHTML = instagram ? '<a href="' + instagram + '" target="_blank" rel="noopener" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></a>' : '';
  const tgHTML = telegram ? '<a href="' + telegram + '" target="_blank" rel="noopener" aria-label="Telegram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"/></svg></a>' : '';
  const fbHTML = facebook ? '<a href="' + facebook + '" target="_blank" rel="noopener" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91V127.67c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S263.69 0 225.36 0C141.09 0 89.53 54.42 89.53 153.12v68.22H0V288h89.53v224h107.78V288z"/></svg></a>' : '';
  const ytHTML = youtube ? '<a href="' + youtube + '" target="_blank" rel="noopener" aria-label="YouTube"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="16" height="16"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.764-42.232-48.339-48.518C456.994 64 288 64 288 64s-168.994 0-213.316 11.565c-23.575 6.286-42.058 24.868-48.339 48.518C16 168.428 16 256 16 256s0 87.572 10.345 131.917c6.281 23.65 24.764 42.232 48.339 48.518C119.006 448 288 448 288 448s168.994 0 213.316-11.565c23.575-6.286 42.058-24.868 48.339-48.518C560 343.572 560 256 560 256s0-87.572-10.345-131.917zM232 336V176l142.857 80L232 336z"/></svg></a>' : '';

  const mUrl = matchesUrl || 'https://teletv5.top/load/matches.php';
  const cUrl = channelsUrl || 'https://teletv5.top/load/channels.php';

  return '<!DOCTYPE html>\n' +
'<html lang="tr">\n' +
'<head>\n' +
'<meta http-equiv="content-type" content="text/html;charset=UTF-8"/>\n' +
'<meta charset="utf-8">\n' +
'<meta content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" name="viewport"/>\n' +
'<title>' + title + '</title>\n' +
'<meta name="description" content="' + description + '"/>\n' +
'<meta property="og:title" content="' + title + '"/>\n' +
'<meta property="og:description" content="' + description + '"/>\n' +
'<meta property="og:type" content="website"/>\n' +
'<link rel="shortcut icon" href="' + favicon + '" type="image/x-icon"/>\n' +
'<link rel="amphtml" href="' + amp + '">\n' +
'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>\n' +
'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>\n' +
headerapi + '\n' +
analyticsapi + '\n' +
'<style>\n' +
'*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n' +
':root{--bg-primary:#0f1117;--bg-secondary:#1a1d27;--bg-card:#1e2230;--bg-hover:#252a3a;--accent:#f5a623;--accent2:#e8415a;--text-primary:#ffffff;--text-secondary:#a0a8c0;--text-muted:#6b7280;--border:rgba(255,255,255,0.08);--radius:10px;--radius-sm:6px}\n' +
'html,body{background:var(--bg-primary);color:var(--text-primary);font-family:Inter,sans-serif;min-height:100vh}\n' +
'.sayfa-arka{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;background:url(' + reklam3 + ') ' + pageskincolor + ' no-repeat center top fixed;background-size:cover}\n' +
'@media(max-width:768px){.sayfa-arka,.nomobile{display:none}}\n' +
'.top-bar{background:var(--accent2);padding:6px 16px;display:flex;justify-content:space-between;align-items:center;font-size:12px;flex-wrap:wrap;gap:6px}\n' +
'.top-bar a{color:#fff;text-decoration:none;font-weight:600}\n' +
'.social-icons{display:flex;gap:10px;align-items:center}\n' +
'.social-icons a{color:#fff;opacity:.85;transition:opacity .2s}\n' +
'.social-icons a:hover{opacity:1}\n' +
'header{background:var(--bg-secondary);border-bottom:1px solid var(--border);padding:10px 16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}\n' +
'.header-logo img{height:40px;width:auto;object-fit:contain}\n' +
'nav{display:flex;gap:4px;flex-wrap:wrap;flex:1}\n' +
'nav a{color:var(--text-secondary);text-decoration:none;font-size:13px;font-weight:500;padding:6px 12px;border-radius:var(--radius-sm);transition:all .2s;white-space:nowrap}\n' +
'nav a:hover{background:var(--bg-hover);color:var(--text-primary)}\n' +
'.ads-bar{margin:8px 12px;text-align:center}\n' +
'.ads-bar img{max-width:100%;border-radius:var(--radius-sm)}\n' +
'.channels-strip{background:var(--bg-secondary);border-bottom:1px solid var(--border);padding:10px 12px;overflow-x:auto;scrollbar-width:none}\n' +
'.channels-strip::-webkit-scrollbar{display:none}\n' +
'.channels-inner{display:flex;gap:8px;width:max-content}\n' +
'.channel-btn{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:6px 10px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px;white-space:nowrap;color:var(--text-secondary);font-size:12px}\n' +
'.channel-btn:hover,.channel-btn.active{background:var(--accent);border-color:var(--accent);color:#000;font-weight:600}\n' +
'.channel-btn img{height:22px;width:auto;object-fit:contain;border-radius:3px}\n' +
'.main-layout{display:grid;grid-template-columns:1fr 360px;gap:12px;padding:12px;max-width:1280px;margin:0 auto;align-items:flex-start}\n' +
'@media(max-width:900px){.main-layout{grid-template-columns:1fr}.sidebar{order:2}.player-col{order:1}}\n' +
'.player-wrapper{background:#000;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/9;position:relative}\n' +
'.player-wrapper iframe{width:100%;height:100%;border:none;display:block}\n' +
'.sidebar-box{background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}\n' +
'.tab-bar{display:flex;border-bottom:1px solid var(--border)}\n' +
'.tab-btn{flex:1;padding:11px;text-align:center;cursor:pointer;font-size:13px;font-weight:500;color:var(--text-secondary);border-bottom:2px solid transparent;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px}\n' +
'.tab-btn.active{color:var(--accent);border-bottom-color:var(--accent)}\n' +
'.blink-dot{width:7px;height:7px;background:#e8415a;border-radius:50%;animation:blink 1.2s infinite}\n' +
'@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}\n' +
'.search-wrap{padding:8px;border-bottom:1px solid var(--border);position:relative}\n' +
'.search-wrap input{width:100%;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:7px 34px 7px 10px;color:var(--text-primary);font-size:13px;outline:none}\n' +
'.search-wrap input::placeholder{color:var(--text-muted)}\n' +
'.search-wrap .s-icon{position:absolute;right:18px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:13px;pointer-events:none}\n' +
'.sport-filter{display:flex;gap:4px;padding:6px 8px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid var(--border)}\n' +
'.sport-filter::-webkit-scrollbar{display:none}\n' +
'.sport-btn{background:var(--bg-card);border:1px solid var(--border);border-radius:20px;padding:4px 10px;font-size:11px;color:var(--text-secondary);cursor:pointer;white-space:nowrap;transition:all .2s}\n' +
'.sport-btn:hover,.sport-btn.active{background:var(--accent);border-color:var(--accent);color:#000;font-weight:600}\n' +
'.matches-scroll{max-height:520px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--border) transparent}\n' +
'#matchList a.single-match,#matches-content a.single-match{display:flex;align-items:center;gap:8px;padding:8px 10px;text-decoration:none;color:var(--text-primary);border-bottom:1px solid var(--border);transition:background .15s;cursor:pointer}\n' +
'#matchList a.single-match:hover,#matches-content a.single-match:hover{background:var(--bg-hover)}\n' +
'#matchList a.single-match:nth-child(odd),#matches-content a.single-match:nth-child(odd){background:rgba(255,255,255,0.03)}\n' +
'.single-match .match-detail{flex:1;min-width:0}\n' +
'.single-match .match-detail .date{font-size:10px;color:var(--accent);font-weight:600;text-transform:uppercase;margin-bottom:1px}\n' +
'.single-match .match-detail .event{font-size:10px;color:var(--text-muted);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n' +
'.single-match .match-detail .teams{display:flex;flex-direction:column;gap:1px}\n' +
'.single-match .match-detail .teams .home,.single-match .match-detail .teams .away{font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n' +
'.single-match .match-detail .teams .away{color:var(--text-secondary)}\n' +
'.single-match img{width:20px;height:20px;object-fit:contain;flex-shrink:0;border-radius:2px}\n' +
'#channels-content a.single-match{display:flex;align-items:center;gap:10px;padding:10px;text-decoration:none;color:var(--text-primary);border-bottom:1px solid var(--border);transition:background .15s}\n' +
'#channels-content a.single-match:hover{background:var(--bg-hover)}\n' +
'footer{background:var(--bg-secondary);border-top:1px solid var(--border);margin-top:20px;padding:20px 16px;text-align:center}\n' +
'.footer-nav{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:14px}\n' +
'.footer-nav a{color:var(--text-secondary);text-decoration:none;font-size:13px}\n' +
'.footer-nav a:hover{color:var(--accent)}\n' +
'.footer-logo img{height:36px;margin-bottom:10px}\n' +
'.footer-copy{color:var(--text-muted);font-size:12px}\n' +
'.sticky-ad{position:fixed;bottom:0;left:0;width:100%;text-align:center;z-index:999999}\n' +
'.sticky-ad-inner{position:relative;display:inline-block;max-width:100%}\n' +
'.sticky-close{position:absolute;top:5px;right:5px;background:#49de80;color:#000;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;z-index:2;font-weight:bold;border:none}\n' +
'.scoreboard-wrap{position:relative;width:100%;height:150px;margin-top:12px}\n' +
'.scoreboard-wrap iframe{width:100%;height:100%;border:none}\n' +
'.scoreboard-cover{position:absolute;top:0;left:0;width:100%;height:100%;background:transparent;z-index:9999}\n' +
'</style>\n' +
'</head>\n' +
'<body>\n' +
bodyapi + '\n' +
pageskinHTML + '\n' +
'<div class="top-bar">\n' +
'<span>Güncel: <a href="https://' + hostname + '">' + hostname + '</a> &nbsp;|&nbsp; Sonraki: <a href="https://' + nextDomain + '">' + nextDomain + '</a></span>\n' +
'<div class="social-icons">' + twHTML + igHTML + tgHTML + fbHTML + ytHTML + '</div>\n' +
'</div>\n' +
'<header>\n' +
'<a href="/" class="header-logo"><img src="' + logo + '" alt="logo" width="' + logowidth + '" height="' + logoheight + '" loading="lazy"/></a>\n' +
'<nav>' + menuHTML + '</nav>\n' +
'</header>\n' +
rek1HTML + rek4HTML +
'<div class="channels-strip"><div class="channels-inner">' + kanalHTML + '</div></div>\n' +
'<div class="main-layout">\n' +
'<div class="player-col">\n' +
'<div class="player-wrapper"><iframe id="macth-video" name="macth-video" src="matches?id=bein-sports-1" allowfullscreen scrolling="no"></iframe></div>\n' +
rek2HTML + rek5HTML +
'</div>\n' +
'<div class="sidebar"><div class="sidebar-box">\n' +
'<div class="tab-bar">\n' +
'<div class="tab-btn active" id="tab-mac" onclick="switchTab(\'mac\')"><div class="blink-dot"></div> Maçlar</div>\n' +
'<div class="tab-btn" id="tab-kanal" onclick="switchTab(\'kanal\')">Kanallar</div>\n' +
'</div>\n' +
'<div class="search-wrap"><input type="text" id="searchInput" placeholder="Maç veya kanal ara..."/><i class="fas fa-search s-icon"></i></div>\n' +
'<div class="sport-filter" id="sportFilter">\n' +
'<button class="sport-btn active" data-filter="Futbol,Futbol TR,Football,FutboI,Basketbol,Basketbol TR,BasketboI">Tümü</button>\n' +
'<button class="sport-btn" data-filter="Futbol,Futbol TR,Football,FutboI">Futbol</button>\n' +
'<button class="sport-btn" data-filter="Basketbol,Basketbol TR,BasketboI">Basketbol</button>\n' +
'<button class="sport-btn" data-filter="Tenis">Tenis</button>\n' +
'<button class="sport-btn" data-filter="Voleybol">Voleybol</button>\n' +
'<button class="sport-btn" data-filter="Masa Tenisi">M.Tenis</button>\n' +
'<button class="sport-btn" data-filter="e-Sporlar">e-Spor</button>\n' +
'</div>\n' +
'<div id="tab-content-mac" class="matches-scroll"><div id="matches-content"></div></div>\n' +
'<div id="tab-content-kanal" style="display:none"><div id="channels-content"></div></div>\n' +
'</div></div>\n' +
'</div>\n' +
'<footer>\n' +
'<div class="footer-nav">' + footerMenuHTML + '</div>\n' +
scoreboardHTML +
'<div class="footer-logo"><img src="' + logo + '" alt="logo"/></div>\n' +
'<div class="footer-copy">' + footermetin + '</div>\n' +
footerapi + '\n' +
apilinkcikisi + '\n' +
'</footer>\n' +
rek6HTML +
'<script>\n' +
'function switchTab(tab){\n' +
'  var isMac=tab==="mac";\n' +
'  document.getElementById("tab-content-mac").style.display=isMac?"block":"none";\n' +
'  document.getElementById("tab-content-kanal").style.display=isMac?"none":"block";\n' +
'  document.getElementById("tab-mac").classList.toggle("active",isMac);\n' +
'  document.getElementById("tab-kanal").classList.toggle("active",!isMac);\n' +
'  document.getElementById("sportFilter").style.display=isMac?"flex":"none";\n' +
'}\n' +
'function kanalSec(id){\n' +
'  document.querySelectorAll(".channel-btn").forEach(function(b){b.classList.remove("active")});\n' +
'  var el=document.querySelector("[data-kanal=\'"+id+"\']");\n' +
'  if(el)el.classList.add("active");\n' +
'  var iframe=document.getElementById("macth-video");\n' +
'  if(iframe)iframe.src="matches?id="+id;\n' +
'}\n' +
'document.querySelectorAll(".sport-btn").forEach(function(btn){\n' +
'  btn.addEventListener("click",function(){\n' +
'    document.querySelectorAll(".sport-btn").forEach(function(b){b.classList.remove("active")});\n' +
'    this.classList.add("active");\n' +
'    filterMatches(this.dataset.filter);\n' +
'  });\n' +
'});\n' +
'function filterMatches(categoryStr){\n' +
'  var filters=categoryStr.split(",").map(function(f){return f.trim().toLowerCase()});\n' +
'  document.querySelectorAll("#matches-content .single-match").forEach(function(match){\n' +
'    var type=(match.getAttribute("data-matchtype")||"").toLowerCase();\n' +
'    match.style.display=filters.includes(type)?"":"none";\n' +
'  });\n' +
'}\n' +
'document.getElementById("searchInput").addEventListener("keyup",function(){\n' +
'  var q=this.value.toLowerCase();\n' +
'  document.querySelectorAll(".single-match").forEach(function(el){\n' +
'    el.style.display=el.textContent.toLowerCase().includes(q)?"":"none";\n' +
'  });\n' +
'});\n' +
'fetch("' + mUrl + '").then(function(r){return r.text()}).then(function(data){\n' +
'  document.getElementById("matches-content").innerHTML=data;\n' +
'  filterMatches("Futbol,Futbol TR,Football,FutboI,Basketbol,Basketbol TR,BasketboI");\n' +
'}).catch(function(e){console.error(e)});\n' +
'fetch("' + cUrl + '").then(function(r){return r.text()}).then(function(data){\n' +
'  document.getElementById("channels-content").innerHTML=data;\n' +
'}).catch(function(e){console.error(e)});\n' +
'<\/script>\n' +
'</body>\n' +
'</html>';
}
