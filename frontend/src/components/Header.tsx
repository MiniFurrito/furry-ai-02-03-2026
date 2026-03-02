export function Header() {
  return (
    <header className="flex flex-col gap-3">
      <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70">
        Offline creative lab
      </div>
      <h1 className="text-4xl font-semibold text-white md:text-5xl">
        Furry AI Studio
      </h1>
      <p className="max-w-2xl text-base text-[color:var(--ink-2)] md:text-lg">
        Crea imagenes y variaciones con modelos locales. Todo corre en tu PC
        sin servicios externos.
      </p>
    </header>
  );
}
