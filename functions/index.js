export async function onRequest(context) {
    return new Response("Merhaba! Pages calisiyor!", {
        headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
}
