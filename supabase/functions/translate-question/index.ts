const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        status: 200,
        headers: corsHeaders
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const body = await req.json();

    const {
      text,
      source_language,
      target_language
    } = body;

    if (!text || !target_language) {
      return new Response(
        JSON.stringify({
          error: "text and target_language are required"
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (source_language === target_language) {
      return new Response(
        JSON.stringify({
          success: true,
          source_language,
          target_language,
          translated_text: text
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const source = source_language || "en";

    const params = new URLSearchParams({
      q: text,
      langpair: `${source}|${target_language}`,
      mt: "1"
    });

    const response = await fetch(
      `https://api.mymemory.translated.net/get?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `MyMemory HTTP ${response.status}`
      );
    }

    const data = await response.json();

    const translatedText =
      data?.responseData?.translatedText;

    if (!translatedText) {
      throw new Error("Translation not returned");
    }

    return new Response(
      JSON.stringify({
        success: true,
        source_language: source,
        target_language,
        translated_text: translatedText
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("translate-question error:", error);

    return new Response(
      JSON.stringify({
        error: "Translation failed"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
