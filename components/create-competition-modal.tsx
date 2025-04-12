"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompetitionForm } from "@/components/competition-form";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string(),
  short_code: z.string(),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string(),
  rules: z.string(),
  schedule: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCompetitionModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    try {
      // Format dates with timezone for Postgres timestamp with time zone
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      startDate.setHours(8, 0, 0, 0); // Set to 8 AM
      endDate.setHours(17, 0, 0, 0); // Set to 5 PM

      const { error } = await supabase.from("competitions").insert({
        name: values.name,
        short_code: values.short_code,
        description: values.description,
        location: values.location,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        rules: values.rules,
        schedule: values.schedule,
      });

      if (error) throw error;

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating competition:", error);
      throw error; // Let the form handle the error toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Competition</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] h-[90vh] flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle>Create Competition</DialogTitle>
          <DialogDescription>
            Create a new competition. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <CompetitionForm onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
