type PromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

export function PromptInput({
  value,
  onChange,
  maxLength = 320,
}: PromptInputProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Prompt</h2>
        <span className="text-xs text-[color:var(--ink-2)]">
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        rows={4}
        placeholder="Describe tu personaje furry, estilo, luz, fondo, etc."
        className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-[#16131f] p-4 text-sm text-white outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
      />
      <p className="mt-3 text-xs text-[color:var(--ink-2)]">
        Consejo: agrega detalles como iluminacion, ropa o emocion.
      </p>
    </section>
  );
}
