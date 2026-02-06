import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";
import Hero from "@/components/sections/Hero";
import Game from "@/components/sections/Game";
import Showcase from "@/components/sections/Showcase";
import SplitBanner from "@/components/sections/SplitBanner";

export default function Home() {
  return (
    <>
      <PageLoader />
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <SplitBanner />
      </main>
      <Game />
      <Footer />
    </>
  );
}
