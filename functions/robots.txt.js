export async function onRequest(context) {
  const { request } = context;
  const baseUrl = request.headers.get("X-Public-Origin") || new URL(request.url).origin;

  const content = `
User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
