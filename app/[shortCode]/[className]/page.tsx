export const runtime = "edge";

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCompetitionByShortCode,
  getClassByCompetitionIdAndName,
  getParticipantsByBatchId,
  getRaceResultsByRaceId,
} from "@/lib/data";
import type { Participant, Race } from "@/types";

type Props = {
  params: { shortCode: string; className: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const competition = getCompetitionByShortCode(params.shortCode);

  if (!competition) {
    return {
      title: "Competition Not Found",
      description: "The requested competition could not be found.",
    };
  }

  const formattedClassName = params.className
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${formattedClassName} Results - ${competition.name}`,
    description: `View the results for the ${formattedClassName} class in ${competition.name}`,
    openGraph: {
      title: `${formattedClassName} Results - ${competition.name}`,
      description: `View the results for the ${formattedClassName} class in ${competition.name}`,
      type: "website",
    },
  };
}

export default function ClassResultsPage({ params }: Props) {
  const competition = getCompetitionByShortCode(params.shortCode);

  if (!competition) {
    notFound();
  }

  const classData = getClassByCompetitionIdAndName(
    competition.id,
    params.className
  );

  if (!classData) {
    notFound();
  }

  // Sort stages by order
  const sortedStages = [...classData.stages].sort((a, b) => a.order - b.order);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href={`/${params.shortCode}`}>
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {classData.name} Results
          </h1>
          <p className="text-muted-foreground">
            {competition.name} - {competition.date}
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {sortedStages.map((stage) => {
          const stageBatches = classData.batches.filter(
            (batch) => batch.stageId === stage.id
          );

          return (
            <div key={stage.id} className="space-y-6">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold">{stage.name}</h2>
                {getStageStatusBadge(stage.status)}
              </div>

              {stage.status === "scheduled" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Scheduled</CardTitle>
                    <CardDescription>
                      This stage has not started yet. Check back later for
                      results.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="space-y-8">
                  {stageBatches.map((batch) => {
                    const participants = getParticipantsByBatchId(batch.id);

                    return (
                      <Card key={batch.id}>
                        <CardHeader>
                          <CardTitle>{batch.name}</CardTitle>
                          <CardDescription>
                            {stage.name} - {participants.length} participants
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {batch.races.length > 0 ? (
                            <div className="space-y-6">
                              <EnhancedRaceResultsTable
                                races={batch.races}
                                participants={participants}
                              />
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              No races found for this batch.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStageStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="ml-2 bg-green-600">Completed</Badge>;
    case "in_progress":
      return <Badge className="ml-2 bg-kumpetisi-blue">In Progress</Badge>;
    case "scheduled":
      return (
        <Badge className="ml-2" variant="outline">
          Scheduled
        </Badge>
      );
    default:
      return (
        <Badge className="ml-2" variant="outline">
          {status}
        </Badge>
      );
  }
}

interface EnhancedRaceResultsTableProps {
  races: Race[];
  participants: Participant[];
}

function EnhancedRaceResultsTable({
  races,
  participants,
}: EnhancedRaceResultsTableProps) {
  // Sort races by order
  const sortedRaces = [...races].sort((a, b) => a.order - b.order);

  // Get results for all races
  const raceResults = sortedRaces.map((race) => {
    const results = getRaceResultsByRaceId(race.id);
    return {
      race,
      results,
    };
  });

  // Calculate aggregate results for each participant
  const aggregateResults = participants.map((participant) => {
    const participantResults = raceResults.map(({ race, results }) => {
      const result = results.find((r) => r.participantId === participant.id);
      return {
        raceId: race.id,
        raceName: race.name,
        startPosition: result?.startPosition || 0,
        finishPosition: result?.finishPosition || 0,
        penaltyPoints: result?.penaltyPoints || 0,
      };
    });

    // Calculate total points (sum of finish positions + penalties)
    const totalPoints = participantResults.reduce(
      (sum, result) => sum + result.finishPosition + result.penaltyPoints,
      0
    );

    return {
      participant,
      results: participantResults,
      totalPoints,
      finalPosition: 0, // Will be set after sorting
    };
  });

  // Sort by total points (lower is better)
  const sortedResults = [...aggregateResults].sort(
    (a, b) => a.totalPoints - b.totalPoints
  );

  // Assign final positions
  sortedResults.forEach((result, index) => {
    result.finalPosition = index + 1;
  });

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2}>Position</TableHead>
            <TableHead rowSpan={2}>Number</TableHead>
            <TableHead rowSpan={2}>Name</TableHead>
            <TableHead rowSpan={2}>Nickname</TableHead>
            {sortedRaces.map((race) => (
              <TableHead
                key={race.id}
                colSpan={3}
                className="text-center border-x"
              >
                {race.name}
              </TableHead>
            ))}
            <TableHead rowSpan={2}>Total Points</TableHead>
          </TableRow>
          <TableRow>
            {sortedRaces.map((race) => (
              <React.Fragment key={`header-${race.id}`}>
                <TableHead className="text-xs">Start</TableHead>
                <TableHead className="text-xs">Finish</TableHead>
                <TableHead className="text-xs">Penalty</TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.map((result) => (
            <TableRow key={result.participant.id}>
              <TableCell className="font-medium">
                {result.finalPosition}
              </TableCell>
              <TableCell>{result.participant.number}</TableCell>
              <TableCell>{result.participant.name}</TableCell>
              <TableCell>{result.participant.nickname}</TableCell>

              {result.results.map((raceResult) => (
                <React.Fragment key={`result-${raceResult.raceId}`}>
                  <TableCell className="border-l text-center">
                    {raceResult.startPosition || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {raceResult.finishPosition || "-"}
                  </TableCell>
                  <TableCell className="border-r text-center">
                    {raceResult.penaltyPoints > 0 ? (
                      <Badge variant="destructive">
                        +{raceResult.penaltyPoints}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </React.Fragment>
              ))}

              <TableCell className="font-medium">
                {result.totalPoints || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
