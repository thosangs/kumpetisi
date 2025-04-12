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
import { CalendarIcon, TrophyIcon } from "lucide-react";
import Image from "next/image";
import { supabase, type Competition } from "@/lib/supabase";
import { CreateCompetitionModal } from "@/components/create-competition-modal";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your competitions",
};

async function getCompetitions(): Promise<Competition[]> {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching competitions:", error);
    return [];
  }

  return data || [];
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleString(
      "default",
      { month: "long" }
    )} ${start.getFullYear()}`;
  }

  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

export default async function DashboardPage() {
  const competitions = await getCompetitions();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your competitions and participants
          </p>
        </div>
        {competitions.length !== 0 && <CreateCompetitionModal />}
      </div>

      {competitions.length === 0 ? (
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle>No competitions yet</CardTitle>
            <CardDescription>
              Create your first competition to get started
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <CreateCompetitionModal />
          </CardFooter>
        </Card>
      ) : (
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
                  <span className="text-sm">
                    {formatDateRange(
                      competition.start_date,
                      competition.end_date
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrophyIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Short code: {competition.short_code}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/${competition.short_code}`}>
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
      )}
    </div>
  );
}
