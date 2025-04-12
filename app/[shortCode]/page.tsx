export const runtime = "edge";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, Users2Icon } from "lucide-react";
import { CompetitionDetails } from "@/components/competition-details";
import { ClassesList } from "@/components/classes-list";
import { HtmlContent } from "@/components/html-content";
import Image from "next/image";
import { supabase, type Competition, type Class } from "@/lib/supabase";

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

  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} ${start.toLocaleString("default", {
      month: "long",
    })} - ${end.getDate()} ${end.toLocaleString("default", {
      month: "long",
    })} ${start.getFullYear()}`;
  }

  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

async function getCompetitionByShortCode(
  shortCode: string
): Promise<Competition | null> {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("short_code", shortCode)
    .single();

  if (error) {
    console.error("Error fetching competition:", error);
    return null;
  }

  return data;
}

async function getClassesByCompetitionId(
  competitionId: number
): Promise<Class[]> {
  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select(
      `
      *,
      stages:stages(
        *,
        batches:batches(*)
      )
    `
    )
    .eq("competition_id", competitionId)
    .order("created_at");

  if (classesError) {
    console.error("Error fetching classes:", classesError);
    return [];
  }

  return classes || [];
}

type Props = {
  params: { shortCode: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const competition = await getCompetitionByShortCode(params.shortCode);

  if (!competition) {
    return {
      title: "Competition Not Found",
      description: "The requested competition could not be found.",
    };
  }

  return {
    title: competition.name,
    description: competition.description,
    openGraph: {
      title: competition.name,
      description: competition.description,
      type: "website",
    },
  };
}

export default async function CompetitionPage({ params }: Props) {
  const competition = await getCompetitionByShortCode(params.shortCode);

  if (!competition) {
    notFound();
  }

  const classes = competition.id
    ? await getClassesByCompetitionId(competition.id)
    : [];
  const dateRange = formatDateRange(
    competition.start_date,
    competition.end_date
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-24 h-24 relative">
          <Image
            src={competition.logo || "https://placeholder.pics/svg/"}
            alt={competition.name}
            fill
            className="rounded-lg object-contain"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{competition.name}</h1>
          <p className="text-muted-foreground mb-4">
            {competition.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span>{dateRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
              <span>{competition.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users2Icon className="h-5 w-5 text-muted-foreground" />
              <span>
                {classes.reduce(
                  (total, cls) =>
                    total +
                    cls.stages.reduce(
                      (stageTotal, stage) =>
                        stageTotal +
                        stage.batches.reduce(
                          (batchTotal, batch) =>
                            batchTotal + (batch.participants?.length || 0),
                          0
                        ),
                      0
                    ),
                  0
                )}{" "}
                participants
              </span>
            </div>
            <Badge variant="secondary">{classes.length} classes</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Competition Details</CardTitle>
              <CardDescription>
                Overview of the competition structure and format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompetitionDetails competition={competition} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Competition Rules</CardTitle>
              <CardDescription>
                Official rules and regulations for the competition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HtmlContent content={competition.rules} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Event Schedule</CardTitle>
              <CardDescription>
                Detailed schedule of all competition events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HtmlContent content={competition.schedule} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Competition Classes</CardTitle>
              <CardDescription>
                List of all competition classes and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClassesList
                classes={classes}
                competitionShortCode={params.shortCode}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
