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

  // Sabit kanal logoları
  const kanallar = [
    { ad: "S Sport 1",    img: "https://piabettv21.live/assets/v5/images/s-sport.png",     id: "s-sport-1" },
    { ad: "S Sport 2",    img: "https://piabettv21.live/assets/v5/images/s-sport-2.png",    id: "s-sport-2" },
    { ad: "A Spor",       img: "https://piabettv21.live/assets/v5/images/a-spor.png",       id: "a-spor" },
    { ad: "Spor Smart",   img: "https://piabettv21.live/assets/v5/images/spor-smart.png",   id: "spor-smart" },
    { ad: "Tivibu Spor 1",img: "https://piabettv21.live/assets/v5/images/tivibu-spor-1.png",id: "tivibu-spor-1" },
    { ad: "Tivibu Spor 2",img: "https://piabettv21.live/assets/v5/images/tivibu-spor-2.png",id: "tivibu-spor-2" },
    { ad: "Tivibu Spor 3",img: "https://piabettv21.live/assets/v5/images/tivibu-spor-3.png",id: "tivibu-spor-3" },
    { ad: "Bein Sports 1",img: "https://piabettv21.live/assets/v5/images/bein-sports-1.png",id: "bein-sports-1" },
    { ad: "Bein Sports 2",img: "https://piabettv21.live/assets/v5/images/bein-sports-2.png",id: "bein-sports-2" },
    { ad: "Bein Sports 3",img: "https://piabettv21.live/assets/v5/images/bein-sports-3.png",id: "bein-sports-3" },
    { ad: "Bein Sports 4",img: "https://piabettv21.live/assets/v5/images/bein-sports-4.png",id: "bein-sports-4" },
  ];

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta http-equiv="content-type" content="text/html;charset=UTF-8"/>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" name="viewport"/>
<meta http-equiv="X-UA-Compatible" content="ie=edge"/>
<title>${title}</title>
<meta name="description" content="${description}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${description}"/>
<meta property="og:type" content="website"/>
<link rel="shortcut icon" href="${favicon}" type="image/x-icon"/>
<link rel="amphtml" href="${amp}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
${headerapi}
${analyticsapi}
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-primary: #0f1117;
    --bg-secondary: #1a1d27;
    --bg-card: #1e2230;
    --bg-hover: #252a3a;
    --accent: #f5a623;
    --accent2: #e8415a;
    --text-primary: #ffffff;
    --text-secondary: #a0a8c0;
    --text-muted: #6b7280;
    --border: rgba(255,255,255,0.08);
    --radius: 10px;
    --radius-sm: 6px;
  }

  html, body { background: var(--bg-primary); color: var(--text-primary); font-family: 'Inter', sans-serif; min-height: 100vh; }

  /* SAYFA ARKA */
  .sayfa-arka {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2;
    background: url(${reklam3}) ${pageskincolor} no-repeat center top fixed;
    background-size: cover;
  }
  @media (max-width: 768px) { .sayfa-arka, .nomobile { display: none; } }

  /* TOP BAR */
  .top-bar {
    background: var(--accent2);
    padding: 6px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    flex-wrap: wrap;
    gap: 6px;
  }
  .top-bar a { color: #fff; text-decoration: none; font-weight: 600; }
  .top-bar a:hover { text-decoration: underline; }
  .social-icons { display: flex; gap: 10px; align-items: center; }
  .social-icons a { color: #fff; opacity: 0.85; transition: opacity 0.2s; }
  .social-icons a:hover { opacity: 1; }

  /* HEADER */
  header {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .header-logo img { height: 40px; width: auto; object-fit: contain; }
  nav { display: flex; gap: 4px; flex-wrap: wrap; flex: 1; }
  nav a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    transition: all 0.2s;
    white-space: nowrap;
  }
  nav a:hover { background: var(--bg-hover); color: var(--text-primary); }
  nav a.active { background: var(--accent); color: #000; font-weight: 600; }

  /* REKLAM */
  .ads-bar { margin: 8px 12px; text-align: center; }
  .ads-bar img { max-width: 100%; border-radius: var(--radius-sm); }

  /* KANAL SLIDER */
  .channels-strip {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: 10px 12px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .channels-strip::-webkit-scrollbar { display: none; }
  .channels-inner { display: flex; gap: 8px; width: max-content; }
  .channel-btn {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 6px 10px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    color: var(--text-secondary);
    font-size: 12px;
  }
  .channel-btn:hover, .channel-btn.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #000;
    font-weight: 600;
  }
  .channel-btn img { height: 22px; width: auto; object-fit: contain; border-radius: 3px; }

  /* ANA İÇERİK */
  .main-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 12px;
    padding: 12px;
    max-width: 1280px;
    margin: 0 auto;
    align-items: flex-start;
  }
  @media (max-width: 900px) {
    .main-layout { grid-template-columns: 1fr; }
    .sidebar { order: 2; }
    .player-col { order: 1; }
  }

  /* PLAYER */
  .player-col {}
  .player-wrapper {
    background: #000;
    border-radius: var(--radius);
    overflow: hidden;
    aspect-ratio: 16/9;
    position: relative;
  }
  .player-wrapper iframe { width: 100%; height: 100%; border: none; display: block; }

  /* SIDEBAR */
  .sidebar {}
  .sidebar-box {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  /* TAB */
  .tab-bar {
    display: flex;
    border-bottom: 1px solid var(--border);
  }
  .tab-btn {
    flex: 1;
    padding: 11px;
    text-align: center;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
  .blink-dot {
    width: 7px; height: 7px;
    background: #e8415a;
    border-radius: 50%;
    animation: blink 1.2s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

  /* SEARCH */
  .search-wrap {
    padding: 8px;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .search-wrap input {
    width: 100%;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 7px 34px 7px 10px;
    color: var(--text-primary);
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-wrap input:focus { border-color: var(--accent); }
  .search-wrap input::placeholder { color: var(--text-muted); }
  .search-wrap .s-icon { position: absolute; right: 18px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 13px; pointer-events: none; }

  /* SPORT FILTER */
  .sport-filter {
    display: flex;
    gap: 4px;
    padding: 6px 8px;
    overflow-x: auto;
    scrollbar-width: none;
    border-bottom: 1px solid var(--border);
  }
  .sport-filter::-webkit-scrollbar { display: none; }
  .sport-btn {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    color: var(--text-secondary);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .sport-btn:hover, .sport-btn.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #000;
    font-weight: 600;
  }
  .sport-btn svg { flex-shrink: 0; }

  /* MAÇ LİSTESİ */
  .matches-scroll { max-height: 520px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }

  /* FOOTER */
  footer {
    background: var(--bg-secondary);
    border-top: 1px solid var(--border);
    margin-top: 20px;
    padding: 20px 16px;
    text-align: center;
  }
  .footer-nav { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 14px; }
  .footer-nav a { color: var(--text-secondary); text-decoration: none; font-size: 13px; transition: color 0.2s; }
  .footer-nav a:hover { color: var(--accent); }
  .footer-logo img { height: 36px; margin-bottom: 10px; }
  .footer-copy { color: var(--text-muted); font-size: 12px; }

  /* BOTTOM STICKY AD */
  .sticky-ad {
    position: fixed; bottom: 0; left: 0; width: 100%;
    text-align: center; z-index: 999999;
  }
  .sticky-ad-inner { position: relative; display: inline-block; max-width: 100%; }
  .sticky-close {
    position: absolute; top: 5px; right: 5px;
    background: #49de80; color: #000;
    width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; cursor: pointer; z-index: 2; font-weight: bold;
    border: none;
  }
  .sticky-ad img { max-width: 100%; height: auto; display: block; }

  /* SCOREBOARD */
  .scoreboard-wrap { position: relative; width: 100%; height: 150px; margin-top: 12px; }
  .scoreboard-wrap iframe { width: 100%; height: 100%; border: none; }
  .scoreboard-cover { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent; z-index: 9999; }
</style>
</head>
<body>
${bodyapi}

${hrefpageskin
  ? `<a href="${hrefpageskin}" target="_blank" rel="noopener"><div class="sayfa-arka nomobile"></div></a>`
  : `<div class="sayfa-arka nomobile"></div>`}

<!-- TOP BAR -->
<div class="top-bar">
  <span>Güncel: <a href="https://${hostname}">${hostname}</a> &nbsp;|&nbsp; Sonraki: <a href="https://${nextDomain}">${nextDomain}</a></span>
  <div class="social-icons">
    ${twitter ? `<a href="${twitter}" target="_blank" rel="noopener" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg></a>` : ''}
    ${instagram ? `<a href="${instagram}" target="_blank" rel="noopener" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></a>` : ''}
    ${telegram ? `<a href="${telegram}" target="_blank" rel="noopener" aria-label="Telegram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"/></svg></a>` : ''}
    ${facebook ? `<a href="${facebook}" target="_blank" rel="noopener" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91V127.67c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S263.69 0 225.36 0C141.09 0 89.53 54.42 89.53 153.12v68.22H0V288h89.53v224h107.78V288z"/></svg></a>` : ''}
    ${youtube ? `<a href="${youtube}" target="_blank" rel="noopener" aria-label="YouTube"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="16" height="16"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.764-42.232-48.339-48.518C456.994 64 288 64 288 64s-168.994 0-213.316 11.565c-23.575 6.286-42.058 24.868-48.339 48.518C16 168.428 16 256 16 256s0 87.572 10.345 131.917c6.281 23.65 24.764 42.232 48.339 48.518C119.006 448 288 448 288 448s168.994 0 213.316-11.565c23.575-6.286 42.058-24.868 48.339-48.518C560 343.572 560 256 560 256s0-87.572-10.345-131.917zM232 336V176l142.857 80L232 336z"/></svg></a>` : ''}
  </div>
</div>

<!-- HEADER -->
<header>
  <a href="/" class="header-logo"><img src="${logo}" alt="logo" width="${logowidth}" height="${logoheight}" loading="lazy"/></a>
  <nav>
    ${menuler.map(m => `<a href="${m.url}"><i class="${m.icon}"></i> ${m.ad}</a>`).join('')}
  </nav>
</header>

<!-- REKLAM ÜST -->
${reklam1 ? `<div class="ads-bar">${hrefreklam1 ? `<a href="${hrefreklam1}" target="_blank"><img src="${reklam1}" alt="reklam"/></a>` : `<img src="${reklam1}" alt="reklam"/>`}</div>` : ''}
${reklam4 ? `<div class="ads-bar">${hrefreklam4 ? `<a href="${hrefreklam4}" target="_blank"><img src="${reklam4}" alt="reklam"/></a>` : `<img src="${reklam4}" alt="reklam"/>`}</div>` : ''}

<!-- KANAL SLIDER -->
<div class="channels-strip">
  <div class="channels-inner" id="kanalStrip">
    ${kanallar.map(k => `
    <button class="channel-btn" data-kanal="${k.id}" onclick="kanalSec('${k.id}')">
      <img src="${k.img}" alt="${k.ad}" onerror="this.style.display='none'"/>
      ${k.ad}
    </button>`).join('')}
  </div>
</div>

<!-- ANA LAYOUT -->
<div class="main-layout">

  <!-- PLAYER -->
  <div class="player-col">
    <div class="player-wrapper">
      <iframe id="macth-video" name="macth-video" src="matches?id=bein-sports-1" allowfullscreen scrolling="no"></iframe>
    </div>
    <!-- REKLAM ALT PLAYER -->
    ${reklam2 ? `<div class="ads-bar">${hrefreklam2 ? `<a href="${hrefreklam2}" target="_blank"><img src="${reklam2}" alt="reklam"/></a>` : `<img src="${reklam2}" alt="reklam"/>`}</div>` : ''}
    ${reklam5 ? `<div class="ads-bar">${hrefreklam5 ? `<a href="${hrefreklam5}" target="_blank"><img src="${reklam5}" alt="reklam"/></a>` : `<img src="${reklam5}" alt="reklam"/>`}</div>` : ''}
  </div>

  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="sidebar-box">

      <!-- TAB BAR -->
      <div class="tab-bar">
        <div class="tab-btn active" id="tab-mac" onclick="switchTab('mac')">
          <div class="blink-dot"></div> Maçlar
        </div>
        <div class="tab-btn" id="tab-kanal" onclick="switchTab('kanal')">
          Kanallar
        </div>
      </div>

      <!-- ARAMA -->
      <div class="search-wrap">
        <input type="text" id="searchInput" placeholder="Maç veya kanal ara..."/>
        <i class="fas fa-search s-icon"></i>
      </div>

      <!-- SPOR FİLTRE -->
      <div class="sport-filter" id="sportFilter">
        <button class="sport-btn active" data-filter="Futbol,Futbol TR,Football,FutboI,Basketbol,Basketbol TR,BasketboI">
          Tümü
        </button>
        <button class="sport-btn" data-filter="Futbol,Futbol TR,Football,FutboI">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 32 32" fill="currentColor"><path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16c-0.010-8.832-7.168-15.99-16-16zM16.571 4.613l5.562-2.223c0.631 0.286 1.242 0.615 1.828 0.985l0.015 0.009c0.576 0.365 1.126 0.768 1.646 1.207l0.045 0.039c0.234 0.199 0.461 0.405 0.681 0.617 0.028 0.027 0.057 0.053 0.085 0.081 0.232 0.226 0.456 0.459 0.673 0.699 0.018 0.020 0.035 0.042 0.053 0.062 0.19 0.213 0.373 0.434 0.551 0.659 0.043 0.053 0.085 0.107 0.127 0.16 0.193 0.249 0.379 0.503 0.555 0.765l-1.109 4.714-5.455 1.819-5.255-4.205zM4.163 6.911c0.041-0.053 0.084-0.107 0.126-0.16 0.176-0.223 0.357-0.44 0.545-0.652 0.020-0.022 0.039-0.045 0.059-0.068 0.216-0.24 0.439-0.473 0.67-0.699 0.027-0.026 0.053-0.053 0.081-0.077 0.219-0.211 0.444-0.416 0.676-0.614l0.053-0.045c0.516-0.436 1.061-0.837 1.631-1.2l0.021-0.013c0.582-0.37 1.189-0.698 1.817-0.984l5.588 2.213v5.387l-5.255 4.204-5.455-1.815-1.109-4.714c0.178-0.261 0.362-0.515 0.554-0.763zM3.52 24.184c-0.157-0.239-0.307-0.483-0.45-0.731l-0.035-0.060c-0.142-0.247-0.277-0.498-0.404-0.753l-0.004-0.008c-0.267-0.536-0.502-1.089-0.702-1.653v-0.005c-0.095-0.267-0.181-0.54-0.261-0.815l-0.029-0.101c-0.073-0.258-0.14-0.519-0.199-0.783-0.005-0.026-0.012-0.050-0.017-0.076-0.131-0.596-0.225-1.199-0.282-1.806l3.256-3.907 5.418 1.806 1.572 6.289-2.584 3.438zM19.552 30.503c-0.267 0.066-0.54 0.123-0.814 0.174-0.038 0.008-0.077 0.014-0.116 0.021-0.233 0.042-0.469 0.077-0.705 0.107-0.063 0.008-0.126 0.017-0.188 0.024-0.219 0.026-0.441 0.045-0.663 0.061-0.070 0.005-0.139 0.012-0.209 0.016-0.284 0.017-0.57 0.028-0.858 0.028-0.264 0-0.526-0.007-0.787-0.021-0.031 0-0.062-0.005-0.093-0.008-0.232-0.013-0.463-0.031-0.694-0.053l-0.027-0.005c-0.505-0.055-1.007-0.135-1.504-0.24l-3.155-4.939 2.543-3.391h7.431l2.585 3.413zM30.585 19.2c-0.005 0.026-0.012 0.050-0.017 0.076-0.060 0.264-0.126 0.524-0.199 0.783l-0.029 0.101c-0.080 0.275-0.166 0.547-0.261 0.815v0.005c-0.201 0.565-0.435 1.117-0.702 1.653l-0.004 0.008c-0.128 0.255-0.262 0.506-0.404 0.753l-0.035 0.060c-0.142 0.249-0.292 0.492-0.449 0.73l-5.262 0.83-2.602-3.435 1.572-6.287 5.418-1.806 3.256 3.907c-0.056 0.608-0.151 1.211-0.282 1.808z"></path></svg>
          Futbol
        </button>
        <button class="sport-btn" data-filter="Basketbol,Basketbol TR,BasketboI">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 32 32" fill="currentColor"><path d="M10.098 11.425l-6.065-6.065c-2.473 2.774-3.886 6.272-4.033 9.995 3.762-0.060 7.298-1.439 10.098-3.93z"></path><path d="M11.425 10.098c2.49-2.8 3.869-6.336 3.93-10.098-3.723 0.147-7.22 1.56-9.995 4.033z"></path><path d="M16.009 6.177c-0.766 1.938-1.86 3.7-3.255 5.25l3.246 3.246 10.64-10.64c-2.629-2.343-5.906-3.735-9.41-4-0.035 2.114-0.444 4.178-1.221 6.144z"></path><path d="M31.967 14.77c-0.264-3.504-1.657-6.781-4-9.41l-10.64 10.64 3.246 3.246c1.55-1.395 3.312-2.489 5.25-3.255 1.966-0.777 4.032-1.186 6.144-1.221z"></path><path d="M21.902 20.575l6.065 6.065c2.473-2.774 3.886-6.272 4.033-9.995-3.761 0.061-7.298 1.44-10.098 3.93z"></path><path d="M20.575 21.902c-2.49 2.8-3.869 6.336-3.93 10.098 3.723-0.147 7.22-1.56 9.995-4.033z"></path><path d="M14.673 16l-3.246-3.246c-1.55 1.396-3.312 2.489-5.25 3.255-1.966 0.777-4.030 1.187-6.144 1.221 0.264 3.503 1.657 6.781 4 9.409z"></path><path d="M15.991 25.823c0.766-1.938 1.86-3.7 3.255-5.25l-3.246-3.246-10.64 10.64c2.629 2.343 5.906 3.735 9.41 4 0.035-2.114 0.444-4.178 1.221-6.144z"></path></svg>
          Basketbol
        </button>
        <button class="sport-btn" data-filter="Tenis">Tenis</button>
        <button class="sport-btn" data-filter="Voleybol">Voleybol</button>
        <button class="sport-btn" data-filter="Masa Tenisi">M.Tenis</button>
        <button class="sport-btn" data-filter="e-Sporlar">e-Spor</button>
      </div>

      <!-- MAÇ / KANAL İÇERİK -->
      <div id="tab-content-mac" class="matches-scroll">
        <div id="matches-content"></div>
      </div>
      <div id="tab-content-kanal" style="display:none;">
        <div id="channels-content"></div>
      </div>

    </div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-nav">
    ${menuler.map(m => `<a href="${m.url}" rel="noopener">${m.ad}</a>`).join('')}
  </div>
  ${canlisonuc == 0 ? `
  <div class="scoreboard-wrap">
    <iframe src="https://www.sporx.com/_iframe/mac-merkezi/scoreboard.php"></iframe>
    <div class="scoreboard-cover"></div>
  </div>` : ''}
  <div class="footer-logo"><img src="${logo}" alt="logo"/></div>
  <div class="footer-copy"><p>${footermetin}</p></div>
  ${footerapi}
  ${apilinkcikisi}
</footer>

<!-- STICKY REKLAM -->
${reklam6 ? `
<div class="sticky-ad" id="stickyAd">
  <div class="sticky-ad-inner">
    <button class="sticky-close" onclick="document.getElementById('stickyAd').style.display='none'">×</button>
    ${hrefreklam6 ? `<a href="${hrefreklam6}" target="_blank"><img src="${reklam6}" alt="reklam"/></a>` : `<img src="${reklam6}" alt="reklam"/>`}
  </div>
</div>` : ''}

<script>
// Tab geçişi
function switchTab(tab) {
  const isMac = tab === 'mac';
  document.getElementById('tab-content-mac').style.display = isMac ? 'block' : 'none';
  document.getElementById('tab-content-kanal').style.display = isMac ? 'none' : 'block';
  document.getElementById('tab-mac').classList.toggle('active', isMac);
  document.getElementById('tab-kanal').classList.toggle('active', !isMac);
  document.getElementById('sportFilter').style.display = isMac ? 'flex' : 'none';
}

// Kanal seçimi
function kanalSec(id) {
  document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-kanal="'+id+'"]')?.classList.add('active');
  const iframe = document.getElementById('macth-video');
  if (iframe) iframe.src = 'matches?id=' + id;
}

// Spor filtresi
document.querySelectorAll('.sport-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.sport-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    filterMatches(this.dataset.filter);
  });
});

function filterMatches(categoryStr) {
  const filters = categoryStr.split(',').map(f => f.trim().toLowerCase());
  document.querySelectorAll('#matches-content .single-match').forEach(match => {
    const type = (match.getAttribute('data-matchtype') || '').toLowerCase();
    match.style.display = filters.includes(type) ? '' : 'none';
  });
}

// Arama
document.getElementById('searchInput').addEventListener('keyup', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('.single-match, #channels-content .single-match').forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

// Maç ve kanal yükle
fetch('${matchesUrl || 'https://teletv5.top/load/matches.php'}')
  .then(r => r.text()).then(data => {
    document.getElementById('matches-content').innerHTML = data;
    filterMatches('Futbol,Futbol TR,Football,FutboI,Basketbol,Basketbol TR,BasketboI');
  }).catch(e => console.error(e));

fetch('${channelsUrl || 'https://teletv5.top/load/channels.php'}')
  .then(r => r.text()).then(data => {
    document.getElementById('channels-content').innerHTML = data;
  }).catch(e => console.error(e));
</script>

</body>
</html>`;
}
