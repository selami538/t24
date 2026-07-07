export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  const yayinSeo =
    params.yayin_seo ||
    url.pathname.split('/').filter(Boolean).pop() ||
    '';

  if (!yayinSeo) {
    return Response.redirect(`${url.origin}/`, 302);
  }

  const targetUrl = new URL('https://api.altinoksoft.com/izle.php');
  targetUrl.searchParams.set('yayin_seo', yayinSeo);

  url.searchParams.forEach((value, key) => {
    if (key !== 'yayin_seo') {
      targetUrl.searchParams.set(key, value);
    }
  });

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('accept-encoding');
  headers.delete('content-length');

  headers.set('x-forwarded-host', url.hostname);
  headers.set('x-original-uri', url.pathname + url.search);

  const phpResponse = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
    redirect: 'follow'
  });

  const responseHeaders = new Headers(phpResponse.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');

  responseHeaders.set('x-altinok-route', 'izle-yayin-seo-proxy');

  return new Response(phpResponse.body, {
    status: phpResponse.status,
    statusText: phpResponse.statusText,
    headers: responseHeaders
  });
}
