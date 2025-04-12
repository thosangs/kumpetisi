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
import { EnhancedRaceResultsForm } from "@/components/enhanced-race-results-form";
import {
  getCompetitionById,
  getClassesByCompetitionId,
  getParticipantsByBatchId,
  getRaceResultsByRaceId,
} from "@/lib/data";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RaceResultsManager } from "@/components/race-results-manager";

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
  const rawCompetition = id ? getCompetitionById(id) : null;
  const competition = rawCompetition
    ? {
        id: rawCompetition.id,
        name: rawCompetition.name,
        short_code: rawCompetition.shortCode,
        description: "", // Required by type but not in data
        start_date: rawCompetition.date,
        end_date: rawCompetition.date,
        location: rawCompetition.location,
        rules: rawCompetition.rules,
        schedule: rawCompetition.schedule,
        status: rawCompetition.status,
        classes: [], // Optional but good to provide empty array
      }
    : null;

  if (!competition) {
    notFound();
  }

  const initialClassesData = getClassesByCompetitionId(competition.id);

  const preparedClasses = initialClassesData.map((c) => {
    const numBatches = c.batches?.length || 0;
    const numberOfMotos = numBatches === 1 ? 3 : 2;

    return {
      ...c,
      batches: (c.batches || []).map((b) => ({
        ...b,
        motos: Array.from({ length: numberOfMotos }, (_, i) => ({
          id: i + 1,
          name: `Moto ${i + 1}`,
        })),
      })),
    };
  });

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
          <Link href={`/${competition.short_code}`}>
            <Button variant="outline">View Public Page</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
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
            <CardHeader>
              <div>
                <CardTitle>Classes & Batches</CardTitle>
                <CardDescription>
                  Manage classes and their generated batches/stages for this
                  competition
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ClassesManager
                competitionId={competition.id}
                initialClasses={preparedClasses}
              />
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
              <ParticipantsManager classes={preparedClasses} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="results">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Race Results</CardTitle>
                <CardDescription>
                  Manage race results for this competition
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <RaceResultsManager classes={preparedClasses} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
