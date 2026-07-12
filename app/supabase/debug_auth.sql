-- Drop the trigger to see if it's causing the 500 error
drop trigger if exists on_auth_user_created on auth.users;
