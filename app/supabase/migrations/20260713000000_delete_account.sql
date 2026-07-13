-- 20260713000000_delete_account.sql
-- Implements the "Delete Account" functionality promised in the Privacy Policy.
-- Because auth.users is in a protected schema, we use a SECURITY DEFINER function
-- to allow users to trigger their own account deletion.

create or replace function public.delete_user_account()
returns void
language plpgsql
security definer -- runs as the owner of the function (postgres), allowing deletion of auth.users
as $$
begin
  -- This will delete the user from auth.users.
  -- Due to 'on delete cascade' on strengths, entries, and subscriptions,
  -- all associated data in the public schema will be automatically wiped.
  delete from auth.users where id = auth.uid();
end;
$$;

-- Ensure only authenticated users can call this function.
revoke execute on function public.delete_user_account() from public;
grant execute on function public.delete_user_account() to authenticated;
