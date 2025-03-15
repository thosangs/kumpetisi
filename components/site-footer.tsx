import Link from "next/link";
import { TrophyIcon } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center gap-2">
            <TrophyIcon className="h-6 w-6 text-kumpetisi-red" />
            <span className="font-bold">Kumpetisi</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Kumpetisi. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href="/competitions"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Competitions
          </Link>
        </div>
      </div>
    </footer>
  );
}
