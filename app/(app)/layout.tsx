import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserSync } from "@/components/UserSync";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <UserSync />
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
