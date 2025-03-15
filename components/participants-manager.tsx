"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PencilIcon, SearchIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getParticipantsByBatchId } from "@/lib/data";

interface ParticipantsManagerProps {
  classes: {
    id: number;
    competitionId: number;
    name: string;
    batches: {
      id: number;
      name: string;
      maxParticipants: number;
    }[];
  }[];
}

export function ParticipantsManager({ classes }: ParticipantsManagerProps) {
  const [selectedClass, setSelectedClass] = useState<string>(
    classes[0]?.id.toString() || ""
  );
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingParticipant, setIsEditingParticipant] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<{
    id: number;
    number: string;
    name: string;
    nickname: string;
    club: string;
  } | null>(null);

  // Get all batches for the selected class
  const batches = selectedClass
    ? classes.find((c) => c.id.toString() === selectedClass)?.batches || []
    : [];

  // Get participants for the selected batch
  const participants = selectedBatch
    ? getParticipantsByBatchId(Number.parseInt(selectedBatch))
    : [];

  // Filter participants based on search query
  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number.includes(searchQuery) ||
      p.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedBatch("");
  };

  const handleEditParticipant = (participant: {
    id: number;
    number: string;
    name: string;
    nickname: string;
    club: string;
  }) => {
    setSelectedParticipant(participant);
    setIsEditingParticipant(true);
  };

  const handleSaveParticipant = () => {
    // Simulate API call
    setTimeout(() => {
      toast("Participant updated", {
        description: "Participant details have been updated successfully.",
      });
      setIsEditingParticipant(false);
    }, 500);
  };

  const handleDeleteParticipant = (participantId: number) => {
    // Simulate API call
    setTimeout(() => {
      toast("Participant deleted", {
        description: "Participant has been removed from the competition.",
      });
    }, 500);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ...existing code...
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // ...existing code...
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <Label htmlFor="class-select" className="mb-2 block">
            Class
          </Label>
          <Select value={selectedClass} onValueChange={handleClassChange}>
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

        <div className="md:w-1/3">
          <Label htmlFor="batch-select" className="mb-2 block">
            Batch
          </Label>
          <Select
            value={selectedBatch}
            onValueChange={setSelectedBatch}
            disabled={!selectedClass || batches.length === 0}
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

        <div className="md:w-1/3">
          <Label htmlFor="search" className="mb-2 block">
            Search
          </Label>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search participants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {selectedBatch ? (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Nickname</TableHead>
                <TableHead>Club</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">
                      {participant.number}
                    </TableCell>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.nickname}</TableCell>
                    <TableCell>{participant.club}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditParticipant(participant)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteParticipant(participant.id)
                          }
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No participants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Dialog
            open={isEditingParticipant}
            onOpenChange={setIsEditingParticipant}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Participant</DialogTitle>
                <DialogDescription>
                  Update the participant's information.
                </DialogDescription>
              </DialogHeader>
              {selectedParticipant && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="participant-number">Number</Label>
                    <Input
                      id="participant-number"
                      defaultValue={selectedParticipant.number}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="participant-name">Name</Label>
                    <Input
                      id="participant-name"
                      defaultValue={selectedParticipant.name}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="participant-nickname">Nickname</Label>
                    <Input
                      id="participant-nickname"
                      defaultValue={selectedParticipant.nickname}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="participant-club">Club</Label>
                    <Input
                      id="participant-club"
                      defaultValue={selectedParticipant.club}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={handleSaveParticipant}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 border rounded-md">
          <p className="text-muted-foreground">
            {selectedClass
              ? "Select a batch to view participants"
              : "Select a class and batch to view participants"}
          </p>
        </div>
      )}
    </div>
  );
}
