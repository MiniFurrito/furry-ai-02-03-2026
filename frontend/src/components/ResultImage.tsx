type ResultImageProps = {
  image: string | null;
  loading: boolean;
};

export function ResultImage({ image, loading }: ResultImageProps) {
  const imageSrc = image ? `data:image/png;base64,${image}` : "";

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Resultado</h2>
        <span className="text-xs text-[color:var(--ink-2)]">
          1024 x 1024
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#121019]">
        {loading ? (
          <div className="flex h-80 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[color:var(--accent)]" />
          </div>
        ) : image ? (
          <img src={imageSrc} alt="Resultado" className="w-full" />
        ) : (
          <div className="flex h-80 flex-col items-center justify-center gap-2 px-6 text-center text-sm text-[color:var(--ink-2)]">
            <div className="text-base font-semibold text-white">
              Sin resultados todavia
            </div>
            <p>Genera una imagen para verla aqui.</p>
          </div>
        )}
      </div>
    </section>
  );
}
