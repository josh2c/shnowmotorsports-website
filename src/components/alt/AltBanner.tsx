import Image from "next/image";
import { basePath } from "@/lib/base-path";

const ALT_RED = "#ff2d2d";

export default function AltBanner() {
  return (
    <section
      className="relative overflow-hidden py-8 md:py-16 flex items-center justify-center"
      style={{ backgroundColor: ALT_RED }}
    >
      <div className="relative w-[80%] md:w-[60%] max-w-[800px] aspect-[4/1]">
        <Image
          src={`${basePath}/images/brand/logo.png`}
          alt="Shnow Motorsports"
          fill
          className="object-contain"
        />
      </div>
    </section>
  );
}
