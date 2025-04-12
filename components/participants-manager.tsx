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
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingParticipant, setIsEditingParticipant] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<{
    id: number;
    number: string;
    name: string;
    nickname: string;
    club: string;
    classId: number;
    batchId: number;
  } | null>(null);

  // Get all participants from all batches
  const allParticipants = classes.flatMap((cls) =>
    cls.batches.flatMap((batch) =>
      getParticipantsByBatchId(batch.id).map((participant) => ({
        ...participant,
        classId: cls.id,
        className: cls.name,
        batchId: batch.id,
        batchName: batch.name,
      }))
    )
  );

  // Filter participants based on search query
  const filteredParticipants = allParticipants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number.includes(searchQuery) ||
      p.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.batchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditParticipant = (participant: {
    id: number;
    number: string;
    name: string;
    nickname: string;
    club: string;
    classId: number;
    batchId: number;
  }) => {
    setSelectedParticipant(participant);
    setIsEditingParticipant(true);
  };

  const handleSaveParticipant = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success("Participant updated", {
        description: "Participant details have been updated successfully.",
      });
      setIsEditingParticipant(false);
    }, 500);
  };

  const handleDeleteParticipant = (participantId: number) => {
    // Simulate API call
    setTimeout(() => {
      toast.error("Participant deleted", {
        description: "Participant has been removed from the competition.",
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-full">
          <Label htmlFor="search" className="mb-2 block">
            Search
          </Label>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search participants by name, number, club, class, or batch..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Batch</TableHead>
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
                  <TableCell>{participant.className}</TableCell>
                  <TableCell>{participant.batchName}</TableCell>
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
                        onClick={() => handleDeleteParticipant(participant.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
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
    </div>
  );
}
