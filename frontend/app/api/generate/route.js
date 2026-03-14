/*export async function POST(req) {
  try {
    const { prompt, style, negative_prompt, num_images } = await req.json();

    // 1️⃣ Traducir prompt
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
      }
    );

    const translationData = await translationResponse.json();

    const translatedPrompt =
      translationData?.[0]?.translation_text || prompt;

    // 2️⃣ Crear prompt final
    const finalPrompt = `${translatedPrompt}, ${style} style`;

    const images = [];

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
              width: 512,
              height: 512,
            },
          }),
        }
      );

      // ⚠️ IMPORTANTE
      const arrayBuffer = await imageResponse.arrayBuffer();

      const base64 = Buffer.from(arrayBuffer).toString("base64");

      images.push(base64);
    }

    return new Response(
      JSON.stringify({ images }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}*/
/*export const runtime = "nodejs";

export async function POST(req) {
  const { prompt, num_images = 1 } = await req.json();

  const images = [];

  for (let i = 0; i < num_images; i++) {
    const response = await fetch(
      //"https://router.huggingface.co/hf-inference/models/stabilityai/sd-turbo",
      //"https://api-inference.huggingface.co/models/stabilityai/sd-turbo",
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF ERROR:", errorText);

      return new Response(JSON.stringify({ error: errorText }), {
        status: 500,
      });
    }

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("image")) {
      const text = await response.text();

      return new Response(JSON.stringify({ error: text }), { status: 500 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    images.push(base64);
  }

  return new Response(JSON.stringify({ images }), {
    headers: { "Content-Type": "application/json" },
  });
}*/

export const runtime = "nodejs";

export async function POST(req) {

  const { prompt, style, negative_prompt = "", num_images = 1 } = await req.json();

  const images = [];

  for (let i = 0; i < num_images; i++) {

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/sd-turbo",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `${style} furry, ${prompt}`,
          parameters: {
            negative_prompt: `blurry, bad anatomy, extra limbs, extra fingers, deformed hands, ${negative_prompt}`
          },
          options: { wait_for_model: true }
        }),
      }
    );

    if (!response.ok) {

      const errorText = await response.text();
      console.error("HF ERROR:", errorText);

      return new Response(JSON.stringify({ error: errorText }), {
        status: 500,
      });

    }
  }}