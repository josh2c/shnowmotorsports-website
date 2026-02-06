import type {
  NavItem,
  HeroContent,
  EventDetails,
  SocialLink,
  ShopItem,
} from "@/types/content";

export const navItems: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Highlights", href: "#media" },
  { label: "CAR SHNOW", href: "#event" },
  { label: "The Game", href: "#game" },
  { label: "Shop", href: "#shop" },
];

export const heroContent: HeroContent = {
  teamName: "SHNOW MOTORSPORTS",
  tagline: "PRECISION. POWER. VICTORY.",
  subtitle: "Drift Team Led by NFL Athlete Dion Dawkins",
  ctas: [
    { label: "Watch", href: "#media", variant: "primary", action: "scroll" },
    {
      label: "Follow",
      href: "#socials",
      variant: "secondary",
      action: "scroll",
    },
    { label: "Shop", href: "#shop", variant: "outline", action: "scroll" },
    { label: "Play Game", href: "#game", variant: "primary", action: "modal" },
  ],
};

export const brandCopy =
  "At Shnow Motorsports, we live for the thrill of the challenge. With NFL athlete Dion Dawkins at the helm, we're a drift team built on precision, power, and a relentless pursuit of victory.";

export const eventDetails: EventDetails = {
  name: "CAR SHNOW 2025",
  date: "2025-08-30T16:00:00-04:00",
  displayDate: "August 30th, 2025",
  displayTime: "4:00 PM",
  venue: "Highmark Stadium",
  description: "The ultimate car show and drift experience.",
  ticketUrl: "#",
};

export const socialLinks: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://instagram.com/shnowmotorsports",
    handle: "@shnowmotorsports",
  },
  {
    platform: "tiktok",
    label: "TikTok",
    href: "https://tiktok.com/@shnowmotorsports",
    handle: "@shnowmotorsports",
  },
  {
    platform: "youtube",
    label: "YouTube",
    href: "https://youtube.com/@shnowmotorsports",
    handle: "Shnow Motorsports",
  },
  {
    platform: "twitter",
    label: "X",
    href: "https://x.com/shnowmotorsports",
    handle: "@shnowmotorsports",
  },
];

export const shopItems: ShopItem[] = [
  {
    name: "Shnow Team Tee",
    price: "$45",
    image: "/images/shop/team-tee.webp",
    href: "#",
  },
  {
    name: "Drift Cap",
    price: "$35",
    image: "/images/shop/drift-cap.webp",
    href: "#",
  },
  {
    name: "Crew Hoodie",
    price: "$85",
    image: "/images/shop/crew-hoodie.webp",
    href: "#",
  },
  {
    name: "Racing Jacket",
    price: "$120",
    image: "/images/shop/racing-jacket.webp",
    href: "#",
  },
];
