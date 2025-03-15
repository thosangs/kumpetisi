"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParticipantsList } from "@/components/participants-list";

interface ClassesListProps {
  classes: {
    id: number;
    competitionId: number;
    name: string;
    stages: {
      id: number;
      name: string;
      status: string;
    }[];
    batches: {
      id: number;
      name: string;
      maxParticipants: number;
      stageId: number;
    }[];
  }[];
  competitionShortCode: string;
}

// This would typically come from an API
const getParticipantsByBatchId = (batchId: number) => {
  const participantsData = [
    {
      id: 1,
      batchId: 1,
      name: "Sophia Johnson",
      number: "101",
      club: "Lampung Riders",
      nickname: "Speedy",
      position: 1,
      penaltyPoints: 0,
    },
    {
      id: 2,
      batchId: 1,
      name: "Emma Williams",
      number: "102",
      club: "Jakarta BMX Club",
      nickname: "Flash",
      position: 2,
      penaltyPoints: 0,
    },
    {
      id: 3,
      batchId: 1,
      name: "Olivia Brown",
      number: "103",
      club: "Bali Pushers",
      nickname: "Rocket",
      position: 3,
      penaltyPoints: 5,
    },
    {
      id: 4,
      batchId: 1,
      name: "Ava Jones",
      number: "104",
      club: "Surabaya Racers",
      nickname: "Thunder",
      position: 4,
      penaltyPoints: 0,
    },
    {
      id: 5,
      batchId: 1,
      name: "Isabella Miller",
      number: "105",
      club: "Bandung Bikers",
      nickname: "Lightning",
      position: 5,
      penaltyPoints: 0,
    },
    {
      id: 6,
      batchId: 2,
      name: "Mia Davis",
      number: "106",
      club: "Medan Speedsters",
      nickname: "Bolt",
      position: 1,
      penaltyPoints: 0,
    },
    {
      id: 7,
      batchId: 2,
      name: "Zoe Garcia",
      number: "107",
      club: "Yogyakarta Racers",
      nickname: "Zoom",
      position: 2,
      penaltyPoints: 0,
    },
    {
      id: 8,
      batchId: 2,
      name: "Lily Rodriguez",
      number: "108",
      club: "Semarang Riders",
      nickname: "Dash",
      position: 3,
      penaltyPoints: 0,
    },
    {
      id: 9,
      batchId: 2,
      name: "Emily Wilson",
      number: "109",
      club: "Makassar BMX",
      nickname: "Blitz",
      position: 4,
      penaltyPoints: 5,
    },
    {
      id: 10,
      batchId: 2,
      name: "Chloe Martinez",
      number: "110",
      club: "Palembang Pushers",
      nickname: "Swift",
      position: 5,
      penaltyPoints: 0,
    },
    {
      id: 11,
      batchId: 3,
      name: "Noah Anderson",
      number: "201",
      club: "Lampung Riders",
      nickname: "Turbo",
      position: 1,
      penaltyPoints: 0,
    },
    {
      id: 12,
      batchId: 3,
      name: "Liam Thomas",
      number: "202",
      club: "Jakarta BMX Club",
      nickname: "Nitro",
      position: 2,
      penaltyPoints: 0,
    },
    {
      id: 13,
      batchId: 3,
      name: "Mason Taylor",
      number: "203",
      club: "Bali Pushers",
      nickname: "Blaze",
      position: 3,
      penaltyPoints: 0,
    },
    {
      id: 14,
      batchId: 3,
      name: "Jacob Moore",
      number: "204",
      club: "Surabaya Racers",
      nickname: "Jet",
      position: 4,
      penaltyPoints: 0,
    },
    {
      id: 15,
      batchId: 3,
      name: "William Jackson",
      number: "205",
      club: "Bandung Bikers",
      nickname: "Ace",
      position: 5,
      penaltyPoints: 0,
    },
  ];

  return participantsData.filter((p) => p.batchId === batchId);
};

export function ClassesList({
  classes,
  competitionShortCode,
}: ClassesListProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(
    classes[0]?.batches[0]?.id || null
  );

  const getStageStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-kumpetisi-blue">In Progress</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {classes.map((cls) => (
          <AccordionItem key={cls.id} value={`class-${cls.id}`}>
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center justify-between w-full pr-4">
                <span>{cls.name}</span>
                <Link
                  href={`/${competitionShortCode}/${cls.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </Link>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-2">
                <h4 className="text-sm font-medium mb-4">Stages</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {cls.stages.map((stage) => (
                    <Card key={stage.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex justify-between items-center">
                          <span>{stage.name}</span>
                          {getStageStatusBadge(stage.status)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {
                            cls.batches.filter((b) => b.stageId === stage.id)
                              .length
                          }{" "}
                          batches
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <h4 className="text-sm font-medium mb-2">Batches</h4>
                <Tabs
                  defaultValue={cls.batches[0]?.id.toString()}
                  onValueChange={(value) =>
                    setSelectedBatchId(Number.parseInt(value))
                  }
                >
                  <TabsList className="mb-4">
                    {cls.batches.map((batch) => {
                      const stage = cls.stages.find(
                        (s) => s.id === batch.stageId
                      );
                      return (
                        <TabsTrigger key={batch.id} value={batch.id.toString()}>
                          {batch.name} ({stage?.name})
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {cls.batches.map((batch) => {
                    const stage = cls.stages.find(
                      (s) => s.id === batch.stageId
                    );
                    return (
                      <TabsContent key={batch.id} value={batch.id.toString()}>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                              {batch.name}
                            </CardTitle>
                            <CardDescription>
                              {stage?.name} - Maximum {batch.maxParticipants}{" "}
                              participants
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ParticipantsList
                              participants={getParticipantsByBatchId(batch.id)}
                              showResults={stage?.status !== "scheduled"}
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
