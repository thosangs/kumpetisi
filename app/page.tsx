import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, TrophyIcon, Users2Icon } from "lucide-react";
import Image from "next/image";

export default function Home() {
  // Dummy featured competitions
  const featuredCompetitions = [
    {
      id: 1,
      name: "Lampung Race 2025",
      shortCode: "lr25",
      date: "May 15-17, 2025",
      location: "Lampung, Indonesia",
      participants: 120,
      classes: 8,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
    },
    {
      id: 2,
      name: "Jakarta BMX Championship",
      shortCode: "jbc24",
      date: "August 5-7, 2024",
      location: "Jakarta, Indonesia",
      participants: 85,
      classes: 6,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
    },
    {
      id: 3,
      name: "Bali Pushbike Open",
      shortCode: "bpo24",
      date: "October 12-14, 2024",
      location: "Bali, Indonesia",
      participants: 150,
      classes: 10,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted rounded-xl mb-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Manage Your Bracket Competitions with{" "}
                <span className="text-kumpetisi-red">Kumpetisi</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The ultimate platform for organizing and managing pushbike race
                competitions with ease.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-kumpetisi-blue hover:bg-kumpetisi-blue/90"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="#featured">
                <Button variant="outline" size="lg">
                  View Competitions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">
              Featured Competitions
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Discover the latest and upcoming pushbike race competitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCompetitions.map((competition) => (
              <Card key={competition.id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-4">
                    <Image
                      src={competition.logo || "https://placeholder.pics/svg/"}
                      alt={competition.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                    <div>
                      <CardTitle>{competition.name}</CardTitle>
                      <CardDescription>{competition.location}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{competition.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{competition.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users2Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {competition.participants} participants
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrophyIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {competition.classes} classes
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/${competition.shortCode}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted rounded-xl">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simplify Your Competition Management
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Kumpetisi provides all the tools you need to organize
                  successful pushbike race competitions.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button className="bg-kumpetisi-blue hover:bg-kumpetisi-blue/90">
                    Create Competition
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline">Event Organizer Login</Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto grid max-w-[350px] gap-4 sm:max-w-[400px] md:max-w-[500px] lg:max-w-none">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kumpetisi-red/10">
                    <TrophyIcon className="h-5 w-5 text-kumpetisi-red" />
                  </div>
                  <h3 className="text-center text-sm font-medium">
                    Bracket Management
                  </h3>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kumpetisi-blue/10">
                    <Users2Icon className="h-5 w-5 text-kumpetisi-blue" />
                  </div>
                  <h3 className="text-center text-sm font-medium">
                    Participant Registration
                  </h3>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kumpetisi-red/10">
                    <CalendarIcon className="h-5 w-5 text-kumpetisi-red" />
                  </div>
                  <h3 className="text-center text-sm font-medium">
                    Schedule Management
                  </h3>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kumpetisi-blue/10">
                    <MapPinIcon className="h-5 w-5 text-kumpetisi-blue" />
                  </div>
                  <h3 className="text-center text-sm font-medium">
                    Venue Details
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
