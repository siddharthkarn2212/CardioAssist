import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart, Menu, X } from "lucide-react";
import { useHealthCheck } from "@/lib/api";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: health } = useHealthCheck();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analytics", label: "Analytics" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg gradient-teal flex items-center justify-center shadow-sm">
              <Heart className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Cardio<span className="text-[#0d9488]">Assist</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  location === link.href
                    ? "bg-[#0d9488]/10 text-[#0d9488]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-[#0d9488]/10 text-[#0d9488]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-white/80">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md gradient-teal flex items-center justify-center">
              <Heart className="h-3 w-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              CardioAssist &mdash; Clinical-grade ML prediction
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`flex h-2 w-2 rounded-full ${health?.status === "ok" ? "bg-emerald-500" : "bg-amber-400"}`} />
            <span>System {health?.status === "ok" ? "Operational" : "Checking..."}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
