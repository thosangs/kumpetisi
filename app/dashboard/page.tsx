import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, PlusIcon, TrophyIcon } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your competitions",
};

export default function DashboardPage() {
  // Dummy competitions data
  const competitions = [
    {
      id: 1,
      name: "Lampung Race 2025",
      shortCode: "lr25",
      date: "May 15-17, 2025",
      location: "Lampung, Indonesia",
      status: "upcoming",
      logo: "https://placeholder.pics/svg/?height=100&width=100",
    },
    {
      id: 2,
      name: "Jakarta BMX Championship",
      shortCode: "jbc24",
      date: "August 5-7, 2024",
      location: "Jakarta, Indonesia",
      status: "upcoming",
      logo: "https://placeholder.pics/svg/?height=100&width=100",
    },
    {
      id: 3,
      name: "Bali Pushbike Open",
      shortCode: "bpo24",
      date: "October 12-14, 2024",
      location: "Bali, Indonesia",
      status: "draft",
      logo: "https://placeholder.pics/svg/?height=100&width=100",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your competitions and participants
          </p>
        </div>
        <Link href="/dashboard/kompetisi/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Competition
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {competitions.map((competition) => (
          <Card key={competition.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Image
                src={competition.logo || "https://placeholder.pics/svg/"}
                alt={competition.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-md object-contain"
              />
              <div>
                <CardTitle className="text-xl">{competition.name}</CardTitle>
                <CardDescription>{competition.location}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{competition.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrophyIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Short code: {competition.shortCode}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/${competition.shortCode}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
              <Link href={`/dashboard/kompetisi/${competition.id}`}>
                <Button size="sm">Manage</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
