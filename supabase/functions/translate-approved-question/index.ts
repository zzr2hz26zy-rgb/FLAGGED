import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const languages = ["ru", "en", "pl"];

async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  if (!text) return "";

  if (sourceLanguage === targetLanguage) {
    return text;
  }

  const params = new URLSearchParams({
    q: text,
    langpair: `${sourceLanguage}|${targetLanguage}`,
    mt: "1"
  });

  const response = await fetch(
    `https://api.mymemory.translated.net/get?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`MyMemory HTTP ${response.status}`);
  }

  const data = await response.json();

  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .replace(/\s+/g, " ");

  const normalizedSourceText = normalize(text);

  const matches = Array.isArray(data?.matches)
    ? data.matches
    : [];

  const exactMatches = matches
    .filter(
      (match: any) =>
        typeof match?.segment === "string" &&
        typeof match?.translation === "string"
    )
    .filter(
      (match: any) =>
        normalize(match.segment) === normalizedSourceText
    )
    .filter(
      (match: any) =>
        typeof match?.target === "string" &&
        match.target.toLowerCase().startsWith(
          targetLanguage.toLowerCase()
        )
    )
    .sort(
      (a: any, b: any) =>
        (Number(b?.quality) || 0) -
        (Number(a?.quality) || 0)
    );

  const bestMatch = exactMatches[0];

  const translatedText =
    bestMatch?.translation ||
    data?.responseData?.translatedText;

  if (!translatedText) {
    throw new Error("Translation not returned");
  }

  return translatedText;
}

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
        JSON.stringify({
          error: "Method not allowed"
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const supabaseAnonKey =
      Deno.env.get("SUPABASE_ANON_KEY");

    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceRoleKey
    ) {
      throw new Error(
        "Supabase environment variables are missing"
      );
    }

    const authorization =
      req.headers.get("Authorization");

    if (!authorization) {
      return new Response(
        JSON.stringify({
          error: "Authorization required"
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const token = authorization.replace(
      "Bearer ",
      ""
    );

    const userClient = createClient(
      supabaseUrl,
      supabaseAnonKey
    );

    const {
      data: { user },
      error: userError
    } = await userClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized"
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const adminClient = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    const { data: role, error: roleError } =
      await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["MODERATOR", "ADMIN"])
        .maybeSingle();

    if (roleError) {
      console.error(
        "Moderator check error:",
        roleError
      );

      return new Response(
        JSON.stringify({
          error: "Could not verify moderator access"
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (!role) {
      return new Response(
        JSON.stringify({
          error:
            "Only moderators and admins can translate approved questions"
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const body = await req.json();

    const questionId = Number(
      body?.question_id
    );

    if (!questionId) {
      return new Response(
        JSON.stringify({
          error: "question_id is required"
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

    const { data: question, error: questionError } =
      await adminClient
        .from("questions")
        .select(
          "id, original_language, text_ru, text_en, text_pl, status, moderation_status"
        )
        .eq("id", questionId)
        .single();

    if (questionError || !question) {
      throw new Error("Question not found");
    }

    if (
      question.status !== "published" ||
      question.moderation_status !== "APPROVED"
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Question is not approved and published"
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

    const sourceLanguage =
      question.original_language;

    if (!languages.includes(sourceLanguage)) {
      throw new Error(
        `Unsupported source language: ${sourceLanguage}`
      );
    }

    const questionTexts: Record<string, string> = {
      ru: question.text_ru || "",
      en: question.text_en || "",
      pl: question.text_pl || ""
    };

    const sourceQuestionText =
      questionTexts[sourceLanguage];

    if (!sourceQuestionText) {
      throw new Error(
        "Original question text is missing"
      );
    }

    let questionChanged = false;

    for (const targetLanguage of languages) {
      if (
        targetLanguage !== sourceLanguage &&
        (
          !questionTexts[targetLanguage] ||
          questionTexts[targetLanguage].trim() ===
            sourceQuestionText.trim()
        )
      ) {
        questionTexts[targetLanguage] =
          await translateText(
            sourceQuestionText,
            sourceLanguage,
            targetLanguage
          );

        questionChanged = true;
      }
    }

    if (questionChanged) {
      const { error: updateQuestionError } =
        await adminClient
          .from("questions")
          .update({
            text_ru: questionTexts.ru,
            text_en: questionTexts.en,
            text_pl: questionTexts.pl
          })
          .eq("id", questionId);

      if (updateQuestionError) {
        throw updateQuestionError;
      }
    }

    const {
      data: options,
      error: optionsError
    } = await adminClient
      .from("options")
      .select(
        "id, question_id, text_ru, text_en, text_pl, position"
      )
      .eq("question_id", questionId)
      .order("position", {
        ascending: true
      });

    if (optionsError) {
      throw optionsError;
    }

    const translatedOptions = [];

    for (const option of options || []) {
      const optionTexts: Record<string, string> = {
        ru: option.text_ru || "",
        en: option.text_en || "",
        pl: option.text_pl || ""
      };

      const sourceOptionText =
        optionTexts[sourceLanguage];

      if (!sourceOptionText) {
        translatedOptions.push({
          id: option.id,
          ru: optionTexts.ru,
          en: optionTexts.en,
          pl: optionTexts.pl
        });

        continue;
      }

      let optionChanged = false;

      for (const targetLanguage of languages) {
        if (
          targetLanguage !== sourceLanguage &&
          (
            !optionTexts[targetLanguage] ||
            optionTexts[targetLanguage].trim() ===
              sourceOptionText.trim()
          )
        ) {
          optionTexts[targetLanguage] =
            await translateText(
              sourceOptionText,
              sourceLanguage,
              targetLanguage
            );

          optionChanged = true;
        }
      }

      if (optionChanged) {
        const { error: updateOptionError } =
          await adminClient
            .from("options")
            .update({
              text_ru: optionTexts.ru,
              text_en: optionTexts.en,
              text_pl: optionTexts.pl
            })
            .eq("id", option.id);

        if (updateOptionError) {
          throw updateOptionError;
        }
      }

      translatedOptions.push({
        id: option.id,
        ru: optionTexts.ru,
        en: optionTexts.en,
        pl: optionTexts.pl
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        question_id: questionId,
        question: questionTexts,
        options: translatedOptions
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
    console.error(
      "translate-approved-question error:",
      error
    );

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Translation failed"
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
