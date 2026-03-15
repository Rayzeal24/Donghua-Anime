import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse-glow absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-[150px]" />
      </div>

      <div className="relative text-center">
        <h1 className="text-gradient text-8xl font-black tracking-tighter sm:text-9xl">404</h1>
        <p className="mt-4 text-xl font-medium text-muted-foreground">
          Cette page n&apos;existe pas
        </p>
        <p className="mt-2 text-sm text-muted-foreground/60">
          Le contenu que vous cherchez a peut-etre ete deplace ou supprime.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/fr">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Retour a l&apos;accueil
            </Button>
          </Link>
          <Link href="/fr/search">
            <Button variant="outline" className="gap-2 border-white/10">
              <Search className="h-4 w-4" />
              Rechercher
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
