export default {
  async fetch(request, env, ctx) {
    return new Response("Worker calisiyor!", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
