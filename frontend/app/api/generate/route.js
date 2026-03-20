// app/api/generate/route.js
export const runtime = "nodejs";

import { Client } from "@gradio/client";

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, style, negative_prompt = "", num_images = 1 } = body;

    if (!prompt || !style) {
      return new Response(
        JSON.stringify({ error: "Prompt y estilo son obligatorios" }),
        { status: 400 },
      );
    }

    const app = await Client.connect(
      "https://minifurrito-furry-ai-02-03-2026.hf.space/",
    );

    const imagePromises = Array.from(
      { length: Math.min(Number(num_images), 4) },
      async (_, i) => {
        console.log(`Generando imagen ${i + 1} de ${num_images}`);

        // ← SOLO 2 PARÁMETROS (esto hace que deje de dar 500)
        const result = await app.predict("/predict", [prompt, style]);

        let imageData = result.data?.[0];
        if (imageData?.url) imageData = imageData.url;
        if (!imageData) throw new Error("No se encontró imagen");

        const res = await fetch(imageData);
        if (!res.ok) throw new Error(`Error descargando: ${res.status}`);

        const arrayBuffer = await res.arrayBuffer();
        return `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
      },
    );

    const images = await Promise.all(imagePromises);

    return new Response(JSON.stringify({ images }), { status: 200 });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: `Error: ${error.message}` }), {
      status: 500,
    });
  }
}

/* Comando para actualizar a Vercel:
git add .
git commit -m "Algo random"
git push
 */
