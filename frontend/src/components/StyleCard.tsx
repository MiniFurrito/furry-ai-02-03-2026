import type { StylePreset } from "../lib/stylePresets";

type StyleCardProps = {
  preset: StylePreset;
  selected: boolean;
  onSelect: () => void;
};

export function StyleCard({ preset, selected, onSelect }: StyleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Seleccionar estilo ${preset.name}`}
      className={`group overflow-hidden rounded-3xl border bg-[#14111c] text-left transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)] ${
        selected
          ? "border-[color:var(--accent)] shadow-[0_0_0_2px_var(--ring)]"
          : "border-white/10"
      }`}
    >
      <div className="relative h-32 w-full overflow-hidden">
        <img
          src={preset.img}
          alt={preset.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="px-4 py-3">
        <div className="text-sm font-semibold text-white">{preset.name}</div>
        <div className="mt-1 text-xs text-[color:var(--ink-2)]">
          {preset.description}
        </div>
      </div>
    </button>
  );
}
