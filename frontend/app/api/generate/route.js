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

    // Tu Space (lo despertamos automáticamente)
    const app = await Client.connect(
      "https://minifurrito-furry-ai-02-03-2026.hf.space",
    );

    const images = [];

    for (let i = 0; i < num_images; i++) {
      const result = await app.predict("/predict", [
        `${style} furry, ${prompt}`, // Campo 1: Describe tu imagen
        style, // Campo 2: Estilo
        negative_prompt || "blurry, bad anatomy, deformed", // Campo 3: Negative Prompt (¡esto arregla el error!)
      ]);

      // Convertimos la imagen a base64 (funciona con casi todos los Spaces)
      let imageUrl = result.data[0];
      if (imageUrl?.url) imageUrl = imageUrl.url;

      const res = await fetch(imageUrl);
      const arrayBuffer = await res.arrayBuffer();
      const base64 = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;

      images.push(base64);
    }

    return new Response(JSON.stringify({ images }), { status: 200 });
  } catch (error) {
    console.error("❌ Error completo:", error.message);
    return new Response(
      JSON.stringify({
        error: error.message.includes("negative")
          ? "Error en negative prompt del Space. Abre tu Space y corrígelo (o usa el código de 'Use via API')"
          : "Error al conectar con tu Space",
      }),
      { status: 500 },
    );
  }
}
