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

        // ← ESTA ES LA LÍNEA CLAVE (usa "generate" como en tu app.py)
        const result = await app.predict("generate", [
          prompt,
          style,
          negative_prompt,
        ]);

        let imageData = result.data?.[0];
        if (imageData?.url) imageData = imageData.url;
        if (!imageData)
          throw new Error("No se encontró imagen en la respuesta");

        const res = await fetch(imageData);
        if (!res.ok) throw new Error(`Error descargando: ${res.status}`);

        const arrayBuffer = await res.arrayBuffer();
        return `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
      },
    );

    const images = await Promise.all(imagePromises);

    return new Response(JSON.stringify({ images }), { status: 200 });
  } catch (error) {
    console.error("❌ Error completo en /api/generate:", error.message);
    return new Response(
      JSON.stringify({
        error: `Error al generar: ${error.message || "desconocido"}. Prueba visitar el Space primero: https://minifurrito-furry-ai-02-03-2026.hf.space`,
      }),
      { status: 500 },
    );
  }
}

/* Comando para actualizar a Vercel:
git add .
git commit -m "Algo random"
git push
 */
