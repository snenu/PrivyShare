import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { HowItWorks } from "@/components/HowItWorks";
import { HomeStats } from "@/components/HomeStats";
import { HomeFeatures } from "@/components/HomeFeatures";
import { HomeCta } from "@/components/HomeCta";
import { Footer } from "@/components/Footer";
import { RedirectOnConnect } from "@/components/RedirectOnConnect";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <RedirectOnConnect />
      <Header />
      <main className="flex-1">
        <LandingHero />
        <HowItWorks />
        <HomeStats />
        <HomeFeatures />
        <HomeCta />
        <Footer />
      </main>
    </div>
  );
}
