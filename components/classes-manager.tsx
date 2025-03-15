"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { getParticipantsByBatchId } from "@/lib/data";

interface ClassesManagerProps {
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

export function ClassesManager({ classes }: ClassesManagerProps) {
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchMaxParticipants, setNewBatchMaxParticipants] = useState("10");

  const handleAddBatch = () => {
    // Simulate API call
    setTimeout(() => {
      toast("Batch added", {
        description: `Batch "${newBatchName}" has been added to the class.`,
      });
      setNewBatchName("");
      setNewBatchMaxParticipants("10");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {classes.map((cls) => (
          <AccordionItem key={cls.id} value={`class-${cls.id}`}>
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center justify-between w-full pr-4">
                <span>{cls.name}</span>
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-2">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium">Batches</h4>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Batch
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Batch</DialogTitle>
                        <DialogDescription>
                          Add a new batch to the {cls.name} class.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="batch-name">Batch Name</Label>
                          <Input
                            id="batch-name"
                            placeholder="Batch 3"
                            value={newBatchName}
                            onChange={(e) => setNewBatchName(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="max-participants">
                            Maximum Participants
                          </Label>
                          <Input
                            id="max-participants"
                            type="number"
                            placeholder="10"
                            value={newBatchMaxParticipants}
                            onChange={(e) =>
                              setNewBatchMaxParticipants(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddBatch}>Add Batch</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cls.batches.map((batch) => {
                    const participants = getParticipantsByBatchId(batch.id);
                    const participantCount = participants.length;

                    return (
                      <Card key={batch.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between items-center">
                            <span>{batch.name}</span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {participantCount} / {batch.maxParticipants}{" "}
                            participants
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
