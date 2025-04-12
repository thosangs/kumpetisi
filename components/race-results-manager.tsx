"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EnhancedRaceResultsForm } from "@/components/enhanced-race-results-form";
import { getParticipantsByBatchId, getRaceResultsByRaceId } from "@/lib/data";
import type { Race, Participant, RaceResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stage {
  id: number;
  name: string;
  order: number;
  status: string;
}

interface Batch {
  id: number;
  name: string;
  stageId: number;
  races: Race[];
  stageName?: string;
  stageOrder?: number;
  stageStatus?: string;
}

interface Class {
  id: number;
  name: string;
  stages: Stage[];
  batches: Batch[];
}

interface RaceResultsManagerProps {
  classes: Class[];
}

export function RaceResultsManager({ classes }: RaceResultsManagerProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id.toString() || ""
  );

  // Get the selected class
  const selectedClass = classes.find(
    (c) => c.id.toString() === selectedClassId
  );

  // Get all batches for the selected class, sorted by stage order and batch name
  const allBatches =
    selectedClass?.batches
      .map((batch: Batch) => {
        // Find the associated stage for this batch
        const stage = selectedClass.stages.find(
          (stage: Stage) => stage.id === batch.stageId
        );
        return {
          ...batch,
          stageName: stage?.name || "",
          stageOrder: stage?.order || 0,
          stageStatus: stage?.status || "scheduled",
        };
      })
      .sort((a: Batch, b: Batch) => {
        // First sort by stage order
        if ((a.stageOrder || 0) !== (b.stageOrder || 0)) {
          return (a.stageOrder || 0) - (b.stageOrder || 0);
        }
        // Then sort by batch name/number if in the same stage
        const aNumber = parseInt(a.name.replace(/\D/g, "")) || 0;
        const bNumber = parseInt(b.name.replace(/\D/g, "")) || 0;
        return aNumber - bNumber;
      }) || [];

  const handleClassChange = (value: string) => {
    setSelectedClassId(value);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2">
        <div className="space-y-1 px-4">
          <Label htmlFor="class-select">Class</Label>
          <Select value={selectedClassId} onValueChange={handleClassChange}>
            <SelectTrigger id="class-select">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id.toString()}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedClassId && allBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {allBatches.map((batch: Batch) => {
            const races = batch.races || [];
            const participants = getParticipantsByBatchId(batch.id);

            // Get existing race results
            const existingResults = races.flatMap((race: Race) => {
              const raceResults = getRaceResultsByRaceId(race.id);
              return raceResults;
            });

            // Prepare the results object for the EnhancedRaceResultsForm
            const raceResults = {
              batchId: batch.id,
              races: races.map((race) => ({
                ...race,
                batchId: batch.id,
              })),
              participants: participants,
              existingResults: existingResults,
              totalBatchCount: allBatches.length,
            };

            return (
              <div className="py-2">
                <h4 className="text-base font-bold ml-4">
                  {batch.stageName} {batch.name}
                </h4>
                <div className="p-1">
                  {races.length > 0 && participants.length > 0 ? (
                    <EnhancedRaceResultsForm results={raceResults} />
                  ) : (
                    <div className="flex items-center justify-center h-12 border rounded-md">
                      <p className="text-muted-foreground text-sm">
                        {races.length === 0
                          ? "No races found for this batch"
                          : "No participants found for this batch"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-24 border rounded-md">
          <p className="text-muted-foreground">
            {!selectedClassId
              ? "Select a class to view batches"
              : "No batches found for this class"}
          </p>
        </div>
      )}
    </div>
  );
}
