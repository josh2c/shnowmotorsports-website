const ALT_RED = "#ff2d2d";

export default function AltAbout() {
  return (
    <section id="about" className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full">
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
          className="flex flex-col justify-center gap-8 font-mono text-sm md:text-base tracking-[0.08em] uppercase leading-relaxed"
          style={{ color: ALT_RED }}
        >
          <p>
            <span className="inline-block ml-4">WE PARTNER WITH</span><br />
            THE BOLD,&nbsp;&nbsp;THE BRAVE,&nbsp;&nbsp;THE RELENTLESS.
          </p>
          <p>
            WE CRAFT CHAMPIONS THAT DARE TO STAND<br />
            FOR SOMETHING.
          </p>
          <p>
            <span className="inline-block ml-16">OUR WORK LIVES AT THE INTERSECTION</span><br />
            <span className="inline-block ml-16">OF PRECISION AND POWER.</span>
          </p>
          <p>
            WHERE STRATEGY&nbsp;&nbsp;&nbsp;MEETS SKILL<br />
            AND COMPETITION BECOMES&nbsp;&nbsp;A FORCE<br />
            <span className="inline-block ml-8">FOR GREATNESS.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
