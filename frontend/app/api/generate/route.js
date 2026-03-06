export async function POST(req) {
  try {
    const { prompt, style, negative_prompt, num_images } = await req.json();

    // 1️⃣ Traducir prompt (modelo gratuito)
    const translationResponse = await fetch(
      "https://router.huggingface.co/hf-inference/models/Helsinki-NLP/opus-mt-es-en",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      },
    );

    const translationData = await translationResponse.json();

    const translatedPrompt = translationData?.[0]?.translation_text || prompt;

    // 2️⃣ Crear prompt final con estilo
    const finalPrompt = `${translatedPrompt}, ${style} style`;

    const images = [];

    // 3️⃣ Generar múltiples imágenes
    for (let i = 0; i < num_images; i++) {
      const imageResponse = await fetch(
        "https://router.huggingface.co/hf-inference/models/stabilityai/sd-turbo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: finalPrompt,
            parameters: {
              negative_prompt: negative_prompt || "",
              num_inference_steps: 20,
              width: 512,
              height: 512,
            },
          }),
        },
      );

      const imageBuffer = await imageResponse.arrayBuffer();

      const base64 = Buffer.from(imageBuffer).toString("base64");

      images.push(base64);
    }

    return new Response(JSON.stringify({ images }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
