import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, Users2Icon, TrophyIcon } from "lucide-react";
import { type Competition } from "@/lib/supabase";

interface CompetitionDetailsProps {
  competition: Competition;
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleString(
      "default",
      { month: "long" }
    )} ${start.getFullYear()}`;
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} ${start.toLocaleString("default", {
      month: "long",
    })} - ${end.getDate()} ${end.toLocaleString("default", {
      month: "long",
    })} ${start.getFullYear()}`;
  }

  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

export function CompetitionDetails({ competition }: CompetitionDetailsProps) {
  const dateRange = formatDateRange(
    competition.start_date,
    competition.end_date
  );

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
              <span>{dateRange}</span>
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
              <span>
                {competition.classes?.reduce(
                  (total, cls) =>
                    total +
                    cls.stages.reduce(
                      (stageTotal, stage) =>
                        stageTotal +
                        stage.batches.reduce(
                          (batchTotal, batch) =>
                            batchTotal + (batch.participants?.length || 0),
                          0
                        ),
                      0
                    ),
                  0
                ) || 0}{" "}
                registered
              </span>
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
              <span>{competition.classes?.length || 0} classes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">About This Competition</h3>
        <p className="text-muted-foreground">{competition.description}</p>
      </div>
    </div>
  );
}
