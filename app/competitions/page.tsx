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
import { CalendarIcon, MapPinIcon, TrophyIcon, Users2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Competitions",
  description: "Browse all pushbike race competitions",
};

export default function CompetitionsPage() {
  // Dummy competitions data
  const competitions = [
    {
      id: 1,
      name: "Lampung Race 2025",
      shortCode: "lr25",
      date: "May 15-17, 2025",
      location: "Lampung, Indonesia",
      participants: 120,
      classes: 8,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
      status: "upcoming",
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
      status: "upcoming",
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
      status: "upcoming",
    },
    {
      id: 4,
      name: "Surabaya Youth Race",
      shortCode: "syr24",
      date: "November 20-22, 2024",
      location: "Surabaya, Indonesia",
      participants: 95,
      classes: 7,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
      status: "upcoming",
    },
    {
      id: 5,
      name: "Bandung BMX Challenge",
      shortCode: "bbc24",
      date: "December 10-12, 2024",
      location: "Bandung, Indonesia",
      participants: 110,
      classes: 8,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
      status: "upcoming",
    },
    {
      id: 6,
      name: "Yogyakarta Pushbike Cup",
      shortCode: "ypc24",
      date: "January 15-17, 2025",
      location: "Yogyakarta, Indonesia",
      participants: 80,
      classes: 6,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
      status: "upcoming",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitions</h1>
          <p className="text-muted-foreground">
            Browse all pushbike race competitions
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="md:w-1/3">
          <Input placeholder="Search competitions..." />
        </div>
        <div className="md:w-1/3">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="lampung">Lampung</SelectItem>
              <SelectItem value="jakarta">Jakarta</SelectItem>
              <SelectItem value="bali">Bali</SelectItem>
              <SelectItem value="surabaya">Surabaya</SelectItem>
              <SelectItem value="bandung">Bandung</SelectItem>
              <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:w-1/3">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date (Earliest first)</SelectItem>
              <SelectItem value="date-desc">Date (Latest first)</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
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
                  <span className="text-sm">{competition.classes} classes</span>
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
  );
}
