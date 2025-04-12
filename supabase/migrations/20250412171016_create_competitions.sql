-- Create competitions table
create table if not exists public.competitions (
  id bigint primary key generated always as identity,
  name text not null,
  short_code text not null unique,
  description text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  location text not null,
  participants integer default 0,
  classes integer default 0,
  rules text not null,
  schedule text not null,
  logo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create classes table
create table if not exists public.classes (
  id bigint primary key generated always as identity,
  competition_id bigint not null references public.competitions(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create batches table
create table if not exists public.batches (
  id bigint primary key generated always as identity,
  class_id bigint not null references public.classes(id) on delete cascade,
  name text not null,
  max_participants integer not null default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add some sample data
insert into public.competitions (
  name, 
  short_code, 
  description,
  start_date,
  end_date,
  location, 
  participants, 
  classes, 
  rules, 
  schedule, 
  logo
) values (
  'Lampung Race 2025',
  'lr25',
  'The biggest pushbike race event in Lampung for kids aged 1-5 years old. Join us for an exciting competition featuring multiple classes and stages.',
  '2025-05-15 08:00:00+07',
  '2025-05-17 15:00:00+07',
  'Lampung, Indonesia',
  120,
  8,
  '<h1>Competition Rules</h1>
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
</ul>',
  '<h1>Event Schedule</h1>
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
</ul>',
  'https://placeholder.pics/svg/?height=100&width=100'
); 