import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import ThreeWays from "@/components/ThreeWays";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <Features />
        <UseCases />
        <Benefits />
        <Testimonials />
        <Pricing />
        <ThreeWays />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
