export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
    });
  }

  /* 1️⃣ Traducir prompt (modelo gratuito HF) */
  const translationResponse = await fetch(
    "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-es-en",
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

  /* 2️⃣ Generar imagen con SD-Turbo */
  const imageResponse = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/sd-turbo",
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

  // 🔥 Manejo real de errores
  if (!imageResponse.ok) {
    const errorText = await imageResponse.text();
    console.error("HF Error:", errorText);
    return new Response(JSON.stringify({ error: errorText }), { status: 500 });
  }

  // 🔥 Verificar que realmente sea imagen
  const contentType = imageResponse.headers.get("content-type");

  if (!contentType || !contentType.includes("image")) {
    const errorText = await imageResponse.text();
    console.error("No es imagen:", errorText);
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

  return new Response(
    JSON.stringify({ image: base64 }), // 🔥 SOLO base64 puro
    { headers: { "Content-Type": "application/json" } },
  );
}
