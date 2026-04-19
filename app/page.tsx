"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("Cute");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [images, setImages] = useState<string[]>([]);

  const styleOptions = [
    { key: "Cute", label: "Cute", img: "/styles/cute.jpg" },
    { key: "Anime", label: "Anime", img: "/styles/anime.jpg" },
    { key: "Realistic", label: "Realistic", img: "/styles/realistic.jpg" },
    { key: "Kemono", label: "Kemono", img: "/styles/kemono.jpg" },
    { key: "Feral", label: "Feral", img: "/styles/feral.jpg" },
    { key: "Chibi", label: "Chibi", img: "/styles/chibi.jpg" },
    { key: "Cyberpunk", label: "Cyberpunk", img: "/styles/cyberpunk.jpg" },
    { key: "Fantasy", label: "Fantasy", img: "/styles/fantasy.jpg" },
    { key: "Watercolor", label: "Watercolor", img: "/styles/watercolor.jpg" },
    { key: "Sketch", label: "Sketch", img: "/styles/sketch.jpg" },
    { key: "Comic", label: "Comic", img: "/styles/comic.jpg" },
    { key: "Pixel", label: "Pixel", img: "/styles/pixel.jpg" },
    { key: "Oil", label: "Oil", img: "/styles/oil.jpg" },
  ];

  const generateImage = async () => {
    if (!prompt.trim()) return alert("Por favor escribe un prompt");

    setLoading(true);
    setImages(Array(numImages).fill(""));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          negative_prompt: negativePrompt,
          num_images: numImages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + (data.error || "Error desconocido"));
        return;
      }

      if (data.images && Array.isArray(data.images)) {
        setImages(data.images);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-950 to-pink-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Título arriba */}
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent">
            Cute Furry AI 🐾
          </h1>
          <p className="text-purple-300 text-xl mt-3">
            Crea furries increíbles con IA en segundos
          </p>
        </div>

        {/* Botones superiores */}
        <div className="flex justify-center gap-3 flex-wrap mb-12">
          <button className="bg-purple-600 hover:bg-purple-700 px-7 py-3 rounded-2xl font-medium flex items-center gap-2 transition shadow-lg">
            🎥 Video Generator 1
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-2xl font-medium flex items-center gap-2 transition shadow-lg">
            🎬 Video Generator 2
          </button>
          <button className="bg-green-600 hover:bg-green-700 px-7 py-3 rounded-2xl font-medium flex items-center gap-2 transition shadow-lg">
            🖼️ Image Descriptor
          </button>
          <button className="bg-amber-600 hover:bg-amber-700 px-7 py-3 rounded-2xl font-medium flex items-center gap-2 transition shadow-lg">
            ✏️ Image Modifier
          </button>
          <button className="bg-pink-600 hover:bg-pink-700 px-7 py-3 rounded-2xl font-medium flex items-center gap-2 transition shadow-lg">
            💬 AI Chat
          </button>
        </div>

        <input
          type="text"
          placeholder="Describe tu furry..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-6 text-lg bg-white/10 border border-white/20 focus:border-pink-400 rounded-3xl mb-10"
        />

        <div className="mb-12">
          <p className="text-purple-300 mb-5">Elige un estilo</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {styleOptions.map((option) => (
              <div
                key={option.key}
                onClick={() => setStyle(option.key)}
                className={`cursor-pointer rounded-3xl overflow-hidden border-2 transition-all ${
                  style === option.key
                    ? "border-pink-500 bg-pink-500/20 scale-105"
                    : "border-transparent hover:border-pink-400/50 hover:bg-white/5"
                }`}
              >
                <img
                  src={option.img}
                  alt={option.label}
                  className="w-full h-40 object-cover"
                />
                <div className="bg-black/70 py-3 text-center font-medium text-sm">
                  {option.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="What you DON'T want... (opcional)"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          className="w-full p-6 rounded-3xl bg-white/10 border border-white/20 focus:border-pink-400 mb-8"
        />

        <div className="flex items-center gap-4 mb-10">
          <span className="text-purple-300">Número de imágenes (1-4):</span>
          <input
            type="number"
            min="1"
            max="4"
            value={numImages}
            onChange={(e) => setNumImages(Number(e.target.value))}
            className="w-20 p-3 rounded-2xl bg-white/10 border border-white/20 text-center"
          />
        </div>

        <button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          className="w-full py-7 text-2xl font-bold rounded-3xl bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 disabled:opacity-50 transition-all shadow-2xl"
        >
          {loading ? "Generando..." : "✨ Generate Images"}
        </button>

        {images.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-8 text-pink-200">
              Tus creaciones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40"
                >
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt="Generated"
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
