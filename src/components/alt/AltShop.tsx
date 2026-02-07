import Image from "next/image";
import { basePath } from "@/lib/base-path";

const ALT_RED = "#ff2d2d";

const products = [
  {
    name: "SHNOW TEE",
    image: `${basePath}/images/showcase/snowman-shirt.webp`,
    alt: "Shnow Cold skull tee",
  },
  {
    name: "DRIFT CAP",
    image: `${basePath}/images/showcase/hat.webp`,
    alt: "Shnow Motorsports drift cap",
  },
  {
    name: "HELMET TEE",
    image: `${basePath}/images/showcase/shop-helmet.webp`,
    alt: "Shnow Motorsports helmet tee",
  },
  {
    name: "JERSEY",
    image: `${basePath}/images/showcase/jersey.webp`,
    alt: "Shnow Motorsports jersey",
  },
];

export default function AltShop() {
  return (
    <section id="shop" className="px-6 md:px-16 lg:px-24 py-24">
      {/* Section heading */}
      <div className="flex items-baseline gap-3 mb-16">
        <h2
          className="font-[family-name:var(--font-oswald)] text-[clamp(2.5rem,5vw,4.5rem)] font-bold uppercase tracking-tight"
          style={{ color: ALT_RED }}
        >
          SELECTED GEAR
        </h2>
        <span
          className="font-mono text-sm tracking-wider"
          style={{ color: ALT_RED }}
        >
          ({products.length})
        </span>
      </div>

      {/* Red dot */}
      <div className="flex justify-center mb-12">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ALT_RED }} />
      </div>

      {/* Staggered product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-20">
        {/* Product 1 — top left, no offset */}
        <a
          href="https://shnowstore.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div className="relative aspect-[3/4] max-w-[400px] overflow-hidden bg-white/40 mb-4">
            <Image
              src={products[0].image}
              alt={products[0].alt}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <div
              className="absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ color: ALT_RED }}
            >
              +
            </div>
          </div>
          <p
            className="font-mono text-sm tracking-[0.2em] uppercase"
            style={{ color: ALT_RED }}
          >
            (1) {products[0].name}
          </p>
        </a>

        {/* Product 2 — top right, pushed down */}
        <a
          href="https://shnowstore.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group block md:mt-32"
        >
          <div className="relative aspect-[3/4] max-w-[400px] overflow-hidden bg-white/40 mb-4">
            <Image
              src={products[1].image}
              alt={products[1].alt}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <div
              className="absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ color: ALT_RED }}
            >
              +
            </div>
          </div>
          <p
            className="font-mono text-sm tracking-[0.2em] uppercase"
            style={{ color: ALT_RED }}
          >
            (2) {products[1].name}
          </p>
        </a>

        {/* Product 3 — bottom left, slight offset */}
        <a
          href="https://shnowstore.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group block md:-mt-16"
        >
          <div className="relative aspect-[3/4] max-w-[400px] overflow-hidden bg-white/40 mb-4">
            <Image
              src={products[2].image}
              alt={products[2].alt}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <div
              className="absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ color: ALT_RED }}
            >
              +
            </div>
          </div>
          <p
            className="font-mono text-sm tracking-[0.2em] uppercase"
            style={{ color: ALT_RED }}
          >
            (3) {products[2].name}
          </p>
        </a>

        {/* Product 4 — bottom right, pushed down more */}
        <a
          href="https://shnowstore.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group block md:mt-16"
        >
          <div className="relative aspect-[3/4] max-w-[400px] overflow-hidden bg-white/40 mb-4">
            <Image
              src={products[3].image}
              alt={products[3].alt}
              fill
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <div
              className="absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ color: ALT_RED }}
            >
              +
            </div>
          </div>
          <p
            className="font-mono text-sm tracking-[0.2em] uppercase"
            style={{ color: ALT_RED }}
          >
            (4) {products[3].name}
          </p>
        </a>
      </div>
    </section>
  );
}
