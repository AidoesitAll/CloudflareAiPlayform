import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { useSessionStore } from "@/store/sessionStore";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
export function App() {
  const isVerified = useSessionStore((state) => state.isVerified);
  if (!isVerified) {
    return <AgeVerificationModal />;
  }
  return (
    <div className="min-h-screen bg-cream font-sans antialiased">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>
      <footer className="text-center py-6 text-navy/50 text-sm">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
      <Toaster richColors position="top-center" />
    </div>
  );
}