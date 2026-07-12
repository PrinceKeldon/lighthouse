-- Fix cast in the pgcrypto provisioning trigger
create or replace function public.provision_user_dek()
returns trigger as $$
declare
  master_key text := 'LIGHTHOUSE_MASTER_KEY_2026';
  dek text := encode(gen_random_bytes(32), 'base64');
begin
  insert into public.user_encryption_keys (user_id, encrypted_dek)
  values (
    new.id,
    encode(pgp_sym_encrypt(dek, master_key), 'base64') -- Cast bytea to base64 text
  );
  return new;
end;
$$ language plpgsql security definer;
