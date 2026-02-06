"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import gsap from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-registry";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { socialLinks } from "@/lib/site-data";
import SectionHeading from "@/components/ui/SectionHeading";

const platformColors: Record<string, string> = {
  instagram: "hover:text-pink-500",
  tiktok: "hover:text-cyan-400",
  youtube: "hover:text-red-500",
  twitter: "hover:text-blue-400",
};

const platformIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.16 8.16 0 005.58 2.2V11.8a4.85 4.85 0 01-3.77-1.6V6.69h3.77z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

export default function Socials() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    registerGSAPPlugins();

    const ctx = gsap.context(() => {
      gsap.from(".socials-item", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Placeholder — connect to email service in production
    setSubmitted(true);
  };

  return (
    <section id="socials" ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading
          title="Join The Crew"
          subtitle="Follow along. Stay in the loop."
        />

        {/* Social links */}
        <div className="flex justify-center gap-6 md:gap-10 mb-16">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`socials-item text-white/50 transition-all duration-300 hover:scale-110 ${platformColors[link.platform]}`}
              aria-label={`Follow on ${link.label}`}
            >
              {platformIcons[link.platform]}
            </a>
          ))}
        </div>

        {/* Newsletter */}
        <div className="socials-item max-w-md mx-auto text-center">
          <p className="text-[var(--muted-foreground)] mb-6">
            Get event updates and exclusive drops straight to your inbox.
          </p>

          {submitted ? (
            <p className="text-[var(--accent-red)] font-semibold uppercase tracking-wider">
              You&apos;re in. Welcome to the crew.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent border-b border-[var(--border)] px-2 py-3 text-white placeholder:text-white/30 focus:border-[var(--accent-red)] focus:outline-none transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--accent-red)] text-white font-semibold uppercase text-sm tracking-wider hover:bg-[#e02020] transition-colors rounded-sm cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
      </div>
    </section>
  );
}
