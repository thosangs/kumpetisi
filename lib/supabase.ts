import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Competition = {
  id?: number;
  name: string;
  short_code: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  rules: string;
  schedule: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
  classes?: Class[];
};

export type Class = {
  id?: number;
  name: string;
  description: string;
  competition_id: number;
  stages: Stage[];
  created_at?: string;
  updated_at?: string;
};

export type Stage = {
  id?: number;
  name: string;
  description: string;
  class_id: number;
  batches: Batch[];
  created_at?: string;
  updated_at?: string;
};

export type Batch = {
  id?: number;
  name: string;
  description: string;
  stage_id: number;
  start_time: string;
  end_time: string;
  participants: Participant[];
  created_at?: string;
  updated_at?: string;
};

export type Participant = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  batch_id: number;
  created_at?: string;
  updated_at?: string;
};
