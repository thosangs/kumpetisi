import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, Users2Icon, TrophyIcon } from "lucide-react";

interface CompetitionDetailsProps {
  competition: {
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
  };
}

export function CompetitionDetails({ competition }: CompetitionDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span>{competition.date}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
              <span>{competition.location}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users2Icon className="h-5 w-5 text-muted-foreground" />
              <span>{competition.participants} registered</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-muted-foreground" />
              <span>{competition.classes} classes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">About This Competition</h3>
        <p className="text-muted-foreground">
          {competition.name} is a premier pushbike racing event that brings
          together the best riders from across the region. With{" "}
          {competition.classes} different classes and over{" "}
          {competition.participants} participants, this event promises exciting
          races and fierce competition.
        </p>
      </div>
    </div>
  );
}
