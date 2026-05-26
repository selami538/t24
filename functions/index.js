export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // GEÇİCİ TEST - direkt PHP'ye ilet
    const phpRequest = new Request(
      "http://87.236.19.13" + url.pathname + url.search,
      {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers),
          "Host": "altinoksoft.com"
        },
        body: ["GET", "HEAD"].includes(request.method) ? null : request.body
      }
    );
    return fetch(phpRequest);
  }
};
