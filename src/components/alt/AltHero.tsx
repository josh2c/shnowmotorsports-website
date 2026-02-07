const ALT_RED = "#ff2d2d";

export default function AltHero() {
  return (
    <section className="relative h-[75vh] flex flex-col justify-between px-6 md:px-16 lg:px-24 pt-32 pb-8">
      {/* Main headline — centered */}
      <div className="flex-1 flex items-center justify-center">
        <h1
          className="font-[family-name:var(--font-oswald)] text-[clamp(3rem,9vw,10rem)] font-bold uppercase leading-[0.95] tracking-tight text-center"
          style={{ color: ALT_RED }}
        >
          PRECISION POWER VICTORY
        </h1>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs md:text-sm tracking-[0.2em] uppercase"
        style={{ color: ALT_RED }}
      >
        <span>BURN RUBBER &amp; MAKE MOVES</span>
        <span className="flex items-center gap-2">
          SCROLL TO VIEW MORE
          <span className="inline-block animate-bounce">&#8595;</span>
        </span>
        <span>&copy;{new Date().getFullYear()}</span>
      </div>
    </section>
  );
}
