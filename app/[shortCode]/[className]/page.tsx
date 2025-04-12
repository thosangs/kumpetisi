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

  // Get all batches across all stages and sort them by their order
  const allBatches = classData.batches
    .map((batch) => {
      // Find the associated stage for this batch
      const stage = classData.stages.find(
        (stage) => stage.id === batch.stageId
      );
      return {
        ...batch,
        stageName: stage?.name || "",
        stageOrder: stage?.order || 0,
        stageStatus: stage?.status || "scheduled",
      };
    })
    .sort((a, b) => {
      // First sort by stage order
      if (a.stageOrder !== b.stageOrder) {
        return a.stageOrder - b.stageOrder;
      }
      // Then sort by batch name/number if in the same stage
      const aNumber = parseInt(a.name.replace(/\D/g, "")) || 0;
      const bNumber = parseInt(b.name.replace(/\D/g, "")) || 0;
      return aNumber - bNumber;
    });

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center mb-4 sm:mb-8">
        <Link href={`/${params.shortCode}`}>
          <Button variant="ghost" size="icon" className="mr-1 sm:mr-2">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {classData.name} Results
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {competition.name} - {competition.date}
          </p>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {allBatches.map((batch) => {
          const participants = getParticipantsByBatchId(batch.id);

          return (
            <Card key={batch.id} className="border shadow-sm">
              <CardHeader className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      {batch.stageName} {batch.name}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {participants.length} participants
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              {batch.stageStatus === "scheduled" ? (
                <CardContent className="p-3 sm:p-6">
                  <p className="text-muted-foreground text-sm sm:text-base">
                    This batch has not started yet. Check back later for
                    results.
                  </p>
                </CardContent>
              ) : (
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  {batch.races.length > 0 ? (
                    <div className="space-y-3 sm:space-y-6">
                      <EnhancedRaceResultsTable
                        races={batch.races}
                        participants={participants}
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm sm:text-base">
                      No races found for this batch.
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
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
  const aggregateResults = React.useMemo(() => {
    const results = participants.map((participant) => {
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

      // Add the additional factors: (0.01 * LastFinishPosition) + (0.001 * FirstStartPosition)
      const lastFinishPosition =
        participantResults.length > 0
          ? participantResults[participantResults.length - 1].finishPosition
          : 0;

      const firstStartPosition =
        participantResults.length > 0 ? participantResults[0].startPosition : 0;

      const adjustedTotalPoints =
        totalPoints + 0.01 * lastFinishPosition + 0.001 * firstStartPosition;

      // Round to 3 decimal places to avoid floating-point precision issues
      const roundedTotalPoints = Math.round(adjustedTotalPoints * 1000) / 1000;

      return {
        participant,
        results: participantResults,
        totalPoints: roundedTotalPoints,
        firstStartPosition: firstStartPosition,
      };
    });

    // Sort by first start position (lower is better)
    const sortedResults = [...results].sort(
      (a, b) => a.firstStartPosition - b.firstStartPosition
    );

    return sortedResults;
  }, [participants, raceResults]);

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="py-2 px-2 sm:py-3 sm:px-4">
              ##
            </TableHead>
            <TableHead rowSpan={2} className="py-2 px-2 sm:py-3 sm:px-4">
              Nama
            </TableHead>
            <TableHead rowSpan={2} className="py-2 px-2 sm:py-3 sm:px-4">
              Nick
            </TableHead>
            {sortedRaces.map((race) => (
              <TableHead
                key={race.id}
                colSpan={3}
                className="text-center border-x py-2 px-1 sm:py-3 sm:px-3"
              >
                {race.name}
              </TableHead>
            ))}
            <TableHead rowSpan={2} className="py-2 px-2 sm:py-3 sm:px-4">
              Point
            </TableHead>
          </TableRow>
          <TableRow>
            {sortedRaces.map((race) => (
              <React.Fragment key={`header-${race.id}`}>
                <TableHead className="text-xs py-1 px-1 sm:py-2 sm:px-2">
                  S
                </TableHead>
                <TableHead className="text-xs py-1 px-1 sm:py-2 sm:px-2">
                  F
                </TableHead>
                <TableHead className="text-xs py-1 px-1 sm:py-2 sm:px-2">
                  Pen
                </TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {aggregateResults.map((result) => (
            <TableRow key={result.participant.id}>
              <TableCell className="py-1 px-2 sm:py-2 sm:px-4">
                {result.participant.number}
              </TableCell>
              <TableCell className="py-1 px-2 sm:py-2 sm:px-4">
                {result.participant.name}
              </TableCell>
              <TableCell className="py-1 px-2 sm:py-2 sm:px-4">
                {result.participant.nickname}
              </TableCell>

              {result.results.map((raceResult) => (
                <React.Fragment key={`result-${raceResult.raceId}`}>
                  <TableCell className="border-l text-center py-1 px-1 sm:py-2 sm:px-2">
                    {raceResult.startPosition || "-"}
                  </TableCell>
                  <TableCell className="text-center py-1 px-1 sm:py-2 sm:px-2">
                    {raceResult.finishPosition || "-"}
                  </TableCell>
                  <TableCell className="border-r text-center py-1 px-1 sm:py-2 sm:px-2">
                    {raceResult.penaltyPoints > 0 ? (
                      <Badge
                        variant="destructive"
                        className="text-xs sm:text-sm"
                      >
                        +{raceResult.penaltyPoints}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </React.Fragment>
              ))}

              <TableCell className="font-medium py-1 px-2 sm:py-2 sm:px-4">
                {result.totalPoints || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
