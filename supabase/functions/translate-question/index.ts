Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const body = await req.json();

    const {
      text,
      original_language,
      target_languages = ["ru", "pl", "en"]
    } = body;

    if (!text || !original_language) {
      return new Response(
        JSON.stringify({
          error: "text and original_language are required"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        original_language,
        text_original: text,
        translations: Object.fromEntries(
          target_languages.map((lang: string) => [
            lang,
            lang === original_language ? text : null
          ])
        )
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("translate-question error:", error);

    return new Response(
      JSON.stringify({
        error: "Invalid request"
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});
