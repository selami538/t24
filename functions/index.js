// Cloudflare Pages Function: functions/[[path]].js
// API/PHP gerektirmeyen geçici maç sayfası.
export async function onRequest({ request }) {
  const url = new URL(request.url);
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }
  const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Galatasaray - Amedspor | Canlı Yayın</title>
<meta name="description" content="Galatasaray - Amedspor maç yayın sayfası. Yayın Türkiye ile sınırlıdır.">
<style>
*{box-sizing:border-box}body{margin:0;background:#0b1020;color:#f4f6ff;font:16px Arial,sans-serif}
header{background:#131c31;border-bottom:1px solid #29334a;padding:20px;text-align:center}
header strong{font-size:25px}.wrap{max-width:1050px;margin:auto;padding:20px 14px}
.notice{background:#33291a;border:1px solid #7c5a24;color:#ffe2a1;padding:14px;border-radius:10px;text-align:center;margin:18px 0}
h1{text-align:center;font-size:clamp(23px,4vw,36px);margin:24px 0 8px}
.sub{text-align:center;color:#9baac4;margin-bottom:20px}
.ad{height:100px;border:2px dashed #45516a;border-radius:12px;background:#141e31;display:flex;align-items:center;justify-content:center;color:#a6b4cc;margin:20px auto;overflow:hidden;text-align:center}
.ad img{display:block;max-width:100%;max-height:100%;object-fit:contain}
.player-shell{background:#000;border:1px solid #33405b;border-radius:12px;overflow:hidden;aspect-ratio:16/9;position:relative}
#player{width:100%;height:100%}.foot{text-align:center;color:#93a0b8;padding:28px 12px;font-size:13px}
@media(max-width:600px){.ad{height:80px}.wrap{padding:12px}header strong{font-size:20px}}
</style>
<script src="https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js"></script>
</head><body>
<header><strong>⚽ CANLI MAÇ YAYINI</strong></header>
<main class="wrap">
<div class="notice">🌍 Yayın yalnızca Türkiye'den erişime açıktır. Yurt dışı erişimi kapalıdır.</div>
<div class="ad" id="banner1">REKLAM ALANI 1 — ÜST BANNER</div>
<h1>Galatasaray - Amedspor</h1><p class="sub">Canlı yayın • Maç ekranı</p>
<div class="player-shell"><div id="player"></div></div>
<div class="ad" id="banner2">REKLAM ALANI 2 — ALT BANNER</div>
</main><footer class="foot">Geçici yayın sayfası • Yayın erişimi bölgesel kısıtlamalara tabi olabilir.</footer>
<script>
// Banner eklemek için örnek:
// document.getElementById('banner1').innerHTML = '<a href="https://example.com"><img src="https://example.com/banner.jpg" alt="Reklam"></a>';
// document.getElementById('banner2').innerHTML = '<a href="https://example.com"><img src="https://example.com/banner2.jpg" alt="Reklam"></a>';
if(window.Clappr){
  new Clappr.Player({
    source:'https://css.d6e3eds5e065t5.help//hls/b1.m3u8',
    parentId:'#player',width:'100%',height:'100%',
    autoPlay:false,mute:false,playInline:true,
    mimeType:'application/vnd.apple.mpegurl'
  });
}else{
  document.getElementById('player').innerHTML='<p style="padding:20px;color:white">Oynatıcı yüklenemedi. Sayfayı yenileyin.</p>';
}
</script></body></html>`;
  return new Response(html, {headers: {'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
}
