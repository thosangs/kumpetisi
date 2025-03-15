import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ParticipantsListProps {
  participants: {
    id: number;
    batchId: number;
    name: string;
    number: string;
    club: string;
    nickname: string;
    position?: number;
    penaltyPoints?: number;
  }[];
  showResults?: boolean;
}

export function ParticipantsList({
  participants,
  showResults = false,
}: ParticipantsListProps) {
  if (participants.length === 0) {
    return <p className="text-muted-foreground">No participants found.</p>;
  }

  // Sort participants by position if showResults is true
  const sortedParticipants = showResults
    ? [...participants].sort(
        (a, b) => (a.position || 999) - (b.position || 999)
      )
    : participants;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showResults && <TableHead>Position</TableHead>}
          <TableHead>Number</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Nickname</TableHead>
          <TableHead>Club</TableHead>
          {showResults && <TableHead>Penalty</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedParticipants.map((participant) => (
          <TableRow key={participant.id}>
            {showResults && (
              <TableCell className="font-medium">
                {participant.position || "-"}
              </TableCell>
            )}
            <TableCell className="font-medium">{participant.number}</TableCell>
            <TableCell>{participant.name}</TableCell>
            <TableCell>{participant.nickname}</TableCell>
            <TableCell>{participant.club}</TableCell>
            {showResults && (
              <TableCell>
                {participant.penaltyPoints ? (
                  <Badge variant="destructive">
                    +{participant.penaltyPoints}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
