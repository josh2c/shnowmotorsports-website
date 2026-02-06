export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface HeroCTA {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "outline";
  action: "scroll" | "modal" | "link";
  external?: boolean;
}

export interface HeroContent {
  teamName: string;
  tagline: string;
  subtitle: string;
  ctas: HeroCTA[];
}

export interface EventDetails {
  name: string;
  date: string;
  displayDate: string;
  displayTime: string;
  venue: string;
  description?: string;
  ticketUrl?: string;
}

export interface SocialLink {
  platform: "instagram" | "tiktok" | "youtube" | "twitter";
  label: string;
  href: string;
  handle: string;
}

export interface ShopItem {
  name: string;
  price: string;
  image: string;
  href: string;
}
