export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // /dimg/dosya.png kısmından dosya yolunu al
  const filePath = url.pathname.replace(/^\/dimg\/?/i, "");

  if (!filePath) {
    return new Response("Dosya bulunamadı", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=UTF-8"
      }
    });
  }

  // Aynı dosyayı API hosting üzerinden çağır
  const targetUrl = "https://api.altinoksoft.com/dimg/" + filePath + url.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("accept-encoding");
  headers.delete("content-length");

  const apiResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
    redirect: "follow",
    cf: {
      cacheTtl: 300,
      cacheEverything: true
    }
  });

  const responseHeaders = new Headers(apiResponse.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  responseHeaders.set("x-altinok-dimg-proxy", "active");

  return new Response(apiResponse.body, {
    status: apiResponse.status,
    statusText: apiResponse.statusText,
    headers: responseHeaders
  });
}
