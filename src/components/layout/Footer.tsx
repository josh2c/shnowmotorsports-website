import { socialLinks } from "@/lib/site-data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <p className="font-[family-name:var(--font-oswald)] text-lg font-bold tracking-widest uppercase">
            SHNOW
          </p>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-[var(--muted-foreground)]">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#event" className="hover:text-white transition-colors">
              Event
            </a>
            <a href="#shop" className="hover:text-white transition-colors">
              Shop
            </a>
            <a href="#socials" className="hover:text-white transition-colors">
              Contact
            </a>
          </nav>

          {/* Social icons (compact) */}
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted-foreground)] hover:text-white transition-colors text-sm"
                aria-label={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[var(--muted-foreground)]">
          &copy; {year} Shnow Motorsports. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
