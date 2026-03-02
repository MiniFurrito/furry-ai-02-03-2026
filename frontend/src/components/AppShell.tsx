"use client";

import { useCallback, useMemo, useState } from "react";
import { Header } from "./Header";
import { PromptInput } from "./PromptInput";
import { ResultImage } from "./ResultImage";
import { StyleCard } from "./StyleCard";
import { Toggle } from "./Toggle";
import { STYLE_PRESETS } from "../lib/stylePresets";

const API = process.env.NEXT_PUBLIC_API ?? "http://127.0.0.1:8000";

export function AppShell() {
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState("cute");
  const [nsfw, setNsfw] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presets = useMemo(() => STYLE_PRESETS, []);

  const onGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Escribe un prompt antes de generar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selected,
          nsfw,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = (await res.json()) as { image?: string };

      if (!data.image) {
        throw new Error("No image");
      }

      setImage(data.image);
    } catch {
      setError("No se pudo generar la imagen. Revisa el backend.");
    } finally {
      setLoading(false);
    }
  }, [prompt, selected, nsfw]);

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(125,241,255,0.15),transparent_40%),radial-gradient(900px_circle_at_90%_10%,rgba(255,107,154,0.16),transparent_45%),linear-gradient(160deg,#0b0a0d,#15111c_55%,#1b1724)] px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <Header />

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <PromptInput value={prompt} onChange={setPrompt} />

            <div className="flex flex-wrap items-center gap-4">
              <Toggle
                label="NSFW"
                description="Activa contenido sensible"
                checked={nsfw}
                onChange={() => setNsfw((prev) => !prev)}
              />

              <button
                type="button"
                onClick={onGenerate}
                disabled={loading || !prompt.trim()}
                className="flex-1 rounded-2xl bg-[color:var(--accent)] px-6 py-4 text-lg font-semibold text-zinc-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generando..." : "Generar imagen"}
              </button>
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {presets.map((preset) => (
                <StyleCard
                  key={preset.id}
                  preset={preset}
                  selected={preset.id === selected}
                  onSelect={() => setSelected(preset.id)}
                />
              ))}
            </div>
          </div>

          <ResultImage image={image} loading={loading} />
        </section>
      </div>
    </main>
  );
}
