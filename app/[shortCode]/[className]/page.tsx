export const runtime = "edge";

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
import type { Participant, Race, RaceResult } from "@/types";

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
                              {batch.races.map((race) => (
                                <RaceResultsTable
                                  key={race.id}
                                  race={race}
                                  participants={participants}
                                  results={getRaceResultsByRaceId(race.id)}
                                />
                              ))}

                              {batch.races.length > 1 && (
                                <AggregateResultsTable
                                  races={batch.races}
                                  participants={participants}
                                />
                              )}
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

interface RaceResultsTableProps {
  race: Race;
  participants: Participant[];
  results: RaceResult[];
}

function RaceResultsTable({
  race,
  participants,
  results,
}: RaceResultsTableProps) {
  // Sort results by position
  const sortedResults = [...results].sort((a, b) => a.position - b.position);

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">
        {race.name} {getRaceStatusBadge(race.status)}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Nickname</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Penalty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.map((result) => {
            const participant = participants.find(
              (p) => p.id === result.participantId
            );

            if (!participant) return null;

            return (
              <TableRow key={result.id}>
                <TableCell className="font-medium">{result.position}</TableCell>
                <TableCell>{participant.number}</TableCell>
                <TableCell>{participant.name}</TableCell>
                <TableCell>{participant.nickname}</TableCell>
                <TableCell>{participant.club}</TableCell>
                <TableCell>
                  {result.penaltyPoints > 0 ? (
                    <Badge variant="destructive">+{result.penaltyPoints}</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function getRaceStatusBadge(status: string) {
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

interface AggregateResultsTableProps {
  races: Race[];
  participants: Participant[];
}

function AggregateResultsTable({
  races,
  participants,
}: AggregateResultsTableProps) {
  // Calculate aggregate results
  const aggregateResults = participants.map((participant) => {
    let totalPoints = 0;
    let totalPenalty = 0;

    races.forEach((race) => {
      const results = getRaceResultsByRaceId(race.id);
      const participantResult = results.find(
        (r) => r.participantId === participant.id
      );

      if (participantResult) {
        // Points are based on position (1st = 1 point, 2nd = 2 points, etc.)
        totalPoints += participantResult.position;
        totalPenalty += participantResult.penaltyPoints;
      }
    });

    return {
      participant,
      totalPoints,
      totalPenalty,
      // Final position will be determined by sorting
      finalPosition: 0,
    };
  });

  // Sort by total points (lower is better) + penalties
  const sortedResults = [...aggregateResults].sort(
    (a, b) => a.totalPoints + a.totalPenalty - (b.totalPoints + b.totalPenalty)
  );

  // Assign final positions
  sortedResults.forEach((result, index) => {
    result.finalPosition = index + 1;
  });

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 text-kumpetisi-blue">
        Aggregate Results
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Final Position</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Total Points</TableHead>
            <TableHead>Total Penalty</TableHead>
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
              <TableCell>{result.participant.club}</TableCell>
              <TableCell>{result.totalPoints}</TableCell>
              <TableCell>
                {result.totalPenalty > 0 ? (
                  <Badge variant="destructive">+{result.totalPenalty}</Badge>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
