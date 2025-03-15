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

interface BatchResultsFormProps {
  batch: {
    id: number;
    name: string;
    maxParticipants: number;
    stageId: number;
  };
  participants: {
    id: number;
    batchId: number;
    name: string;
    number: string;
    club: string;
    nickname: string;
    position?: number;
    penaltyPoints?: number;
  }[];
  onSave: () => void;
}

export function BatchResultsForm({
  batch,
  participants,
  onSave,
}: BatchResultsFormProps) {
  const [results, setResults] = useState(
    participants.map((p) => ({
      id: p.id,
      position: p.position || null,
      penaltyPoints: p.penaltyPoints || 0,
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePositionChange = (id: number, position: string) => {
    setResults((prev) =>
      prev.map((result) =>
        result.id === id
          ? { ...result, position: position ? Number.parseInt(position) : null }
          : result
      )
    );
  };

  const handlePenaltyChange = (id: number, penalty: string) => {
    setResults((prev) =>
      prev.map((result) =>
        result.id === id
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
        description: "Batch results have been updated successfully.",
      });
      setIsSubmitting(false);
      onSave();
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Results for {batch.name}</CardTitle>
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
              const result = results.find((r) => r.id === participant.id);

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
