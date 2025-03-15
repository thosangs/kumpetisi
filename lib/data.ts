import type {
  Competition,
  CompetitionClass,
  Participant,
  RaceResult,
} from "@/types";

// This would typically come from an API
export const getCompetitions = (): Competition[] => {
  return [
    {
      id: 1,
      name: "Lampung Race 2025",
      shortCode: "lr25",
      date: "May 15-17, 2025",
      location: "Lampung, Indonesia",
      participants: 120,
      classes: 8,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
      rules: `<h1>Competition Rules</h1>
<h2>General Rules</h2>
<ol>
  <li>All participants must wear safety gear</li>
  <li>Bikes must meet safety standards</li>
  <li>No outside assistance during races</li>
</ol>
<h2>Race Format</h2>
<ul>
  <li>Qualifying rounds</li>
  <li>Quarter-finals</li>
  <li>Semi-finals</li>
  <li>Finals</li>
</ul>`,
      schedule: `<h1>Event Schedule</h1>
<h2>Day 1 - May 15, 2025</h2>
<ul>
  <li>08:00 - 10:00: Registration</li>
  <li>10:30 - 12:30: Qualifying rounds (Classes 1-4)</li>
  <li>14:00 - 16:00: Qualifying rounds (Classes 5-8)</li>
</ul>
<h2>Day 2 - May 16, 2025</h2>
<ul>
  <li>09:00 - 12:00: Quarter-finals</li>
  <li>13:30 - 16:30: Semi-finals</li>
</ul>
<h2>Day 3 - May 17, 2025</h2>
<ul>
  <li>09:00 - 12:00: Finals</li>
  <li>14:00 - 15:00: Award ceremony</li>
</ul>`,
      status: "upcoming",
    },
    {
      id: 2,
      name: "Jakarta BMX Championship",
      shortCode: "jbc24",
      date: "August 5-7, 2024",
      location: "Jakarta, Indonesia",
      participants: 85,
      classes: 6,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
      rules: `<h1>Competition Rules</h1>
<h2>General Rules</h2>
<ol>
  <li>All participants must wear safety gear</li>
  <li>Bikes must meet safety standards</li>
  <li>No outside assistance during races</li>
</ol>
<h2>Race Format</h2>
<ul>
  <li>Qualifying rounds</li>
  <li>Semi-finals</li>
  <li>Finals</li>
</ul>`,
      schedule: `<h1>Event Schedule</h1>
<h2>Day 1 - August 5, 2024</h2>
<ul>
  <li>08:00 - 10:00: Registration</li>
  <li>10:30 - 12:30: Qualifying rounds</li>
  <li>14:00 - 16:00: Practice sessions</li>
</ul>
<h2>Day 2 - August 6, 2024</h2>
<ul>
  <li>09:00 - 12:00: Semi-finals</li>
  <li>13:30 - 16:30: Practice sessions</li>
</ul>
<h2>Day 3 - August 7, 2024</h2>
<ul>
  <li>09:00 - 12:00: Finals</li>
  <li>14:00 - 15:00: Award ceremony</li>
</ul>`,
      status: "upcoming",
    },
    {
      id: 3,
      name: "Bali Pushbike Open",
      shortCode: "bpo24",
      date: "October 12-14, 2024",
      location: "Bali, Indonesia",
      participants: 150,
      classes: 10,
      logo: "https://placeholder.pics/svg/?height=100&width=100",
      rules: `<h1>Competition Rules</h1>
<h2>General Rules</h2>
<ol>
  <li>All participants must wear safety gear</li>
  <li>Bikes must meet safety standards</li>
  <li>No outside assistance during races</li>
</ol>
<h2>Race Format</h2>
<ul>
  <li>Qualifying rounds</li>
  <li>Quarter-finals</li>
  <li>Semi-finals</li>
  <li>Finals</li>
</ul>`,
      schedule: `<h1>Event Schedule</h1>
<h2>Day 1 - October 12, 2024</h2>
<ul>
  <li>08:00 - 10:00: Registration</li>
  <li>10:30 - 12:30: Qualifying rounds</li>
  <li>14:00 - 16:00: Practice sessions</li>
</ul>
<h2>Day 2 - October 13, 2024</h2>
<ul>
  <li>09:00 - 12:00: Quarter-finals and Semi-finals</li>
  <li>13:30 - 16:30: Practice sessions</li>
</ul>
<h2>Day 3 - October 14, 2024</h2>
<ul>
  <li>09:00 - 12:00: Finals</li>
  <li>14:00 - 15:00: Award ceremony</li>
</ul>`,
      status: "upcoming",
    },
  ];
};

export const getCompetitionByShortCode = (
  shortCode: string
): Competition | undefined => {
  return getCompetitions().find((comp) => comp.shortCode === shortCode);
};

export const getCompetitionById = (id: number): Competition | undefined => {
  return getCompetitions().find((comp) => comp.id === id);
};

// This would typically come from an API
export const getClasses = (): CompetitionClass[] => {
  return [
    {
      id: 1,
      competitionId: 1,
      name: "2020 Girl",
      stages: [
        { id: 1, name: "Quarter Final", status: "completed", order: 1 },
        { id: 2, name: "Semi Final", status: "completed", order: 2 },
        { id: 3, name: "Amateur Final", status: "in_progress", order: 3 },
        { id: 4, name: "Main Final", status: "scheduled", order: 4 },
      ],
      batches: [
        {
          id: 1,
          name: "Batch 1",
          maxParticipants: 10,
          stageId: 1,
          races: [
            {
              id: 1,
              batchId: 1,
              name: "Race 1",
              status: "completed",
              order: 1,
            },
            {
              id: 2,
              batchId: 1,
              name: "Race 2",
              status: "completed",
              order: 2,
            },
            {
              id: 3,
              batchId: 1,
              name: "Race 3",
              status: "completed",
              order: 3,
            },
          ],
        },
        {
          id: 2,
          name: "Batch 2",
          maxParticipants: 10,
          stageId: 1,
          races: [
            {
              id: 4,
              batchId: 2,
              name: "Race 1",
              status: "completed",
              order: 1,
            },
            {
              id: 5,
              batchId: 2,
              name: "Race 2",
              status: "completed",
              order: 2,
            },
            {
              id: 6,
              batchId: 2,
              name: "Race 3",
              status: "completed",
              order: 3,
            },
          ],
        },
        {
          id: 3,
          name: "Batch 1",
          maxParticipants: 10,
          stageId: 2,
          races: [
            {
              id: 7,
              batchId: 3,
              name: "Race 1",
              status: "completed",
              order: 1,
            },
            {
              id: 8,
              batchId: 3,
              name: "Race 2",
              status: "completed",
              order: 2,
            },
          ],
        },
        {
          id: 4,
          name: "Batch 1",
          maxParticipants: 10,
          stageId: 3,
          races: [
            {
              id: 9,
              batchId: 4,
              name: "Race 1",
              status: "in_progress",
              order: 1,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      competitionId: 1,
      name: "2021 Boy",
      stages: [
        { id: 5, name: "Quarter Final", status: "completed", order: 1 },
        { id: 6, name: "Semi Final", status: "in_progress", order: 2 },
        { id: 7, name: "Amateur Final", status: "scheduled", order: 3 },
        { id: 8, name: "Main Final", status: "scheduled", order: 4 },
      ],
      batches: [
        {
          id: 5,
          name: "Batch 1",
          maxParticipants: 10,
          stageId: 5,
          races: [
            {
              id: 10,
              batchId: 5,
              name: "Race 1",
              status: "completed",
              order: 1,
            },
            {
              id: 11,
              batchId: 5,
              name: "Race 2",
              status: "completed",
              order: 2,
            },
          ],
        },
        {
          id: 6,
          name: "Batch 2",
          maxParticipants: 10,
          stageId: 5,
          races: [
            {
              id: 12,
              batchId: 6,
              name: "Race 1",
              status: "completed",
              order: 1,
            },
            {
              id: 13,
              batchId: 6,
              name: "Race 2",
              status: "completed",
              order: 2,
            },
          ],
        },
        {
          id: 7,
          name: "Batch 1",
          maxParticipants: 10,
          stageId: 6,
          races: [
            {
              id: 14,
              batchId: 7,
              name: "Race 1",
              status: "in_progress",
              order: 1,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      competitionId: 1,
      name: "FFA Max 2025 Boy",
      stages: [
        { id: 9, name: "Quarter Final", status: "in_progress", order: 1 },
        { id: 10, name: "Semi Final", status: "scheduled", order: 2 },
        { id: 11, name: "Amateur Final", status: "scheduled", order: 3 },
        { id: 12, name: "Main Final", status: "scheduled", order: 4 },
      ],
      batches: [
        {
          id: 8,
          name: "Batch 1",
          maxParticipants: 10,
          stageId: 9,
          races: [
            {
              id: 15,
              batchId: 8,
              name: "Race 1",
              status: "in_progress",
              order: 1,
            },
          ],
        },
        {
          id: 9,
          name: "Batch 2",
          maxParticipants: 10,
          stageId: 9,
          races: [
            {
              id: 16,
              batchId: 9,
              name: "Race 1",
              status: "in_progress",
              order: 1,
            },
          ],
        },
      ],
    },
  ];
};

export const getClassesByCompetitionId = (
  competitionId: number
): CompetitionClass[] => {
  return getClasses().filter((cls) => cls.competitionId === competitionId);
};

export const getClassByCompetitionIdAndName = (
  competitionId: number,
  className: string
): CompetitionClass | undefined => {
  const formattedClassName = className
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return getClasses().find(
    (cls) =>
      cls.competitionId === competitionId &&
      cls.name.toLowerCase() === formattedClassName.toLowerCase()
  );
};

// This would typically come from an API
export const getParticipants = (): Participant[] => {
  return [
    {
      id: 1,
      batchId: 1,
      name: "Sophia Johnson",
      number: "101",
      club: "Lampung Riders",
      nickname: "Speedy",
    },
    {
      id: 2,
      batchId: 1,
      name: "Emma Williams",
      number: "102",
      club: "Jakarta BMX Club",
      nickname: "Flash",
    },
    {
      id: 3,
      batchId: 1,
      name: "Olivia Brown",
      number: "103",
      club: "Bali Pushers",
      nickname: "Rocket",
    },
    {
      id: 4,
      batchId: 1,
      name: "Ava Jones",
      number: "104",
      club: "Surabaya Racers",
      nickname: "Thunder",
    },
    {
      id: 5,
      batchId: 1,
      name: "Isabella Miller",
      number: "105",
      club: "Bandung Bikers",
      nickname: "Lightning",
    },
    {
      id: 6,
      batchId: 2,
      name: "Mia Davis",
      number: "106",
      club: "Medan Speedsters",
      nickname: "Bolt",
    },
    {
      id: 7,
      batchId: 2,
      name: "Zoe Garcia",
      number: "107",
      club: "Yogyakarta Racers",
      nickname: "Zoom",
    },
    {
      id: 8,
      batchId: 2,
      name: "Lily Rodriguez",
      number: "108",
      club: "Semarang Riders",
      nickname: "Dash",
    },
    {
      id: 9,
      batchId: 2,
      name: "Emily Wilson",
      number: "109",
      club: "Makassar BMX",
      nickname: "Blitz",
    },
    {
      id: 10,
      batchId: 2,
      name: "Chloe Martinez",
      number: "110",
      club: "Palembang Pushers",
      nickname: "Swift",
    },
    {
      id: 11,
      batchId: 3,
      name: "Noah Anderson",
      number: "201",
      club: "Lampung Riders",
      nickname: "Turbo",
    },
    {
      id: 12,
      batchId: 3,
      name: "Liam Thomas",
      number: "202",
      club: "Jakarta BMX Club",
      nickname: "Nitro",
    },
    {
      id: 13,
      batchId: 3,
      name: "Mason Taylor",
      number: "203",
      club: "Bali Pushers",
      nickname: "Blaze",
    },
    {
      id: 14,
      batchId: 3,
      name: "Jacob Moore",
      number: "204",
      club: "Surabaya Racers",
      nickname: "Jet",
    },
    {
      id: 15,
      batchId: 3,
      name: "William Jackson",
      number: "205",
      club: "Bandung Bikers",
      nickname: "Ace",
    },
  ];
};

export const getParticipantsByBatchId = (batchId: number): Participant[] => {
  return getParticipants().filter((p) => p.batchId === batchId);
};

// This would typically come from an API
export const getRaceResults = (): RaceResult[] => {
  return [
    // Race 1 (Batch 1, Quarter Final) results
    { id: 1, raceId: 1, participantId: 1, position: 1, penaltyPoints: 0 },
    { id: 2, raceId: 1, participantId: 2, position: 2, penaltyPoints: 0 },
    { id: 3, raceId: 1, participantId: 3, position: 3, penaltyPoints: 5 },
    { id: 4, raceId: 1, participantId: 4, position: 4, penaltyPoints: 0 },
    { id: 5, raceId: 1, participantId: 5, position: 5, penaltyPoints: 0 },

    // Race 2 (Batch 1, Quarter Final) results
    { id: 6, raceId: 2, participantId: 1, position: 2, penaltyPoints: 0 },
    { id: 7, raceId: 2, participantId: 2, position: 1, penaltyPoints: 0 },
    { id: 8, raceId: 2, participantId: 3, position: 3, penaltyPoints: 0 },
    { id: 9, raceId: 2, participantId: 4, position: 5, penaltyPoints: 0 },
    { id: 10, raceId: 2, participantId: 5, position: 4, penaltyPoints: 0 },

    // Race 3 (Batch 1, Quarter Final) results
    { id: 11, raceId: 3, participantId: 1, position: 1, penaltyPoints: 0 },
    { id: 12, raceId: 3, participantId: 2, position: 3, penaltyPoints: 0 },
    { id: 13, raceId: 3, participantId: 3, position: 2, penaltyPoints: 0 },
    { id: 14, raceId: 3, participantId: 4, position: 4, penaltyPoints: 0 },
    { id: 15, raceId: 3, participantId: 5, position: 5, penaltyPoints: 0 },

    // Race 1 (Batch 2, Quarter Final) results
    { id: 16, raceId: 4, participantId: 6, position: 1, penaltyPoints: 0 },
    { id: 17, raceId: 4, participantId: 7, position: 2, penaltyPoints: 0 },
    { id: 18, raceId: 4, participantId: 8, position: 3, penaltyPoints: 0 },
    { id: 19, raceId: 4, participantId: 9, position: 4, penaltyPoints: 5 },
    { id: 20, raceId: 4, participantId: 10, position: 5, penaltyPoints: 0 },

    // Race 1 (Batch 1, Semi Final) results
    { id: 21, raceId: 7, participantId: 11, position: 1, penaltyPoints: 0 },
    { id: 22, raceId: 7, participantId: 12, position: 2, penaltyPoints: 0 },
    { id: 23, raceId: 7, participantId: 13, position: 3, penaltyPoints: 0 },
    { id: 24, raceId: 7, participantId: 14, position: 4, penaltyPoints: 0 },
    { id: 25, raceId: 7, participantId: 15, position: 5, penaltyPoints: 0 },
  ];
};

export const getRaceResultsByRaceId = (raceId: number): RaceResult[] => {
  return getRaceResults().filter((result) => result.raceId === raceId);
};

export const getParticipantRaceResults = (
  participantId: number,
  raceIds: number[]
): RaceResult[] => {
  return getRaceResults().filter(
    (result) =>
      result.participantId === participantId && raceIds.includes(result.raceId)
  );
};
