"use client";

import { useState } from "react";

/* ---------- Spinner ---------- */
const Spinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("cute");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [images, setImages] = useState<string[]>([]);

  const styleOptions = [
    { key: "cute", label: "Cute", img: "/styles/cute.jpg" },
    { key: "anime", label: "Anime", img: "/styles/anime.jpg" },
    { key: "realistic", label: "Realistic", img: "/styles/realistic.jpg" },
    { key: "kemono", label: "Kemono", img: "/styles/kemono.jpg" },
    { key: "feral", label: "Feral", img: "/styles/feral.jpg" },
    { key: "chibi", label: "Chibi", img: "/styles/chibi.jpg" },
    { key: "cyberpunk", label: "Cyberpunk", img: "/styles/cyberpunk.jpg" },
    { key: "fantasy", label: "Fantasy", img: "/styles/fantasy.jpg" },
    { key: "watercolor", label: "Watercolor", img: "/styles/watercolor.jpg" },
    { key: "sketch", label: "Sketch", img: "/styles/sketch.jpg" },
    { key: "comic", label: "Comic", img: "/styles/comic.jpg" },
    { key: "pixel", label: "Pixel", img: "/styles/pixel.jpg" },
    { key: "oil", label: "Oil", img: "/styles/oil.jpg" },
  ];

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);

    // Crear placeholders vacíos según cantidad
    setImages(Array(numImages).fill(""));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          negative_prompt: negativePrompt,
          num_images: numImages,
          nsfw: false,
        }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      // 🔥 Soporta ambos formatos (image o images)
      if (data.images && Array.isArray(data.images)) {
        setImages(data.images);
      } else if (data.image) {
        setImages([data.image]); // lo convertimos en array
      } else {
        console.error("Formato inesperado:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen text-white flex flex-col items-center gap-6 p-6 bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900">
      <h1 className="text-4xl font-bold text-pink-400 drop-shadow-lg">
        Cute Furry AI 🐾
      </h1>

      {/* Navegación futura */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded shadow-lg transition hover:scale-105">
          🎥 Video Generator 1
        </button>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded shadow-lg transition hover:scale-105">
          🎬 Video Generator 2
        </button>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded shadow-lg transition hover:scale-105">
          🖼️ Image Descriptor
        </button>
        <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded shadow-lg transition hover:scale-105">
          ✏️ Image Modifier
        </button>
        <button className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded shadow-lg transition hover:scale-105">
          💬 AI Chat
        </button>
      </div>

      {/* Prompt */}
      <input
        type="text"
        placeholder="Describe your furry..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full max-w-md p-3 rounded text-black shadow-lg"
      />

      {/* Style selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
        {styleOptions.map((option) => (
          <div
            key={option.key}
            onClick={() => setStyle(option.key)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition transform hover:scale-105
            ${style === option.key ? "border-pink-500 shadow-lg" : "border-transparent"}`}
          >
            <img
              src={option.img}
              alt={option.label}
              className="w-full h-32 object-cover"
            />
            <div className="text-center py-2 bg-gray-900">{option.label}</div>
          </div>
        ))}
      </div>

      {/* Negative Prompt */}
      <input
        type="text"
        placeholder="What you DON'T want..."
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
        className="w-full max-w-md p-3 rounded text-black shadow-lg"
      />

      {/* Number of Images */}
      <input
        type="number"
        min="1"
        max="4"
        value={numImages}
        onChange={(e) => setNumImages(Number(e.target.value))}
        className="w-20 p-2 rounded text-black shadow-lg"
      />

      {/* Generate Button */}
      <button
        onClick={generateImage}
        className="bg-pink-500 hover:bg-pink-400 px-6 py-3 rounded font-bold shadow-lg transition hover:scale-105"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* Images with dynamic loaders */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {images.map((img, index) => (
            <div
              key={index}
              // Hace que la IA genere la imagen en un tamaño específico, el siguiente hace que el cuadro tenga el tamaño necesario:  className="w-80 h-80 bg-gray-800 rounded shadow-lg flex items-center justify-center overflow-hidden"
              // className="max-w-md bg-gray-800 rounded shadow-lg flex items-center justify-center p-2"
              className="w-80 h-80 bg-gray-800 rounded shadow-lg flex items-center justify-center overflow-hidden"
            >
              {img ? (
                <img
                  src={`data:image/png;base64,${img}`}
                  alt="Generated"
                  className="max-w-full max-h-full object-contain rounded"
                />
              ) : (
                <Spinner />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"></div>
    </main>
  );
}