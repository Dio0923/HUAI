create extension if not exists pgcrypto;
create table decisions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, category text check (category in ('career','education','money','relationship','health','other')),
 context text, own_view_original text, own_view_confidence int check (own_view_confidence between 1 and 10),
 has_committed_view boolean not null default false, ai_critique jsonb,
 final_decision text not null default '', reason text not null default '', review_due_at timestamptz not null default (now() + interval '7 days'),
 reviewed_at timestamptz, outcome text check (outcome in ('correct','partly','wrong','skipped')),
 what_happened text, lesson text, review_commit_effect text check (review_commit_effect in ('yes','no','unsure')),
 safety_stopped boolean not null default false,
 stage text not null default 'commit' check (stage in ('commit','critique','check','saved')),
 created_at timestamptz not null default now()
);
create table memories (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, content text not null, source text not null, created_at timestamptz not null default now());
alter table decisions enable row level security;
alter table memories enable row level security;
create policy decisions_owner on decisions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy memories_owner on memories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Once the commitment is made, neither it nor a saved decision can be rewritten.
create function protect_decision() returns trigger language plpgsql as $$
begin
 if old.stage <> 'commit' and (new.own_view_original is distinct from old.own_view_original or new.has_committed_view is distinct from old.has_committed_view or new.own_view_confidence is distinct from old.own_view_confidence) then raise exception 'Commitment is immutable'; end if;
 if old.stage = 'saved' and (new.final_decision is distinct from old.final_decision or new.reason is distinct from old.reason or new.review_due_at is distinct from old.review_due_at or new.context is distinct from old.context or new.category is distinct from old.category or new.stage <> 'saved') then raise exception 'Saved decisions are immutable'; end if;
 return new;
end $$;
create trigger protect_decision before update on decisions for each row execute function protect_decision();
-- Limit input even if a user bypasses the application and calls PostgREST directly.
alter table decisions add constraint decision_text_sizes check (
 length(title) between 1 and 120 and coalesce(length(context),0) <= 10000 and
 coalesce(length(own_view_original),0) <= 10000 and length(final_decision) <= 10000 and
 length(reason) <= 10000 and coalesce(length(what_happened),0) <= 10000 and coalesce(length(lesson),0) <= 10000
);
alter table memories add constraint memory_text_sizes check (length(content) between 1 and 10000 and length(source) between 1 and 1000);
