// Competition types
export interface Competition {
  id: number;
  name: string;
  shortCode: string;
  date: string;
  location: string;
  participants: number;
  classes: number;
  logo: string;
  rules: string;
  schedule: string;
  status?: string;
}

// Class types
export interface CompetitionClass {
  id: number;
  competitionId: number;
  name: string;
  stages: Stage[];
  batches: Batch[];
}

export interface Stage {
  id: number;
  name: string;
  status: "scheduled" | "in_progress" | "completed";
  order: number;
}

export interface Batch {
  id: number;
  name: string;
  maxParticipants: number;
  stageId: number;
  races: Race[];
}

export interface Race {
  id: number;
  batchId: number;
  name: string;
  status: "scheduled" | "in_progress" | "completed";
  order: number;
  type: "qualifying" | "semifinal" | "final";
}

// Participant types
export interface Participant {
  id: number;
  batchId: number;
  name: string;
  number: string;
  club: string;
  nickname: string;
}

// Result types
export interface RaceResult {
  id: number;
  raceId: number;
  participantId: number;
  startPosition: number;
  finishPosition: number;
  penaltyPoints: number;
  raceTime?: string; // Optional for future use
}

// Aggregate result for a participant across multiple races
export interface ParticipantAggregateResult {
  participantId: number;
  races: {
    raceId: number;
    startPosition: number;
    finishPosition: number;
    penaltyPoints: number;
  }[];
  totalPoints: number;
  finalPosition: number;
}
