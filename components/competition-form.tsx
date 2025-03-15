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
import { TiptapEditor } from "@/components/tiptap-editor";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  shortCode: z
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
  competition: {
    id: number;
    name: string;
    shortCode: string;
    date: string;
    location: string;
    rules: string;
    schedule: string;
    logo: string;
  };
}

export function CompetitionForm({ competition }: CompetitionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse the date string to get start and end dates
  const startDate = new Date(`May 15, 2025`); // Hardcoded for demo
  const endDate = new Date(`May 17, 2025`); // Hardcoded for demo

  // Convert Markdown to HTML for initial values
  const initialRules = `<h1>Competition Rules</h1>
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
</ul>`;

  const initialSchedule = `<h1>Event Schedule</h1>
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
</ul>`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: competition.name,
      shortCode: competition.shortCode,
      startDate: startDate,
      endDate: endDate,
      location: competition.location,
      rules: initialRules,
      schedule: initialSchedule,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      toast("Competition updated", {
        description: "Your competition details have been updated successfully.",
      });
      setIsSubmitting(false);
    }, 1000);
  }

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
            name="shortCode"
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
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Enter competition rules..."
                    />
                  </FormControl>
                  <FormDescription>
                    Competition rules in rich text format.
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
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Enter event schedule..."
                    />
                  </FormControl>
                  <FormDescription>
                    Event schedule in rich text format.
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
