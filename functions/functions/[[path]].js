export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  if (hostname.startsWith("www.")) {
    const newHost = hostname.replace(/^www\./, "");
    return Response.redirect(`${url.protocol}//${newHost}${pathname}${url.search}`, 301);
  }

  /*
    1) STATİK DOSYALAR
    Bunlarda tema API çağırma.
    Direkt api.altinoksoft.com üzerinden çek ve Cloudflare cache'e koy.
  */
  const isStatic =
    /\.(css|js|mjs|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|map|mp4|webm|txt|xml)$/i.test(pathname) ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/wp-content/") ||
    pathname.startsWith("/dimg/");

  if (isStatic) {
    const targetUrl = "https://api.altinoksoft.com" + pathname + url.search;

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("accept-encoding");
    headers.delete("content-length");

    const originResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
      redirect: "follow",
      cf: {
        cacheTtl: 86400,
        cacheEverything: true
      }
    });

    const responseHeaders = new Headers(originResponse.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");
    responseHeaders.set("cache-control", "public, max-age=86400");
    responseHeaders.set("x-altinok-static-proxy", "cache-active");

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers: responseHeaders
    });
  }

  /*
    2) HTML / PHP SAYFALAR
    Sadece burada tema API çalışsın.
  */
  let json = {};
  try {
    const apiResponse = await fetch("https://api.altinoksoft.com/api/verirepo.php", {
      cf: {
        cacheTtl: 30,
        cacheEverything: true
      }
    });
    json = await apiResponse.json();
  } catch (e) {
    console.error("Tema API hatası:", e);
  }

  const aktifTema = parseInt(json?.tema?.tema_sec ?? 0);

  if (aktifTema === 0 || aktifTema === 1) {
    let targetPath = pathname;
    let targetSearch = url.search;

    const izleMatch = pathname.match(/^\/izle\/([^\/?#]+)\/?$/i);

    if (aktifTema === 1 && izleMatch) {
      const yayinSeo = decodeURIComponent(izleMatch[1]);

      targetPath = "/izle.php";

      const params = new URLSearchParams(url.search);
      params.set("yayin_seo", yayinSeo);
      params.set("public_host", hostname);

      targetSearch = "?" + params.toString();
    } else {
      const params = new URLSearchParams(url.search);
      if (!params.has("public_host")) {
        params.set("public_host", hostname);
      }
      targetSearch = "?" + params.toString();
    }

    const phpUrl = "https://api.altinoksoft.com" + targetPath + targetSearch;

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("accept-encoding");
    headers.delete("content-length");

    headers.set("x-forwarded-host", hostname);
    headers.set("x-public-host", hostname);
    headers.set("x-original-uri", pathname + url.search);

    const phpResponse = await fetch(phpUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
      redirect: "follow",
      cf: {
        cacheTtl: 10,
        cacheEverything: true
      }
    });

    const responseHeaders = new Headers(phpResponse.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");

    responseHeaders.set("cache-control", "public, max-age=10");
    responseHeaders.set("x-altinok-proxy", "php-theme-proxy-html-cache");

    return new Response(phpResponse.body, {
      status: phpResponse.status,
      statusText: phpResponse.statusText,
      headers: responseHeaders
    });
  }

  return env.ASSETS.fetch(request);
}
