"use client";

import { useState } from "react";
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
import { RaceResultsForm } from "@/components/race-results-form";
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
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [isAddingRace, setIsAddingRace] = useState(false);
  const [newRaceName, setNewRaceName] = useState("");

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

  // Get races for the selected batch
  const races = selectedBatchId
    ? selectedClass?.batches.find((b) => b.id.toString() === selectedBatchId)
        ?.races || []
    : [];

  // Get participants for the selected batch
  const participants = selectedBatchId
    ? getParticipantsByBatchId(Number.parseInt(selectedBatchId))
    : [];

  // Get race results for the selected race
  const raceResults = selectedRaceId
    ? getRaceResultsByRaceId(Number.parseInt(selectedRaceId))
    : [];

  // Format race results for the form
  const formattedResults = raceResults.map((result) => ({
    participantId: result.participantId,
    position: result.position,
    penaltyPoints: result.penaltyPoints,
  }));

  // Get the selected race
  const selectedRace = races.find((r) => r.id.toString() === selectedRaceId);

  const handleClassChange = (value: string) => {
    setSelectedClassId(value);
    setSelectedStageId("");
    setSelectedBatchId("");
    setSelectedRaceId("");
  };

  const handleStageChange = (value: string) => {
    setSelectedStageId(value);
    setSelectedBatchId("");
    setSelectedRaceId("");
  };

  const handleBatchChange = (value: string) => {
    setSelectedBatchId(value);
    setSelectedRaceId("");
  };

  const handleAddRace = () => {
    if (!newRaceName || !selectedBatchId) {
      toast("Missing information", {
        description: "Please enter a race name and select a batch.",
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
    // For now, we'll just close the form
    setSelectedRaceId("");
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
            <CardTitle>Select Race</CardTitle>
            <CardDescription>
              Choose a class, stage, batch, and race to manage results
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
                <Label htmlFor="race-select">Race</Label>
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
                          placeholder="Race 1"
                          value={newRaceName}
                          onChange={(e) => setNewRaceName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddRace}>Add Race</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                value={selectedRaceId}
                onValueChange={setSelectedRaceId}
                disabled={!selectedBatchId || races.length === 0}
              >
                <SelectTrigger id="race-select">
                  <SelectValue placeholder="Select a race" />
                </SelectTrigger>
                <SelectContent>
                  {races.map((race) => (
                    <SelectItem key={race.id} value={race.id.toString()}>
                      {race.name} {getRaceStatusBadge(race.status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Race Results</CardTitle>
            <CardDescription>
              {selectedRace
                ? `Manage results for ${selectedRace.name}`
                : "Select a race to manage results"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRace && participants.length > 0 ? (
              <RaceResultsForm
                race={selectedRace}
                participants={participants}
                existingResults={formattedResults}
                onSave={handleSaveResults}
              />
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground">
                  {!selectedBatchId
                    ? "Select a batch to view races"
                    : races.length === 0
                    ? "No races found for this batch. Add a race to get started."
                    : "Select a race to manage results"}
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
