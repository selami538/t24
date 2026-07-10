export async function onRequest(context) {
  const { request } = context;
  const baseUrl = request.headers.get("X-Public-Origin") || new URL(request.url).origin;

  // Statik ya da dinamik olarak ekleyebileceğin sayfalar
  const routes = ["/"];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
