import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryNav } from "@/components/home/CategoryNav";
import { LatestIssueGrid } from "@/components/home/LatestIssueGrid";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <CategoryNav />
        <LatestIssueGrid />
      </main>
      <Footer />
    </>
  );
}
