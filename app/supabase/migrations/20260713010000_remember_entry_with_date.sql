-- The Lighthouse Experience Screen redesign turns "Remember" into a
-- permanent part of the page that shows how long ago the entry was
-- written ("Three weeks ago you wrote..."). That needs created_at
-- alongside the text, so this widens the RPC's return type from a bare
-- `text` to a one-row table. The return type change means we have to
-- drop the old function before recreating it.
drop function if exists public.get_remember_entry(uuid);

create or replace function public.get_remember_entry(u_id uuid)
returns table(text text, created_at timestamptz) as $$
begin
  return query
  select e.text, e.created_at
  from public.entries e
  where e.user_id = u_id
    and extract(month from e.created_at) = extract(month from now())
    and extract(day from e.created_at) = extract(day from now())
    and e.created_at < now() - interval '1 day'
  order by random()
  limit 1;
end;
$$ language plpgsql security definer;
