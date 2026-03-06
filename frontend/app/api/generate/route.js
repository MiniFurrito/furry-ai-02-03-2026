export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
    });
  }

  /* 1️⃣ Traducir prompt */
  const translationResponse = await fetch(
    "https://router.huggingface.co/hf-inference/models/Helsinki-NLP/opus-mt-es-en",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    },
  );

  const translationData = await translationResponse.json();
  const translatedPrompt = translationData[0]?.translation_text || prompt;

  /* 2️⃣ Generar imagen */
  const imageResponse = await fetch(
    "https://router.huggingface.co/hf-inference/models/stabilityai/sd-turbo",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: translatedPrompt,
        parameters: {
          num_inference_steps: 25,
          width: 512,
          height: 512,
        },
      }),
    },
  );

  if (!imageResponse.ok) {
    const errorText = await imageResponse.text();
    return new Response(JSON.stringify({ error: errorText }), { status: 500 });
  }

  const contentType = imageResponse.headers.get("content-type");

  if (!contentType || !contentType.includes("image")) {
    const errorText = await imageResponse.text();
    return new Response(
      JSON.stringify({
        error: "HF no devolvió una imagen válida",
        detail: errorText,
      }),
      { status: 500 },
    );
  }

  const imageBuffer = await imageResponse.arrayBuffer();
  const base64 = Buffer.from(imageBuffer).toString("base64");

  return new Response(JSON.stringify({ image: base64 }), {
    headers: { "Content-Type": "application/json" },
  });
}
