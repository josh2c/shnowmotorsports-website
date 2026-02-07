const ALT_RED = "#ff2d2d";

export default function AltAbout() {
  return (
    <section id="about" className="flex items-center px-6 md:px-16 lg:px-24 py-16 md:py-24 lg:min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 w-full">
        {/* Left — large bold heading */}
        <div className="flex items-center">
          <h2
            className="font-[family-name:var(--font-oswald)] text-[clamp(2.2rem,5vw,4.5rem)] font-bold uppercase leading-[1.05]"
            style={{ color: ALT_RED }}
          >
            AT SHNOW MOTORSPORTS, WE DON&apos;T JUST DRIFT&nbsp;&mdash; WE DOMINATE.
          </h2>
        </div>

        {/* Right — monospace staggered body text */}
        <div
          className="flex flex-col justify-center gap-6 md:gap-8 font-mono text-xs md:text-base tracking-[0.08em] uppercase leading-relaxed"
          style={{ color: ALT_RED }}
        >
          <p>
            <span className="inline-block md:ml-4">WE PARTNER WITH</span><br />
            THE BOLD, THE BRAVE, THE RELENTLESS.
          </p>
          <p>
            WE CRAFT CHAMPIONS THAT DARE TO STAND<br />
            FOR SOMETHING.
          </p>
          <p>
            <span className="inline-block md:ml-16">OUR WORK LIVES AT THE INTERSECTION</span><br />
            <span className="inline-block md:ml-16">OF PRECISION AND POWER.</span>
          </p>
          <p>
            WHERE STRATEGY MEETS SKILL<br />
            AND COMPETITION BECOMES A FORCE<br />
            <span className="inline-block md:ml-8">FOR GREATNESS.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
