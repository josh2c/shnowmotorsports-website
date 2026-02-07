import Image from "next/image";
import { basePath } from "@/lib/base-path";

const ALT_RED = "#ff2d2d";

export default function AltEditorial() {
  return (
    <section>
      {/* Editorial Section A — Dion portrait with overlapping text */}
      <div className="relative overflow-hidden py-12 md:py-24 md:min-h-screen flex items-center">
        {/* Background text layer (behind image) */}
        <div className="absolute inset-0 flex items-center" style={{ zIndex: 1 }}>
          <div
            className="font-[family-name:var(--font-oswald)] px-4 md:px-8 w-full uppercase font-bold leading-[0.9]"
            style={{ color: ALT_RED, fontSize: "clamp(4rem, 12vw, 14rem)" }}
          >
            <div>THOSE WHO</div>
            <div>BURN RUBBER</div>
          </div>
        </div>

        {/* Image — center-right */}
        <div
          className="relative w-[55%] md:w-[45%] ml-auto mr-[5%] md:mr-[10%] aspect-[3/4] max-h-[70vh]"
          style={{ zIndex: 2 }}
        >
          <Image
            src={`${basePath}/images/hero/dion.webp`}
            alt="Dion Dawkins — Shnow Motorsports"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 55vw, 45vw"
          />
        </div>

        {/* Foreground text layer (in front of image) */}
        <div className="absolute inset-0 flex items-end pointer-events-none" style={{ zIndex: 3 }}>
          <div
            className="font-[family-name:var(--font-oswald)] px-4 md:px-8 pb-8 md:pb-16 w-full text-right uppercase font-bold leading-[0.9]"
            style={{ color: ALT_RED, fontSize: "clamp(4rem, 12vw, 14rem)" }}
          >
            <div>AND FIND</div>
            <div>VICTORY</div>
          </div>
        </div>
      </div>

      {/* Editorial Section B — Drift car with overlapping text */}
      <div className="relative overflow-hidden py-12 md:py-24 md:min-h-screen flex items-center">
        {/* Background text layer */}
        <div className="absolute inset-0 flex items-start pointer-events-none" style={{ zIndex: 1 }}>
          <div
            className="font-[family-name:var(--font-oswald)] px-4 md:px-8 pt-8 md:pt-16 w-full text-right uppercase font-bold leading-[0.9]"
            style={{ color: ALT_RED, fontSize: "clamp(4rem, 12vw, 14rem)" }}
          >
            <div>WE ARE</div>
            <div>THE TEAM</div>
          </div>
        </div>

        {/* Image — center-left */}
        <div
          className="relative w-[60%] md:w-[50%] ml-[5%] md:ml-[15%] aspect-[16/10] max-h-[60vh]"
          style={{ zIndex: 2 }}
        >
          <Image
            src={`${basePath}/images/hero/car.webp`}
            alt="Shnow Motorsports drift car"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 60vw, 50vw"
          />
        </div>

        {/* Foreground text layer */}
        <div className="absolute inset-0 flex flex-col justify-end pointer-events-none" style={{ zIndex: 3 }}>
          <div
            className="font-[family-name:var(--font-oswald)] px-4 md:px-8 pb-8 md:pb-16 w-full uppercase font-bold leading-[0.9]"
            style={{ color: ALT_RED, fontSize: "clamp(4rem, 12vw, 14rem)" }}
          >
            <div>THE FEARLESS</div>
            <div className="text-right">THE TRUE</div>
          </div>
        </div>
      </div>

      {/* Drift video — same size as car image above */}
      <div className="py-6 md:py-12 flex justify-start">
        <div className="relative w-[60%] md:w-[50%] ml-[15%] md:ml-[25%] aspect-[16/10] max-h-[60vh] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={`${basePath}/images/hero/car.webp`}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={`${basePath}/images/hero/drift2.webm`} type="video/webm" />
            <source src={`${basePath}/images/hero/drift2.mp4`} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
