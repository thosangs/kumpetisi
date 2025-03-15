"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { Participant, Race } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedRaceResultsFormProps {
  batchId: number;
  races: Race[];
  participants: Participant[];
  existingResults?: {
    raceId: number;
    participantId: number;
    startPosition: number;
    finishPosition: number;
    penaltyPoints: number;
  }[];
  onSave: () => void;
  totalBatchCount: number;
}

export function EnhancedRaceResultsForm({
  batchId,
  races,
  participants,
  existingResults = [],
  onSave,
  totalBatchCount,
}: EnhancedRaceResultsFormProps) {
  const [activeTab, setActiveTab] = useState<string>("race-1");
  const [results, setResults] = useState<{
    [raceId: number]: {
      [participantId: number]: {
        startPosition: number | null;
        finishPosition: number | null;
        penaltyPoints: number;
      };
    };
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine race structure based on total batch count
  const raceStructure = getRaceStructure(totalBatchCount);

  // Initialize results state from existing results
  useEffect(() => {
    const initialResults: any = {};

    races.forEach((race) => {
      initialResults[race.id] = {};

      participants.forEach((participant) => {
        const existingResult = existingResults.find(
          (r) => r.raceId === race.id && r.participantId === participant.id
        );

        initialResults[race.id][participant.id] = {
          startPosition: existingResult?.startPosition || null,
          finishPosition: existingResult?.finishPosition || null,
          penaltyPoints: existingResult?.penaltyPoints || 0,
        };
      });
    });

    setResults(initialResults);
  }, [races, participants, existingResults]);

  const handleStartPositionChange = (
    raceId: number,
    participantId: number,
    value: string
  ) => {
    setResults((prev) => ({
      ...prev,
      [raceId]: {
        ...prev[raceId],
        [participantId]: {
          ...prev[raceId][participantId],
          startPosition: value ? Number.parseInt(value) : null,
        },
      },
    }));
  };

  const handleFinishPositionChange = (
    raceId: number,
    participantId: number,
    value: string
  ) => {
    setResults((prev) => ({
      ...prev,
      [raceId]: {
        ...prev[raceId],
        [participantId]: {
          ...prev[raceId][participantId],
          finishPosition: value ? Number.parseInt(value) : null,
        },
      },
    }));
  };

  const handlePenaltyChange = (
    raceId: number,
    participantId: number,
    value: string
  ) => {
    setResults((prev) => ({
      ...prev,
      [raceId]: {
        ...prev[raceId],
        [participantId]: {
          ...prev[raceId][participantId],
          penaltyPoints: value ? Number.parseInt(value) : 0,
        },
      },
    }));
  };

  const validateResults = () => {
    // Check if all required fields are filled
    for (const raceId in results) {
      const raceResults = results[raceId];

      // Get all finish positions that are set
      const finishPositions = Object.values(raceResults)
        .map((r) => r.finishPosition)
        .filter((p) => p !== null) as number[];

      // Check for duplicate finish positions
      const uniquePositions = new Set(finishPositions);
      if (finishPositions.length !== uniquePositions.size) {
        toast("Invalid positions", {
          description:
            "Each participant must have a unique finish position in a race.",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateResults()) {
      return;
    }

    setIsSubmitting(true);

    // Format results for submission
    const formattedResults = Object.entries(results).flatMap(
      ([raceId, raceResults]) =>
        Object.entries(raceResults).map(([participantId, result]) => ({
          raceId: Number.parseInt(raceId),
          participantId: Number.parseInt(participantId),
          startPosition: result.startPosition || 0,
          finishPosition: result.finishPosition || 0,
          penaltyPoints: result.penaltyPoints,
        }))
    );

    // Simulate API call
    setTimeout(() => {
      console.log("Submitting results:", formattedResults);
      toast("Results saved", {
        description: "Race results have been updated successfully.",
      });
      setIsSubmitting(false);
      onSave();
    }, 1000);
  };

  // Sort races by order
  const sortedRaces = [...races].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Race Results</CardTitle>
        <CardDescription>
          Enter the start position, finish position, and any penalty points for
          each participant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {sortedRaces.map((race, index) => (
              <TabsTrigger key={race.id} value={`race-${index + 1}`}>
                {race.name}
              </TabsTrigger>
            ))}
            <TabsTrigger value="all-races">All Races</TabsTrigger>
          </TabsList>

          {sortedRaces.map((race, index) => (
            <TabsContent key={race.id} value={`race-${index + 1}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Nickname</TableHead>
                    <TableHead className="w-24">Start Position</TableHead>
                    <TableHead className="w-24">Finish Position</TableHead>
                    <TableHead className="w-24">Penalty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => {
                    const result = results[race.id]?.[participant.id];

                    return (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">
                          {participant.number}
                        </TableCell>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>{participant.nickname}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max={participants.length}
                            value={result?.startPosition || ""}
                            onChange={(e) =>
                              handleStartPositionChange(
                                race.id,
                                participant.id,
                                e.target.value
                              )
                            }
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max={participants.length}
                            value={result?.finishPosition || ""}
                            onChange={(e) =>
                              handleFinishPositionChange(
                                race.id,
                                participant.id,
                                e.target.value
                              )
                            }
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={result?.penaltyPoints || ""}
                            onChange={(e) =>
                              handlePenaltyChange(
                                race.id,
                                participant.id,
                                e.target.value
                              )
                            }
                            className="w-16"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
          ))}

          <TabsContent value="all-races">
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableHead rowSpan={2}>Final Points</TableHead>
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
                {participants.map((participant) => {
                  // Calculate final points
                  const finalPoints = calculateFinalPoints(
                    participant.id,
                    results
                  );

                  return (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">
                        {participant.number}
                      </TableCell>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{participant.nickname}</TableCell>

                      {sortedRaces.map((race) => {
                        const result = results[race.id]?.[participant.id];

                        return (
                          <React.Fragment
                            key={`result-${race.id}-${participant.id}`}
                          >
                            <TableCell className="border-l">
                              <Input
                                type="number"
                                min="1"
                                max={participants.length}
                                value={result?.startPosition || ""}
                                onChange={(e) =>
                                  handleStartPositionChange(
                                    race.id,
                                    participant.id,
                                    e.target.value
                                  )
                                }
                                className="w-12 h-8 text-xs"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                max={participants.length}
                                value={result?.finishPosition || ""}
                                onChange={(e) =>
                                  handleFinishPositionChange(
                                    race.id,
                                    participant.id,
                                    e.target.value
                                  )
                                }
                                className="w-12 h-8 text-xs"
                              />
                            </TableCell>
                            <TableCell className="border-r">
                              <Input
                                type="number"
                                min="0"
                                value={result?.penaltyPoints || ""}
                                onChange={(e) =>
                                  handlePenaltyChange(
                                    race.id,
                                    participant.id,
                                    e.target.value
                                  )
                                }
                                className="w-12 h-8 text-xs"
                              />
                            </TableCell>
                          </React.Fragment>
                        );
                      })}

                      <TableCell className="font-medium">
                        {finalPoints}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-kumpetisi-blue hover:bg-kumpetisi-blue/90"
        >
          {isSubmitting ? "Saving..." : "Save Results"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to determine race structure based on batch count
function getRaceStructure(batchCount: number) {
  if (batchCount === 1) {
    return {
      type: "single-batch",
      raceCount: 3,
      description: "3 races to determine winners",
    };
  } else if (batchCount === 2) {
    return {
      type: "qualifying-final",
      raceCount: 3, // 2 qualifying + 1 final
      description: "2 qualifying races + 1 final race",
    };
  } else {
    return {
      type: "semifinal-final",
      raceCount: 3, // 2 semifinal + 1 final
      description: "2 semifinal races + 1 final race",
    };
  }
}

// Helper function to calculate final points based on race results
function calculateFinalPoints(participantId: number, results: any) {
  let totalPoints = 0;

  // Sum up finish positions and penalties across all races
  Object.values(results).forEach((raceResults: any) => {
    const result = raceResults[participantId];
    if (result && result.finishPosition) {
      totalPoints += result.finishPosition + (result.penaltyPoints || 0);
    }
  });

  return totalPoints || "-";
}
