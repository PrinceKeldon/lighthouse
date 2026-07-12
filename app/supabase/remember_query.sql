-- SQL function to find a date-matched entry for the Remember mechanic
-- Matches month and day of created_at to current date
create or replace function public.get_remember_entry(u_id uuid)
returns text as $$
declare
  entry_text text;
begin
  select text into entry_text
  from public.entries
  where user_id = u_id
    and extract(month from created_at) = extract(month from now())
    and extract(day from created_at) = extract(day from now())
  order by created_at desc
  limit 1;

  return entry_text;
end;
$$ language plpgsql security definer;
