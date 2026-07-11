-- Enable pgsodium for server-side encryption
create extension if not exists pgsodium;

-- Create a table to store per-user Data Encryption Keys (DEKs)
-- These keys are encrypted by the pgsodium master key
create table if not exists user_encryption_keys (
  user_id uuid primary key references auth.users(id) on delete cascade,
  encrypted_dek bytea not null,
  created_at timestamptz not null default now()
);

alter table user_encryption_keys enable row level security;

create policy "Users can view their own encryption key"
  on user_encryption_keys for select
  using (auth.uid() = user_id);

-- Function to provision a DEK for a new user
-- This should be called via a trigger on auth.users or during signup
create or replace function public.provision_user_dek()
returns trigger as $$
begin
  insert into public.user_encryption_keys (user_id, encrypted_dek)
  values (
    new.id,
    pgsodium.crypto_encrypt(
      pgsodium.crypto_keygen(), -- Generate a random DEK
      current_setting('pgsodium.key_id') -- Encrypt with master key
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically provision DEK on user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.provision_user_dek();

-- Function to encrypt Entry text
create or replace function public.encrypt_entry_text(user_id uuid, plain_text text)
returns text as $$
declare
  dek bytea;
  ciphertext bytea;
begin
  -- Retrieve and decrypt the user's DEK using the master key
  select pgsodium.crypto_decrypt(encrypted_dek, current_setting('pgsodium.key_id'))
  into dek
  from public.user_encryption_keys
  where public.user_encryption_keys.user_id = encrypt_entry_text.user_id;

  if dek is null then
    raise exception 'Encryption key not found for user %', user_id;
  end if;

  -- Encrypt the plain text using the DEK
  ciphertext := pgsodium.crypto_aead_det_encrypt(plain_text::bytea, ''::bytea, dek);
  
  return encode(ciphertext, 'base64');
end;
$$ language plpgsql security definer;

-- Function to decrypt Entry text
create or replace function public.decrypt_entry_text(user_id uuid, encrypted_text text)
returns text as $$
declare
  dek bytea;
  plaintext bytea;
begin
  -- Retrieve and decrypt the user's DEK using the master key
  select pgsodium.crypto_decrypt(encrypted_dek, current_setting('pgsodium.key_id'))
  into dek
  from public.user_encryption_keys
  where public.user_encryption_keys.user_id = decrypt_entry_text.user_id;

  if dek is null then
    raise exception 'Encryption key not found for user %', user_id;
  end if;

  -- Decrypt the ciphertext using the DEK
  plaintext := pgsodium.crypto_aead_det_decrypt(decode(encrypted_text, 'base64'), ''::bytea, dek);
  
  return convert_from(plaintext, 'utf8');
end;
$$ language plpgsql security definer;
