import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrophyIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <TrophyIcon className="h-6 w-6 text-kumpetisi-red" />
          <span className="font-bold text-xl">Kumpetisi</span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/dashboard" className="hidden md:block">
            <Button
              size="sm"
              className="bg-kumpetisi-blue hover:bg-kumpetisi-blue/90"
            >
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
