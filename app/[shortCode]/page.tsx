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

// This would typically come from an API
const getCompetitionByShortCode = (shortCode: string) => {
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
      rules: `<h1>Competition Rules</h1>
<h2>General Rules</h2>
<ol>
  <li>All participants must wear safety gear</li>
  <li>Bikes must meet safety standards</li>
  <li>No outside assistance during races</li>
</ol>
<h2>Race Format</h2>
<ul>
  <li>Qualifying rounds</li>
  <li>Quarter-finals</li>
  <li>Semi-finals</li>
  <li>Finals</li>
</ul>`,
      schedule: `<h1>Event Schedule</h1>
<h2>Day 1 - May 15, 2025</h2>
<ul>
  <li>08:00 - 10:00: Registration</li>
  <li>10:30 - 12:30: Qualifying rounds (Classes 1-4)</li>
  <li>14:00 - 16:00: Qualifying rounds (Classes 5-8)</li>
</ul>
<h2>Day 2 - May 16, 2025</h2>
<ul>
  <li>09:00 - 12:00: Quarter-finals</li>
  <li>13:30 - 16:30: Semi-finals</li>
</ul>
<h2>Day 3 - May 17, 2025</h2>
<ul>
  <li>09:00 - 12:00: Finals</li>
  <li>14:00 - 15:00: Award ceremony</li>
</ul>`,
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
      rules: `<h1>Competition Rules</h1>
<h2>General Rules</h2>
<ol>
  <li>All participants must wear safety gear</li>
  <li>Bikes must meet safety standards</li>
  <li>No outside assistance during races</li>
</ol>
<h2>Race Format</h2>
<ul>
  <li>Qualifying rounds</li>
  <li>Semi-finals</li>
  <li>Finals</li>
</ul>`,
      schedule: `<h1>Event Schedule</h1>
<h2>Day 1 - August 5, 2024</h2>
<ul>
  <li>08:00 - 10:00: Registration</li>
  <li>10:30 - 12:30: Qualifying rounds</li>
  <li>14:00 - 16:00: Practice sessions</li>
</ul>
<h2>Day 2 - August 6, 2024</h2>
<ul>
  <li>09:00 - 12:00: Semi-finals</li>
  <li>13:30 - 16:30: Practice sessions</li>
</ul>
<h2>Day 3 - August 7, 2024</h2>
<ul>
  <li>09:00 - 12:00: Finals</li>
  <li>14:00 - 15:00: Award ceremony</li>
</ul>`,
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
      rules: `<h1>Competition Rules</h1>
<h2>General Rules</h2>
<ol>
  <li>All participants must wear safety gear</li>
  <li>Bikes must meet safety standards</li>
  <li>No outside assistance during races</li>
</ol>
<h2>Race Format</h2>
<ul>
  <li>Qualifying rounds</li>
  <li>Quarter-finals</li>
  <li>Semi-finals</li>
  <li>Finals</li>
</ul>`,
      schedule: `<h1>Event Schedule</h1>
<h2>Day 1 - October 12, 2024</h2>
<ul>
  <li>08:00 - 10:00: Registration</li>
  <li>10:30 - 12:30: Qualifying rounds</li>
  <li>14:00 - 16:00: Practice sessions</li>
</ul>
<h2>Day 2 - October 13, 2024</h2>
<ul>
  <li>09:00 - 12:00: Quarter-finals and Semi-finals</li>
  <li>13:30 - 16:30: Practice sessions</li>
</ul>
<h2>Day 3 - October 14, 2024</h2>
<ul>
  <li>09:00 - 12:00: Finals</li>
  <li>14:00 - 15:00: Award ceremony</li>
</ul>`,
    },
  ];

  return competitions.find((comp) => comp.shortCode === shortCode);
};

// This would typically come from an API
const getClassesByCompetitionId = (competitionId: number) => {
  const classesData = [
    {
      id: 1,
      competitionId: 1,
      name: "2020 Girl",
      stages: [
        { id: 1, name: "Quarter Final", status: "completed" },
        { id: 2, name: "Semi Final", status: "completed" },
        { id: 3, name: "Amateur Final", status: "in_progress" },
        { id: 4, name: "Main Final", status: "scheduled" },
      ],
      batches: [
        { id: 1, name: "Batch 1", maxParticipants: 10, stageId: 1 },
        { id: 2, name: "Batch 2", maxParticipants: 10, stageId: 1 },
        { id: 3, name: "Batch 1", maxParticipants: 10, stageId: 2 },
        { id: 4, name: "Batch 1", maxParticipants: 10, stageId: 3 },
      ],
    },
    {
      id: 2,
      competitionId: 1,
      name: "2021 Boy",
      stages: [
        { id: 5, name: "Quarter Final", status: "completed" },
        { id: 6, name: "Semi Final", status: "in_progress" },
        { id: 7, name: "Amateur Final", status: "scheduled" },
        { id: 8, name: "Main Final", status: "scheduled" },
      ],
      batches: [
        { id: 5, name: "Batch 1", maxParticipants: 10, stageId: 5 },
        { id: 6, name: "Batch 2", maxParticipants: 10, stageId: 5 },
        { id: 7, name: "Batch 1", maxParticipants: 10, stageId: 6 },
      ],
    },
    {
      id: 3,
      competitionId: 1,
      name: "FFA Max 2025 Boy",
      stages: [
        { id: 9, name: "Quarter Final", status: "in_progress" },
        { id: 10, name: "Semi Final", status: "scheduled" },
        { id: 11, name: "Amateur Final", status: "scheduled" },
        { id: 12, name: "Main Final", status: "scheduled" },
      ],
      batches: [
        { id: 8, name: "Batch 1", maxParticipants: 10, stageId: 9 },
        { id: 9, name: "Batch 2", maxParticipants: 10, stageId: 9 },
      ],
    },
    {
      id: 4,
      competitionId: 2,
      name: "2019 Girl",
      stages: [
        { id: 13, name: "Quarter Final", status: "scheduled" },
        { id: 14, name: "Semi Final", status: "scheduled" },
        { id: 15, name: "Main Final", status: "scheduled" },
      ],
      batches: [{ id: 10, name: "Batch 1", maxParticipants: 10, stageId: 13 }],
    },
    {
      id: 5,
      competitionId: 2,
      name: "2020 Boy",
      stages: [
        { id: 16, name: "Quarter Final", status: "scheduled" },
        { id: 17, name: "Semi Final", status: "scheduled" },
        { id: 18, name: "Main Final", status: "scheduled" },
      ],
      batches: [{ id: 11, name: "Batch 1", maxParticipants: 10, stageId: 16 }],
    },
    {
      id: 6,
      competitionId: 3,
      name: "2018 Girl",
      stages: [
        { id: 19, name: "Quarter Final", status: "scheduled" },
        { id: 20, name: "Semi Final", status: "scheduled" },
        { id: 21, name: "Main Final", status: "scheduled" },
      ],
      batches: [{ id: 12, name: "Batch 1", maxParticipants: 10, stageId: 19 }],
    },
  ];

  return classesData.filter((cls) => cls.competitionId === competitionId);
};

type Props = {
  params: { shortCode: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const competition = getCompetitionByShortCode(params.shortCode);

  if (!competition) {
    return {
      title: "Competition Not Found",
      description: "The requested competition could not be found.",
    };
  }

  return {
    title: competition.name,
    description: `${competition.name} - ${competition.date} at ${competition.location}`,
    openGraph: {
      title: competition.name,
      description: `${competition.name} - ${competition.date} at ${competition.location}`,
      type: "website",
    },
  };
}

export default function CompetitionPage({ params }: Props) {
  const competition = getCompetitionByShortCode(params.shortCode);

  if (!competition) {
    notFound();
  }

  const classes = getClassesByCompetitionId(competition.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/4">
          <Image
            src={competition.logo || "https://placeholder.pics/svg/"}
            alt={competition.name}
            width={200}
            height={200}
            className="w-full max-w-[200px] h-auto object-contain rounded-lg mx-auto md:mx-0"
          />
        </div>
        <div className="md:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-3xl font-bold">{competition.name}</h1>
            <Badge variant="outline" className="mt-2 md:mt-0">
              {competition.date}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span>{competition.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
              <span>{competition.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users2Icon className="h-5 w-5 text-muted-foreground" />
              <span>{competition.participants} participants</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Competition Details</CardTitle>
              <CardDescription>
                Overview of the {competition.name} competition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompetitionDetails competition={competition} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Classes & Participants</CardTitle>
              <CardDescription>
                View all classes and participants in this competition
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
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Competition Rules</CardTitle>
              <CardDescription>
                Official rules for {competition.name}
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
                Detailed schedule for {competition.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HtmlContent content={competition.schedule} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
