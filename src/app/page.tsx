import AltLoader from "@/components/alt/AltLoader";
import AltNavbar from "@/components/alt/AltNavbar";
import AltHero from "@/components/alt/AltHero";
import AltVideo from "@/components/alt/AltVideo";
import AltAbout from "@/components/alt/AltAbout";
import AltEditorial from "@/components/alt/AltEditorial";
import AltShop from "@/components/alt/AltShop";
import AltFooter from "@/components/alt/AltFooter";
import Game from "@/components/sections/Game";

export default function Home() {
  return (
    <div className="alt-theme">
      <AltLoader />
      <AltNavbar />
      <Game />
      <main>
        <AltHero />
        <AltVideo />
        <AltAbout />
        <AltEditorial />
        <AltShop />
      </main>
      <AltFooter />
    </div>
  );
}
