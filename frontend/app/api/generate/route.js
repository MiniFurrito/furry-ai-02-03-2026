// app/api/generate/route.js
export const runtime = "nodejs";

import { Client } from "@gradio/client";

export async function POST(req) {
  try {
    const {
      prompt,
      style,
      negative_prompt = "",
      num_images = 1,
    } = await req.json();

    if (!prompt || !style) {
      return new Response(
        JSON.stringify({ error: "Prompt y estilo son obligatorios" }),
        { status: 400 },
      );
    }

    // Tu Space (ya despierto la primera vez que lo visites)
    const app = await Client.connect(
      "https://minifurrito-furry-ai-02-03-2026.hf.space/",
    );

    const images = [];

    for (let i = 0; i < num_images; i++) {
      const result = await app.predict("/predict", [
        `${style} furry, ${prompt}`, // ← "Describe tu imagen"
        style, // ← "Estilo"
        // Si más adelante agregas negative_prompt en tu Space, ponlo aquí como tercer parámetro
      ]);

      // Convertimos la imagen a base64 (exactamente como esperaba tu frontend)
      let imageData = result.data[0];
      if (imageData?.url) imageData = imageData.url;

      const res = await fetch(imageData);
      const arrayBuffer = await res.arrayBuffer();
      const base64 = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;

      images.push(base64);
    }

    return new Response(JSON.stringify({ images }), { status: 200 });
  } catch (error) {
    console.error("❌ Error Space:", error.message);
    return new Response(
      JSON.stringify({
        error:
          "Error al conectar con tu Space. Visítalo primero para despertarlo: https://huggingface.co/spaces/MiniFurrito/furry-ai-02_03_2026",
      }),
      { status: 500 },
    );
  }
}
