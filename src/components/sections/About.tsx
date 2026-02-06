"use client";

import { brandCopy } from "@/lib/site-data";
import ScrollRevealText from "@/components/ui/ScrollRevealText";

export default function About() {
  return (
    <section id="about" className="relative">
      {/* Tall wrapper for scroll-reveal scrub */}
      <div className="min-h-[200vh] flex items-center">
        <div className="sticky top-0 min-h-screen flex items-center w-full">
          <div className="max-w-5xl mx-auto px-6 py-24">
            <p className="text-sm tracking-[0.3em] uppercase text-[var(--accent-red)] font-semibold mb-8">
              The Story
            </p>
            <ScrollRevealText text={brandCopy} />
            <div className="mt-12 flex items-center gap-4">
              <div className="w-12 h-px bg-[var(--border)]" />
              <p className="text-[var(--muted-foreground)] text-sm tracking-wider uppercase">
                Dion Dawkins &mdash; Founder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
