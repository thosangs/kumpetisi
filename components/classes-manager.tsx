"use client";

import { useState, useEffect } from "react";
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

// Define the structure for a Moto
interface Moto {
  id: number; // Or string, depending on how you generate IDs
  name: string; // "Moto 1", "Moto 2", "Moto 3"
}

// Define the structure for a Batch (which can be a qualifying batch, semi-final, final, etc.)
interface Batch {
  id: number; // Or string
  name: string; // e.g., "Batch 1", "Semi Final 1", "Final Grand Champion"
  maxParticipants: number;
  motos: Moto[]; // Each batch has motos
}

// Define the structure for a Class
interface CompetitionClass {
  id: number; // Or string
  competitionId: number; // Or string
  name: string; // e.g., "2020 Girl", "2021 Boy", "2017 Mix"
  batches: Batch[];
}

interface ClassesManagerProps {
  initialClasses: CompetitionClass[]; // Renamed prop
  competitionId: number; // Needed for creating new classes
  // Add a function prop to notify parent about class changes if needed
  // onClassesUpdate?: (updatedClasses: CompetitionClass[]) => void;
}

// Helper to calculate groups needed
const calculateGroups = (riders: number, maxPerGroup: number): number => {
  // Ensure at least 1 group if there are any riders
  if (riders <= 0) return 0;
  return Math.ceil(riders / maxPerGroup);
};

// Helper to generate motos
const generateMotos = (count: number): Moto[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Moto ${i + 1}`,
  }));
};

// Ordered list of the 8 possible final stage names
const FINAL_STAGE_NAMES = [
  "Final Grand Champion",
  "Final Champion",
  "Final Pro",
  "Final Novice",
  "Final Rookie",
  "Final Beginner",
  "Final Amateur",
  "Final Newbie",
];

// Helper function to generate batch names and motos based on rules
const generateBatchesForClass = (
  numQualifyingBatches: number,
  maxParticipants: number
): Batch[] => {
  const N = numQualifyingBatches;
  const maxP = maxParticipants;

  // Handle N=1 case: Only one group total, the top final, with 3 motos
  if (N === 1) {
    const motos = generateMotos(3);
    const id = Date.now();
    return [
      { id: id, name: FINAL_STAGE_NAMES[0], maxParticipants: maxP, motos }, // Final Grand Champion
    ];
  }

  const allBatches: Omit<Batch, "id" | "motos">[] = [];
  let qfGeneratedCount = 0;
  let semiGeneratedCount = 0;
  // Remove flags: needsGrandChampionFinal, needsChampionFinal

  // 1. Add initial qualifying batches ("Batch 1", "Batch 2", ...)
  for (let i = 1; i <= N; i++) {
    allBatches.push({ name: `Batch ${i}`, maxParticipants: maxP });
  }

  // 2. Add INTERMEDIATE stages derived *directly* from initial batch results
  //    (Kualifikasi, Semifinals, Quarter Finals based on rules)
  switch (N) {
    case 2: // P1-4 -> FGC, P5-8 -> FC. No intermediate stages.
      break;
    case 3: // P1-4 -> Semi, P5-6 -> Qual, P7-8 -> Pro.
      semiGeneratedCount = calculateGroups(N * 4, maxP);
      for (let i = 1; i <= semiGeneratedCount; i++)
        allBatches.push({ name: `Semifinal ${i}`, maxParticipants: maxP });
      const qualCount3 = calculateGroups(N * 2, maxP);
      for (let i = 1; i <= qualCount3; i++)
        allBatches.push({ name: `Kualifikasi ${i}`, maxParticipants: maxP });
      // Note: Final Pro is added in step 3
      break;
    case 4: // P1-4 -> Semi, P5-6 -> Pro, P7-8 -> Novice.
      semiGeneratedCount = calculateGroups(N * 4, maxP);
      for (let i = 1; i <= semiGeneratedCount; i++)
        allBatches.push({ name: `Semifinal ${i}`, maxParticipants: maxP });
      // Note: Final Pro & Novice are added in step 3
      break;
    case 5: // P1-2 -> Semi, P3-5 -> QF, P6 -> Novice, P7 -> Qual, P8 -> Rookie.
      semiGeneratedCount = calculateGroups(N * 2, maxP);
      qfGeneratedCount = calculateGroups(N * 3, maxP);
      for (let i = 1; i <= semiGeneratedCount; i++)
        allBatches.push({ name: `Semifinal ${i}`, maxParticipants: maxP });
      for (let i = 1; i <= qfGeneratedCount; i++)
        allBatches.push({ name: `Quarter Final ${i}`, maxParticipants: maxP });
      const qualCount5 = calculateGroups(N * 1, maxP);
      for (let i = 1; i <= qualCount5; i++)
        allBatches.push({ name: `Kualifikasi ${i}`, maxParticipants: maxP });
      // Note: Final Novice & Rookie are added in step 3
      break;
    case 6: // P1-2 -> Semi, P3-4 -> QF, P5-6 -> Qual QF, P7 -> Qual FR, P8 -> Beginner.
      semiGeneratedCount = calculateGroups(N * 2, maxP);
      qfGeneratedCount = calculateGroups(N * 2, maxP);
      const qualQfCount6 = calculateGroups(N * 2, maxP);
      for (let i = 1; i <= semiGeneratedCount; i++)
        allBatches.push({ name: `Semifinal ${i}`, maxParticipants: maxP });
      for (let i = 1; i <= qfGeneratedCount; i++)
        allBatches.push({ name: `Quarter Final ${i}`, maxParticipants: maxP });
      for (let i = 1; i <= qualQfCount6; i++)
        allBatches.push({ name: `Kualifikasi QF ${i}`, maxParticipants: maxP });
      const qualFRCount6 = calculateGroups(N * 1, maxP); // P7
      for (let i = 1; i <= qualFRCount6; i++)
        allBatches.push({
          name: `Kualifikasi Final Rookie ${i}`,
          maxParticipants: maxP,
        });
      // Note: Final Beginner is added in step 3
      break;
    case 7: // P1-2 -> Semi, P3-4 -> QF, P5-6 -> Qual QF, P7 -> Qual FB, P8 -> Amateur.
      semiGeneratedCount = calculateGroups(N * 2, maxP);
      qfGeneratedCount = calculateGroups(N * 2, maxP);
      const qualQfCount7 = calculateGroups(N * 2, maxP);
      for (let i = 1; i <= semiGeneratedCount; i++)
        allBatches.push({ name: `Semifinal ${i}`, maxParticipants: maxP });
      for (let i = 1; i <= qfGeneratedCount; i++)
        allBatches.push({ name: `Quarter Final ${i}`, maxParticipants: maxP });
      for (let i = 1; i <= qualQfCount7; i++)
        allBatches.push({ name: `Kualifikasi QF ${i}`, maxParticipants: maxP });
      const qualFBCount7 = calculateGroups(N * 1, maxP); // P7
      for (let i = 1; i <= qualFBCount7; i++)
        allBatches.push({
          name: `Kualifikasi Final Beginner ${i}`,
          maxParticipants: maxP,
        });
      // Note: Final Amateur is added in step 3
      break;
    case 8: // P1-4 -> QF, P5 -> Rookie, P6 -> Beginner, P7 -> Amateur, P8 -> Newbie.
      qfGeneratedCount = calculateGroups(N * 4, maxP);
      for (let i = 1; i <= qfGeneratedCount; i++)
        allBatches.push({ name: `Quarter Final ${i}`, maxParticipants: maxP });
      // QFs progress to Semis (intermediate)
      const ridersToSemiFromQF = qfGeneratedCount * 4;
      semiGeneratedCount = calculateGroups(ridersToSemiFromQF, maxP);
      for (let i = 1; i <= semiGeneratedCount; i++)
        allBatches.push({ name: `Semifinal ${i}`, maxParticipants: maxP });
      // Note: Final Rookie, Beginner, Amateur, Newbie are added in step 3
      break;
    default:
      console.error("Invalid number of qualifying batches:", N);
      break;
  }

  // 3. Add exactly N final stages, taking names from the ordered list.
  const finalStagesToAdd = FINAL_STAGE_NAMES.slice(0, N);
  finalStagesToAdd.forEach((finalName) => {
    // Avoid adding if an intermediate stage accidentally had the same name (unlikely but safe)
    if (!allBatches.some((b) => b.name === finalName)) {
      allBatches.push({ name: finalName, maxParticipants: maxP });
    }
  });

  // 4. Generate motos (always 2 for N > 1)
  const motos = generateMotos(2);

  // 5. Add unique numeric IDs and motos to each batch
  const startTime = Date.now(); // Base timestamp for IDs
  // Filter out any potential duplicates (e.g., if an intermediate stage name matched a final)
  const uniqueBatches = allBatches.filter(
    (batch, index, self) =>
      index === self.findIndex((b) => b.name === batch.name)
  );

  return uniqueBatches.map((batch, index) => ({
    ...batch,
    id: startTime + index, // Simple sequential numeric ID
    // Assign 3 motos only if it's the single final stage for N=1 (handled at start)
    // Otherwise assign the standard 2 motos
    motos:
      batch.name === FINAL_STAGE_NAMES[0] && N === 1 ? generateMotos(3) : motos,
  }));
};

export function ClassesManager({
  initialClasses,
  competitionId,
}: ClassesManagerProps) {
  // Manage classes state internally for now
  const [classes, setClasses] = useState<CompetitionClass[]>(initialClasses);
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [numQualifyingBatches, setNumQualifyingBatches] = useState("2"); // Default to 2 groups
  const [maxParticipantsPerBatch, setMaxParticipantsPerBatch] = useState("8"); // Default max 8

  // State for the "Add Batch" dialog (still needed for adding batches manually later?)
  // Let's remove manual batch adding for now, batches are generated with the class.
  // const [isAddBatchDialogOpen, setIsAddBatchDialogOpen] = useState(false);
  // const [targetClassIdForBatch, setTargetClassIdForBatch] = useState<number | null>(null);
  // const [newBatchName, setNewBatchName] = useState("");
  // const [newBatchMaxParticipants, setNewBatchMaxParticipants] = useState("8");

  // Update local state if initialClasses prop changes
  useEffect(() => {
    setClasses(initialClasses);
  }, [initialClasses]);

  const handleAddClass = () => {
    if (!newClassName.trim()) {
      toast.error("Class name cannot be empty.");
      return;
    }
    const numBatches = parseInt(numQualifyingBatches, 10);
    const maxPart = parseInt(maxParticipantsPerBatch, 10);

    if (isNaN(numBatches) || numBatches < 1 || numBatches > 8) {
      toast.error("Number of qualifying batches must be between 1 and 8.");
      return;
    }
    if (isNaN(maxPart) || maxPart < 1 || maxPart > 8) {
      toast.error("Max participants per batch must be between 1 and 8.");
      return;
    }

    // Generate batches based on rules
    const generatedBatches = generateBatchesForClass(numBatches, maxPart);

    const newClass: CompetitionClass = {
      id: Date.now(), // Use a more robust ID generation in a real app
      competitionId: competitionId,
      name: newClassName.trim(),
      batches: generatedBatches,
    };

    // Simulate API call / Update state
    // TODO: Replace with actual API call
    setTimeout(() => {
      setClasses((prevClasses) => [...prevClasses, newClass]);
      toast.success(`Class "${newClass.name}" added successfully!`, {
        description: `${generatedBatches.length} batches/stages generated.`,
      });
      // Reset form and close dialog
      setNewClassName("");
      setNumQualifyingBatches("2");
      setMaxParticipantsPerBatch("8");
      setIsAddClassDialogOpen(false);
      // if (onClassesUpdate) {
      //   onClassesUpdate([...classes, newClass]);
      // }
    }, 300); // Simulate network delay
  };

  // Remove handleAddBatch function as batches are generated with class

  return (
    <div className="space-y-6">
      {/* Button to trigger Add Class Dialog */}
      <div className="flex justify-end mb-4">
        {" "}
        {/* Added mb-4 for spacing */}
        <Dialog
          open={isAddClassDialogOpen}
          onOpenChange={setIsAddClassDialogOpen}
        >
          <DialogTrigger asChild>
            {/* Render the Add Class button here */}
            <Button size="sm">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>
                Define a new class and automatically generate its batches based
                on rules.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="class-name">Class Name</Label>
                <Input
                  id="class-name"
                  placeholder="e.g., 2020 Girls"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="num-batches">
                  Number of Qualifying Batches (1-8)
                </Label>
                <Input
                  id="num-batches"
                  type="number"
                  min="1"
                  max="8"
                  placeholder="e.g., 4"
                  value={numQualifyingBatches}
                  onChange={(e) => setNumQualifyingBatches(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Determines the competition structure (Semifinals, Finals,
                  etc.).
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max-participants">
                  Max Participants per Batch (1-8)
                </Label>
                <Input
                  id="max-participants"
                  type="number"
                  min="1"
                  max="8"
                  placeholder="8"
                  value={maxParticipantsPerBatch}
                  onChange={(e) => setMaxParticipantsPerBatch(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Max riders starting in any single batch/stage.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddClassDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddClass}>Create Class</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                  <h4 className="text-sm font-medium">
                    Batches / Stages ({cls.batches.length})
                  </h4>
                  {/* Remove manual Add Batch button */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {" "}
                  {/* Adjust grid cols */}
                  {(cls.batches || []).map((batch) => {
                    // Assuming getParticipantsByBatchId works correctly with the new batch IDs
                    const participants = getParticipantsByBatchId(batch.id);
                    const participantCount = participants?.length ?? 0; // Handle potential undefined

                    return (
                      <Card key={batch.id} className="flex flex-col">
                        {" "}
                        {/* Ensure consistent height */}
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between items-center">
                            <span>{batch.name}</span>
                            <div className="flex items-center gap-1">
                              {/* Add Edit/Delete for batches if needed */}
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
                        <CardContent className="flex-grow flex flex-col justify-between">
                          {" "}
                          {/* Fill space */}
                          <div>
                            {" "}
                            {/* Content wrapper */}
                            <p className="text-sm text-muted-foreground mb-2">
                              {participantCount} / {batch.maxParticipants}{" "}
                              participants
                            </p>
                          </div>
                          <div className="mt-auto pt-2">
                            {" "}
                            {/* Push motos to bottom */}
                            <p className="text-xs font-medium mb-1">Motos:</p>
                            <div className="flex flex-wrap gap-1">
                              {" "}
                              {/* Wrap motos */}
                              {batch.motos.map((moto) => (
                                <Button
                                  key={moto.id}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-6 px-2" // Smaller moto buttons
                                >
                                  {moto.name}
                                </Button>
                              ))}
                            </div>
                          </div>
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
      {classes.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          No classes created yet. Add a class to get started.
        </p>
      )}
    </div>
  );
}
