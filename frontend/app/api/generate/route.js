export async function POST(req) {
  const { prompt } = await req.json();

  // 1️⃣ Traducir prompt (usando modelo gratuito de HF)
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

  // 2️⃣ Generar imagen con SD-Turbo (rápido)
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

  const imageBuffer = await imageResponse.arrayBuffer();
  const base64 = Buffer.from(imageBuffer).toString("base64");

  return new Response(JSON.stringify({ image: base64 }), {
    headers: { "Content-Type": "application/json" },
  });
}
