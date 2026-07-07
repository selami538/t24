export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // www varsa www'suz adrese yönlendir
  if (hostname.startsWith("www.")) {
    const newHost = hostname.replace(/^www\./, "");
    const redirectUrl = `${url.protocol}//${newHost}${url.pathname}${url.search}`;
    return Response.redirect(redirectUrl, 301);
  }

  // Tema bilgisini çek
  let json = {};
  try {
    const response = await fetch("https://api.altinoksoft.com/api/verirepo.php", {
      cf: {
        cacheTtl: 60,
        cacheEverything: true
      }
    });

    json = await response.json();
  } catch (e) {
    console.error("API hatası:", e);
  }

  const aktifTema = parseInt(json?.tema?.tema_sec ?? 0);

  /*
    TEMA 0 veya TEMA 1 ise:
    Bütün alt sayfaları PHP hosting'e gönder.
    Böylece CSS, JS, haber, spor-haberleri, wp-content, assets vs tek sistemden çalışır.
  */
  if (aktifTema === 0 || aktifTema === 1) {
    let targetPath = url.pathname;
    let targetSearch = url.search;

    /*
      Tema 1 özel izle linki:
      /izle/bein-sports-1
      ->
      /izle.php?yayin_seo=bein-sports-1
    */
    const izleMatch = url.pathname.match(/^\/izle\/([^\/?#]+)\/?$/i);

    if (aktifTema === 1 && izleMatch) {
      const yayinSeo = decodeURIComponent(izleMatch[1]);

      targetPath = "/izle.php";

      const params = new URLSearchParams(url.search);
      params.set("yayin_seo", yayinSeo);

      targetSearch = "?" + params.toString();
    }

    const phpUrl = "https://api.altinoksoft.com" + targetPath + targetSearch;

    const headers = new Headers(request.headers);
    headers.set("Host", "api.altinoksoft.com");
    headers.delete("accept-encoding");
    headers.delete("content-length");

    headers.set("x-forwarded-host", hostname);
    headers.set("x-original-host", hostname);
    headers.set("x-original-uri", url.pathname + url.search);

    const phpResponse = await fetch(phpUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
      redirect: "follow",
      cf: {
        cacheTtl: 0,
        cacheEverything: false
      }
    });

    const responseHeaders = new Headers(phpResponse.headers);
    const contentType = responseHeaders.get("content-type") || "";

    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");

    responseHeaders.set("x-altinok-proxy", "theme-php-catchall");

    // HTML/CSS/JS içinde api.altinoksoft.com geçerse ana domaine çevir
    const isText =
      contentType.includes("text/html") ||
      contentType.includes("text/css") ||
      contentType.includes("javascript") ||
      contentType.includes("application/json") ||
      targetPath.endsWith(".php");

    if (isText) {
      let body = await phpResponse.text();

      body = body
        .replaceAll("https://api.altinoksoft.com", `https://${hostname}`)
        .replaceAll("http://api.altinoksoft.com", `https://${hostname}`)
        .replaceAll("//api.altinoksoft.com", `//${hostname}`);

      return new Response(body, {
        status: phpResponse.status,
        statusText: phpResponse.statusText,
        headers: responseHeaders
      });
    }

    return new Response(phpResponse.body, {
      status: phpResponse.status,
      statusText: phpResponse.statusText,
      headers: responseHeaders
    });
  }

  /*
    Tema 2 veya 3 ise:
    Alt dosyaları Cloudflare Pages static asset olarak bırak.
    Ana sayfa zaten functions/index.js üzerinden çalışıyor.
  */
  return env.ASSETS.fetch(request);
}
