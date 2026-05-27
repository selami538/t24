export async function onRequest(context) {
  return new Response("Worker calisiyor!", {
    headers: { "Content-Type": "text/plain; charset=UTF-8" }
  });
}
