"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type Competition } from "@/lib/supabase";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  short_code: z
    .string()
    .min(2, {
      message: "Short code must be at least 2 characters.",
    })
    .max(10, {
      message: "Short code must be at most 10 characters.",
    })
    .regex(/^[a-z0-9]+$/, {
      message: "Short code can only contain lowercase letters and numbers.",
    }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  rules: z.string().min(10, {
    message: "Rules must be at least 10 characters.",
  }),
  schedule: z.string().min(10, {
    message: "Schedule must be at least 10 characters.",
  }),
});

interface CompetitionFormProps {
  competition?: Competition;
  onSubmit?: (values: z.infer<typeof formSchema>) => Promise<void>;
}

export function CompetitionForm({
  competition,
  onSubmit: externalSubmit,
}: CompetitionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultStartDate = competition?.start_date
    ? new Date(competition.start_date)
    : new Date();
  const defaultEndDate = competition?.end_date
    ? new Date(competition.end_date)
    : new Date();

  // Convert to plain text for initial values
  const initialRules = `Competition Rules

General Rules:
1. All participants must wear safety gear
2. Bikes must meet safety standards
3. No outside assistance during races

Race Format:
- Qualifying rounds
- Quarter-finals
- Semi-finals
- Finals`;

  const initialSchedule = `Event Schedule

Day 1 - May 15, 2025:
08:00 - 10:00: Registration
10:30 - 12:30: Qualifying rounds (Classes 1-4)
14:00 - 16:00: Qualifying rounds (Classes 5-8)

Day 2 - May 16, 2025:
09:00 - 12:00: Quarter-finals
13:30 - 16:30: Semi-finals

Day 3 - May 17, 2025:
09:00 - 12:00: Finals
14:00 - 15:00: Award ceremony`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: competition?.name || "",
      short_code: competition?.short_code || "",
      description: competition?.description || "",
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      location: competition?.location || "",
      rules: competition?.rules || initialRules,
      schedule: competition?.schedule || initialSchedule,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (externalSubmit) {
        await externalSubmit(values);
      }

      toast.success(
        `Competition ${competition ? "updated" : "created"} successfully!`,
        {
          description: "Your changes have been saved.",
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competition Name</FormLabel>
                <FormControl>
                  <Input placeholder="Lampung Race 2025" {...field} />
                </FormControl>
                <FormDescription>
                  The full name of your competition.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="short_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Code</FormLabel>
                <FormControl>
                  <Input placeholder="lr25" {...field} />
                </FormControl>
                <FormDescription>
                  Used in the URL: kumpetisi.com/{field.value}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of your competition"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe what your competition is about.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The first day of your competition.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The last day of your competition.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Lampung, Indonesia" {...field} />
                </FormControl>
                <FormDescription>
                  Where the competition will take place.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rules</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter competition rules..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Competition rules in plain text format.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event schedule..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Event schedule in plain text format.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-kumpetisi-blue hover:bg-kumpetisi-blue/90"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
