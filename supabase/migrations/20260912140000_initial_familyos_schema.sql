create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  city text not null check (char_length(city) between 2 and 50),
  language text not null,
  priorities text[] not null default '{}',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 2 and 100),
  relationship text not null,
  dob date,
  contact text,
  role text not null,
  permission text not null check (permission in ('Owner', 'Member', 'Viewer')),
  verification text not null default 'Not Started',
  city text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index family_members_family_user_idx
  on public.family_members(family_id, user_id)
  where user_id is not null;

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  owner_id uuid not null references public.family_members(id) on delete cascade,
  name text not null,
  category text not null,
  value numeric(14, 2) not null check (value >= 0),
  institution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.liabilities (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  owner_id uuid not null references public.family_members(id) on delete cascade,
  name text not null,
  category text not null,
  outstanding numeric(14, 2) not null check (outstanding >= 0),
  monthly_obligation numeric(14, 2) not null check (monthly_obligation >= 0),
  institution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  owner_id uuid not null references public.family_members(id) on delete cascade,
  name text not null,
  category text not null,
  storage_path text unique,
  expires_at date,
  status text not null default 'Pending Review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  owner_id uuid not null references public.family_members(id) on delete cascade,
  assignee_id uuid not null references public.family_members(id) on delete cascade,
  title text not null,
  priority text not null check (priority in ('Low', 'Medium', 'High')),
  due_date date not null,
  status text not null default 'To Do',
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  requested_by_id uuid not null references public.family_members(id) on delete cascade,
  request text not null,
  amount numeric(14, 2),
  detail text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  profession text not null,
  specialization text not null,
  experience_years integer not null check (experience_years >= 0),
  location text not null,
  rating numeric(2, 1) not null check (rating between 0 and 5),
  availability text not null,
  indicative_fee text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  member_id uuid not null references public.family_members(id) on delete cascade,
  professional_id uuid references public.professionals(id) on delete set null,
  category text not null,
  summary text not null,
  urgency text not null check (urgency in ('Low', 'Medium', 'High')),
  preferred_date date not null,
  budget_range text not null,
  status text not null default 'Created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  member_id uuid references public.family_members(id) on delete set null,
  title text not null,
  event_date date not null,
  type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index family_members_family_id_idx on public.family_members(family_id);
create index assets_family_id_idx on public.assets(family_id);
create index liabilities_family_id_idx on public.liabilities(family_id);
create index documents_family_id_idx on public.documents(family_id);
create index tasks_family_id_idx on public.tasks(family_id);
create index approvals_family_id_idx on public.approvals(family_id);
create index service_requests_family_id_idx on public.service_requests(family_id);
create index calendar_events_family_id_idx on public.calendar_events(family_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_families_updated_at before update on public.families for each row execute function public.set_updated_at();
create trigger set_family_members_updated_at before update on public.family_members for each row execute function public.set_updated_at();
create trigger set_assets_updated_at before update on public.assets for each row execute function public.set_updated_at();
create trigger set_liabilities_updated_at before update on public.liabilities for each row execute function public.set_updated_at();
create trigger set_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();
create trigger set_tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger set_approvals_updated_at before update on public.approvals for each row execute function public.set_updated_at();
create trigger set_professionals_updated_at before update on public.professionals for each row execute function public.set_updated_at();
create trigger set_service_requests_updated_at before update on public.service_requests for each row execute function public.set_updated_at();
create trigger set_calendar_events_updated_at before update on public.calendar_events for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create function public.is_family_member(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = target_family_id and user_id = auth.uid()
  );
$$;

create function public.can_manage_family_data(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = target_family_id
      and user_id = auth.uid()
      and permission in ('Owner', 'Member')
  );
$$;

create function public.is_family_owner(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = target_family_id and user_id = auth.uid() and permission = 'Owner'
  );
$$;

create function public.create_family_workspace(
  family_name text,
  family_city text,
  family_language text,
  family_priorities text[],
  primary_member_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_family_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to create a family workspace';
  end if;

  insert into public.families (name, city, language, priorities, created_by)
  values (family_name, family_city, family_language, family_priorities, auth.uid())
  returning id into new_family_id;

  insert into public.family_members (
    family_id, user_id, name, relationship, role, permission, verification, city
  )
  values (
    new_family_id, auth.uid(), primary_member_name, 'Self', 'Family Owner', 'Owner', 'Pending Review', family_city
  );

  return new_family_id;
end;
$$;

revoke all on function public.create_family_workspace(text, text, text, text[], text) from public;
grant execute on function public.create_family_workspace(text, text, text, text[], text) to authenticated;

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.assets enable row level security;
alter table public.liabilities enable row level security;
alter table public.documents enable row level security;
alter table public.tasks enable row level security;
alter table public.approvals enable row level security;
alter table public.professionals enable row level security;
alter table public.service_requests enable row level security;
alter table public.calendar_events enable row level security;

create policy "Users can view their profile" on public.profiles for select using (id = auth.uid());
create policy "Users can update their profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Family members can view families" on public.families for select using (public.is_family_member(id));
create policy "Owners can update families" on public.families for update using (public.is_family_owner(id)) with check (public.is_family_owner(id));
create policy "Family members can view roster" on public.family_members for select using (public.is_family_member(family_id));
create policy "Owners can manage roster" on public.family_members for all using (public.is_family_owner(family_id)) with check (public.is_family_owner(family_id));
create policy "Family members can view assets" on public.assets for select using (public.is_family_member(family_id));
create policy "Managers can manage assets" on public.assets for all using (public.can_manage_family_data(family_id)) with check (public.can_manage_family_data(family_id));
create policy "Family members can view liabilities" on public.liabilities for select using (public.is_family_member(family_id));
create policy "Managers can manage liabilities" on public.liabilities for all using (public.can_manage_family_data(family_id)) with check (public.can_manage_family_data(family_id));
create policy "Family members can view documents" on public.documents for select using (public.is_family_member(family_id));
create policy "Managers can manage documents" on public.documents for all using (public.can_manage_family_data(family_id)) with check (public.can_manage_family_data(family_id));
create policy "Family members can view tasks" on public.tasks for select using (public.is_family_member(family_id));
create policy "Managers can manage tasks" on public.tasks for all using (public.can_manage_family_data(family_id)) with check (public.can_manage_family_data(family_id));
create policy "Family members can view approvals" on public.approvals for select using (public.is_family_member(family_id));
create policy "Managers can manage approvals" on public.approvals for all using (public.can_manage_family_data(family_id)) with check (public.can_manage_family_data(family_id));
create policy "Authenticated users can view professionals" on public.professionals for select to authenticated using (true);
create policy "Family members can view service requests" on public.service_requests for select using (public.is_family_member(family_id));
create policy "Managers can manage service requests" on public.service_requests for all using (public.can_manage_family_data(family_id)) with check (public.can_manage_family_data(family_id));
create policy "Family members can view calendar events" on public.calendar_events for select using (public.is_family_member(family_id));
create policy "Managers can manage calendar events" on public.calendar_events for all using (public.can_manage_family_data(family_id)) with check (public.can_manage_family_data(family_id));
