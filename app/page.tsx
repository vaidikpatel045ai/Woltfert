import Awards from "@/components/sections/Awards";
import Collections from "@/components/sections/Collections";
import Designers from "@/components/sections/Designers";
import Experience from "@/components/sections/Experience";
import FinalCta from "@/components/sections/FinalCta";
import Generations from "@/components/sections/Generations";
import Hero from "@/components/sections/Hero";
import Instagram from "@/components/sections/Instagram";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import Pillars from "@/components/sections/Pillars";
import Premier from "@/components/sections/Premier";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Visit from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Pillars />
      <Generations />
      <Collections />
      <Designers />
      <Experience />
      <Premier />
      <Services />
      <Testimonials />
      <Awards />
      <Instagram />
      <Visit />
      <FinalCta />
    </>
  );
}
