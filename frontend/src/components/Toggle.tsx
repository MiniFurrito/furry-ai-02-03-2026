type ToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
};

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm transition hover:border-white/20"
    >
      <span
        className={`flex h-6 w-10 items-center rounded-full border transition ${
          checked
            ? "border-[color:var(--accent)] bg-[color:var(--accent)]"
            : "border-white/20 bg-white/10"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition ${
            checked ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </span>
      <span className="flex flex-col">
        <span className="font-semibold text-white">{label}</span>
        {description ? (
          <span className="text-xs text-[color:var(--ink-2)]">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}
