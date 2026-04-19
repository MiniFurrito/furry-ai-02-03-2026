// app/api/generate/route.js
export const runtime = "nodejs";

import { Client } from "@gradio/client";

const SPACE_URL = "https://minifurrito-furry-ai-02-03-2026.hf.space";

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, style, negative_prompt = "", num_images = 1 } = body;

    if (!prompt || !style) {
      return Response.json(
        { error: "Prompt y estilo son obligatorios" },
        { status: 400 },
      );
    }

    console.log(
      `🔄 Enviando a Gradio → Estilo: ${style} | Prompt: ${prompt.substring(0, 60)}...`,
    );

    const client = await Client.connect(SPACE_URL);

    const result = await client.predict("generate", [
      prompt,
      style,
      negative_prompt,
    ]);

    console.log(
      "📥 Respuesta cruda de Gradio:",
      JSON.stringify(result, null, 2),
    );

    // Extracción robusta de la URL (Gradio 4 devuelve estructura compleja)
    let imageUrl = null;

    if (result && typeof result === "object") {
      // Caso más común: result.data[0].url
      if (result.data && Array.isArray(result.data) && result.data[0]?.url) {
        imageUrl = result.data[0].url;
      }
      // Caso alternativo: result[0].url
      else if (Array.isArray(result) && result[0]?.url) {
        imageUrl = result[0].url;
      }
      // Caso directo: si result es un string
      else if (typeof result === "string") {
        imageUrl = result;
      }
    }

    if (!imageUrl) {
      console.error("No se encontró URL en la respuesta:", result);
      throw new Error("No se recibió una URL válida de imagen desde Gradio");
    }

    console.log("📥 Descargando imagen desde:", imageUrl);

    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error(`Error al descargar la imagen: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    console.log("✅ Imagen convertida a base64 correctamente");

    return Response.json(
      {
        success: true,
        images: [base64],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error completo en /api/generate:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}
