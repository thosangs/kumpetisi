"use client";

import { useState } from "react";
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

interface RaceResultsFormProps {
  race: Race;
  participants: Participant[];
  existingResults?: {
    participantId: number;
    position: number;
    penaltyPoints: number;
  }[];
  onSave: () => void;
}

export function RaceResultsForm({
  race,
  participants,
  existingResults = [],
  onSave,
}: RaceResultsFormProps) {
  const [results, setResults] = useState(
    participants.map((p) => {
      const existing = existingResults.find((r) => r.participantId === p.id);
      return {
        participantId: p.id,
        position: existing?.position || null,
        penaltyPoints: existing?.penaltyPoints || 0,
      };
    })
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePositionChange = (participantId: number, position: string) => {
    setResults((prev) =>
      prev.map((result) =>
        result.participantId === participantId
          ? { ...result, position: position ? Number.parseInt(position) : null }
          : result
      )
    );
  };

  const handlePenaltyChange = (participantId: number, penalty: string) => {
    setResults((prev) =>
      prev.map((result) =>
        result.participantId === participantId
          ? { ...result, penaltyPoints: penalty ? Number.parseInt(penalty) : 0 }
          : result
      )
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Validate that all positions are unique and within range
    const positions = results.map((r) => r.position).filter(Boolean);
    const uniquePositions = new Set(positions);

    if (positions.length !== uniquePositions.size) {
      toast("Invalid positions", {
        description: "Each participant must have a unique position.",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast("Results saved", {
        description: `Results for ${race.name} have been updated successfully.`,
      });
      setIsSubmitting(false);
      onSave();
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Results for {race.name}</CardTitle>
        <CardDescription>
          Enter the position and any penalty points for each participant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Club</TableHead>
              <TableHead className="w-24">Position</TableHead>
              <TableHead className="w-24">Penalty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => {
              const result = results.find(
                (r) => r.participantId === participant.id
              );

              return (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">
                    {participant.number}
                  </TableCell>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.club}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      max={participants.length}
                      value={result?.position || ""}
                      onChange={(e) =>
                        handlePositionChange(participant.id, e.target.value)
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
                        handlePenaltyChange(participant.id, e.target.value)
                      }
                      className="w-16"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
