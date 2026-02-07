import Image from "next/image";
import { socialLinks } from "@/lib/site-data";
import { basePath } from "@/lib/base-path";

const ALT_RED = "#ff2d2d";

const navLinks = [
  { label: "Shop", href: "https://shnowstore.com", external: true },
  { label: "About", href: "#about", external: false },
  { label: "The Game", href: "#game", external: false },
  { label: "Contact", href: "#contact", external: false },
];

export default function AltFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" style={{ backgroundColor: ALT_RED }}>
      {/* ── Big logo banner ── */}
      <div className="py-8 md:py-16 flex items-center justify-center">
        <div className="relative w-[80%] md:w-[60%] max-w-[800px] aspect-[4/1]">
          <Image
            src={`${basePath}/images/brand/logo.png`}
            alt="Shnow Motorsports"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/20" />

      {/* ── Two-column section ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[250px]">
        {/* Left — tagline */}
        <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 flex flex-col justify-between md:border-r border-white/20">
          <span className="text-white/40 text-lg mb-6">+</span>
          <p className="font-[family-name:var(--font-oswald)] text-2xl md:text-4xl lg:text-5xl font-bold uppercase leading-[1.1] text-white">
            Precision, power,<br />
            and a relentless<br />
            pursuit of victory.
          </p>
        </div>

        {/* Right — nav links */}
        <div className="px-6 md:px-16 lg:px-24 py-12 md:py-16 flex items-center justify-start md:justify-end border-t md:border-t-0 border-white/20">
          <nav className="flex flex-col gap-3 md:items-end">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="font-[family-name:var(--font-oswald)] text-xl md:text-2xl font-bold uppercase tracking-wide text-white hover:opacity-60 transition-opacity duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/20" />

      {/* ── Bottom bar ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:px-16 lg:px-24 py-5">
        {/* Social icons */}
        <div className="flex items-center gap-5">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors duration-300 font-mono text-xs tracking-wider uppercase"
              aria-label={link.label}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="font-mono text-xs tracking-[0.15em] uppercase text-white/60">
          &copy;{year} SHNOW MOTORSPORTS
        </p>
      </div>
    </footer>
  );
}
