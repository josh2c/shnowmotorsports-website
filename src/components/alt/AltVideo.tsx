import { basePath } from "@/lib/base-path";

const ALT_RED = "#ff2d2d";

export default function AltVideo() {
  return (
    <section>
      {/* Full-bleed video */}
      <div className="relative w-full h-[70vh] md:h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={`${basePath}/images/hero/car.webp`}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={`${basePath}/images/hero/motorvid.mp4`} type="video/mp4" />
          <source src={`${basePath}/images/hero/motorvid.webm`} type="video/webm" />
        </video>
      </div>

      {/* Info bar */}
      <div
        className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-6 font-mono text-xs md:text-sm tracking-[0.2em] uppercase"
        style={{ color: ALT_RED }}
      >
        <span>BUFFALO BASED</span>
        <span>EST (2024)</span>
      </div>
    </section>
  );
}
