export const runtime = "edge";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon, UploadIcon, TrophyIcon } from "lucide-react";
import { CompetitionForm } from "@/components/competition-form";
import { ClassesManager } from "@/components/classes-manager";
import { ParticipantsManager } from "@/components/participants-manager";
import { getCompetitionById, getClassesByCompetitionId } from "@/lib/data";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number.parseInt(params.id);
  const competition = id ? getCompetitionById(id) : null;

  if (!competition) {
    return {
      title: "Competition Not Found",
      description: "The requested competition could not be found.",
    };
  }

  return {
    title: `Manage ${competition.name}`,
    description: `Manage ${competition.name} competition details, classes, and participants.`,
  };
}

export default function CompetitionManagementPage({ params }: Props) {
  const id = Number.parseInt(params.id);
  const competition = id ? getCompetitionById(id) : null;

  if (!competition) {
    notFound();
  }

  const classes = getClassesByCompetitionId(competition.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Competition
          </h1>
          <p className="text-muted-foreground">
            Edit competition details, manage classes and participants
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href={`/${competition.shortCode}`}>
            <Button variant="outline">View Public Page</Button>
          </Link>
          <Link href={`/dashboard/kompetisi/${competition.id}/results`}>
            <Button className="bg-kumpetisi-blue hover:bg-kumpetisi-blue/90">
              <TrophyIcon className="mr-2 h-4 w-4" />
              Manage Results
            </Button>
          </Link>
          <Link href={`/dashboard/kompetisi/${competition.id}/upload`}>
            <Button>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Participants
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Competition Details</CardTitle>
              <CardDescription>
                Edit the details of your competition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompetitionForm competition={competition} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="classes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Classes & Batches</CardTitle>
                <CardDescription>
                  Manage classes and batches for this competition
                </CardDescription>
              </div>
              <Button size="sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </CardHeader>
            <CardContent>
              <ClassesManager classes={classes} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="participants">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  Manage participants for this competition
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Participant
                </Button>
                <Link href={`/dashboard/kompetisi/${competition.id}/upload`}>
                  <Button size="sm">
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload CSV
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ParticipantsManager classes={classes} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
