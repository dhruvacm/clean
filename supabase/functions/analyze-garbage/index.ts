import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are a garbage detection AI. Analyze the image and determine:
1. Whether garbage/waste is present (true/false)
2. The type of garbage (e.g., "plastic waste", "food waste", "construction debris", "mixed waste", "electronic waste", "hazardous waste")
3. The severity/amount: "small" (a few items, minor littering), "medium" (noticeable pile, multiple items), "large" (significant dumping, large area covered), "extreme" (massive illegal dumping, environmental hazard)
4. Points to award based on severity: small=20, medium=50, large=100, extreme=200
5. A brief description of what you see

You MUST respond with a JSON object using this exact tool.`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image for garbage/waste. Determine the type, amount, and severity.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageBase64.startsWith("data:")
                      ? imageBase64
                      : `data:image/jpeg;base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "report_garbage_analysis",
                description: "Report the results of garbage analysis on an image",
                parameters: {
                  type: "object",
                  properties: {
                    detected: {
                      type: "boolean",
                      description: "Whether garbage was detected in the image",
                    },
                    garbage_type: {
                      type: "string",
                      description:
                        "Type of garbage found (e.g., plastic waste, food waste, construction debris)",
                    },
                    severity: {
                      type: "string",
                      enum: ["small", "medium", "large", "extreme"],
                      description: "Severity/amount of garbage",
                    },
                    points: {
                      type: "integer",
                      description:
                        "Points to award: small=20, medium=50, large=100, extreme=200",
                    },
                    description: {
                      type: "string",
                      description: "Brief description of what was found",
                    },
                  },
                  required: [
                    "detected",
                    "garbage_type",
                    "severity",
                    "points",
                    "description",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "report_garbage_analysis" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback if no tool call
    return new Response(
      JSON.stringify({
        detected: false,
        garbage_type: "unknown",
        severity: "small",
        points: 0,
        description: "Could not analyze the image.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("analyze-garbage error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
