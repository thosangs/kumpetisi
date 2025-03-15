"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { EnhancedRaceResultsForm } from "@/components/enhanced-race-results-form";
import {
  getCompetitionById,
  getClassesByCompetitionId,
  getParticipantsByBatchId,
  getRaceResultsByRaceId,
} from "@/lib/data";

export default function ManageResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = Number.parseInt(params.id);
  const competition = getCompetitionById(id);
  const classes = getClassesByCompetitionId(id);

  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id.toString() || ""
  );
  const [selectedStageId, setSelectedStageId] = useState<string>("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [isAddingRace, setIsAddingRace] = useState(false);
  const [newRaceName, setNewRaceName] = useState("");
  const [newRaceType, setNewRaceType] = useState<
    "qualifying" | "semifinal" | "final"
  >("qualifying");

  // Get the selected class
  const selectedClass = classes.find(
    (c) => c.id.toString() === selectedClassId
  );

  // Get stages for the selected class
  const stages = selectedClass?.stages || [];

  // Get batches for the selected stage
  const batches =
    selectedClass?.batches.filter(
      (b) => b.stageId.toString() === selectedStageId
    ) || [];

  // Get total batch count for the selected stage
  const totalBatchCount = batches.length;

  // Get races for the selected batch
  const races = selectedBatchId
    ? selectedClass?.batches.find((b) => b.id.toString() === selectedBatchId)
        ?.races || []
    : [];

  // Get participants for the selected batch
  const participants = selectedBatchId
    ? getParticipantsByBatchId(Number.parseInt(selectedBatchId))
    : [];

  // Get race results for all races in the selected batch
  const [raceResults, setRaceResults] = useState<any[]>([]);

  useEffect(() => {
    if (selectedBatchId && races.length > 0) {
      const results = races.flatMap((race) => {
        const raceResults = getRaceResultsByRaceId(race.id);
        return raceResults.map((result) => ({
          raceId: race.id,
          participantId: result.participantId,
          startPosition: result.startPosition || 0,
          finishPosition: result.finishPosition || 0,
          penaltyPoints: result.penaltyPoints,
        }));
      });

      setRaceResults(results);
    } else {
      setRaceResults([]);
    }
    // Only run this effect when the dependencies actually change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatchId, JSON.stringify(races)]);

  const handleClassChange = (value: string) => {
    setSelectedClassId(value);
    setSelectedStageId("");
    setSelectedBatchId("");
  };

  const handleStageChange = (value: string) => {
    setSelectedStageId(value);
    setSelectedBatchId("");
  };

  const handleBatchChange = (value: string) => {
    setSelectedBatchId(value);
  };

  const handleAddRace = () => {
    if (!newRaceName || !selectedBatchId || !newRaceType) {
      toast("Missing information", {
        description:
          "Please enter a race name, select a type, and select a batch.",
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast("Race added", {
        description: `Race "${newRaceName}" has been added to the batch.`,
      });
      setIsAddingRace(false);
      setNewRaceName("");
      // In a real app, we would refresh the races list here
    }, 500);
  };

  const handleSaveResults = () => {
    // In a real app, we would refresh the race results here
    toast("Results saved", {
      description: "Race results have been updated successfully.",
    });
  };

  if (!competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Competition Not Found
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href={`/dashboard/kompetisi/${id}`}>
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Race Results
          </h1>
          <p className="text-muted-foreground">{competition.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Batch</CardTitle>
            <CardDescription>
              Choose a class, stage, and batch to manage race results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="stage-select">Stage</Label>
              <Select
                value={selectedStageId}
                onValueChange={handleStageChange}
                disabled={!selectedClassId || stages.length === 0}
              >
                <SelectTrigger id="stage-select">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id.toString()}>
                      {stage.name} {getStageStatusBadge(stage.status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-select">Batch</Label>
              <Select
                value={selectedBatchId}
                onValueChange={handleBatchChange}
                disabled={!selectedStageId || batches.length === 0}
              >
                <SelectTrigger id="batch-select">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Races</Label>
                <Dialog open={isAddingRace} onOpenChange={setIsAddingRace}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedBatchId}
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Race
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Race</DialogTitle>
                      <DialogDescription>
                        Add a new race to the selected batch.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="race-name">Race Name</Label>
                        <Input
                          id="race-name"
                          placeholder="Moto 1"
                          value={newRaceName}
                          onChange={(e) => setNewRaceName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="race-type">Race Type</Label>
                        <Select
                          value={newRaceType}
                          onValueChange={(value) =>
                            setNewRaceType(value as any)
                          }
                        >
                          <SelectTrigger id="race-type">
                            <SelectValue placeholder="Select race type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="qualifying">
                              Qualifying
                            </SelectItem>
                            <SelectItem value="semifinal">Semifinal</SelectItem>
                            <SelectItem value="final">Final</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddRace}>Add Race</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {races.length > 0 ? (
                <div className="space-y-2 border rounded-md p-3">
                  {races.map((race) => (
                    <div
                      key={race.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <span>{race.name}</span>
                        {getRaceStatusBadge(race.status)}
                      </div>
                      <Badge variant="outline">{race.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-3 border rounded-md text-muted-foreground">
                  {selectedBatchId
                    ? "No races found. Add a race to get started."
                    : "Select a batch to view races."}
                </div>
              )}
            </div>

            {selectedBatchId && (
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Race Structure</h4>
                <div className="text-sm text-muted-foreground">
                  {totalBatchCount === 1 ? (
                    <p>Single batch: 3 races to determine winners</p>
                  ) : totalBatchCount === 2 ? (
                    <p>Two batches: 2 qualifying races + 1 final race</p>
                  ) : (
                    <p>Multiple batches: 2 semifinal races + 1 final race</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Race Results</CardTitle>
            <CardDescription>
              {selectedBatchId
                ? `Manage results for ${
                    batches.find((b) => b.id.toString() === selectedBatchId)
                      ?.name
                  }`
                : "Select a batch to manage race results"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedBatchId && races.length > 0 && participants.length > 0 ? (
              <EnhancedRaceResultsForm
                batchId={Number.parseInt(selectedBatchId)}
                races={races}
                participants={participants}
                existingResults={raceResults}
                onSave={handleSaveResults}
                totalBatchCount={totalBatchCount}
              />
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground">
                  {!selectedBatchId
                    ? "Select a batch to view races"
                    : races.length === 0
                    ? "No races found for this batch. Add a race to get started."
                    : "No participants found for this batch."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
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
