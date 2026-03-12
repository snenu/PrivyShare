import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LandingHero />
        <HowItWorks />
        <Footer />
      </main>
    </div>
  );
}
