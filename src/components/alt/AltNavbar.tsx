"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { basePath } from "@/lib/base-path";
import { cn } from "@/lib/cn";

const ALT_RED = "#ff2d2d";
const ALT_BG = "#d5d0c4";

const navLinks = [
  { label: "SHOP", href: "https://shnowstore.com", external: true },
  { label: "INSTAGRAM", href: "https://instagram.com/shnowmotorsports", external: true },
  { label: "TIKTOK", href: "https://tiktok.com/@shnowmotorsports", external: true },
  { label: "YOUTUBE", href: "https://youtube.com/@shnowmotorsports", external: true },
  { label: "X", href: "https://x.com/shnowmotorsports", external: true },
];

export default function AltNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-0 pointer-events-none z-50">
      {/* Left — stacked nav links (desktop) */}
      <nav className="hidden lg:flex flex-col gap-1 fixed top-3 left-4 pointer-events-auto">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-oswald)] text-xs font-bold tracking-wider hover:opacity-60 transition-opacity duration-300 uppercase"
            style={{ color: ALT_RED }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Center — logo */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 pointer-events-auto">
        <a href="#" className="relative block h-10 w-40">
          <Image
            src={`${basePath}/images/brand/logo.png`}
            alt="Shnow Motorsports"
            fill
            className="object-contain"
            style={{  }}
            priority
          />
        </a>
      </div>

      {/* Right — GET IN TOUCH + arrow icon */}
      <div className="hidden lg:flex flex-col items-center gap-4 fixed top-3 right-4 pointer-events-auto">
        <span
          className="alt-rotate-text font-[family-name:var(--font-oswald)] text-xs font-bold tracking-[0.25em] uppercase"
          style={{ color: ALT_RED }}
        >
          GET IN TOUCH
        </span>
        <a
          href="#contact"
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300"
          style={{ borderColor: ALT_RED, color: ALT_RED }}
          aria-label="Contact us"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>

      {/* Mobile — hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden fixed top-4 left-4 pointer-events-auto flex flex-col gap-1.5 p-2 z-50"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span
          className={cn(
            "w-6 h-0.5 transition-all duration-300 origin-center",
            menuOpen && "rotate-45 translate-y-2"
          )}
          style={{ backgroundColor: ALT_RED }}
        />
        <span
          className={cn(
            "w-6 h-0.5 transition-all duration-300",
            menuOpen && "opacity-0"
          )}
          style={{ backgroundColor: ALT_RED }}
        />
        <span
          className={cn(
            "w-6 h-0.5 transition-all duration-300 origin-center",
            menuOpen && "-rotate-45 -translate-y-2"
          )}
          style={{ backgroundColor: ALT_RED }}
        />
      </button>

      {/* Mobile — fullscreen menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 transition-all duration-500 flex flex-col items-center justify-center gap-8 pointer-events-auto",
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        style={{ backgroundColor: ALT_BG }}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="font-[family-name:var(--font-oswald)] text-3xl font-bold tracking-widest hover:opacity-60 transition-opacity uppercase"
            style={{ color: ALT_RED }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
