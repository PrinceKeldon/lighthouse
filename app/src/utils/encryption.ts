import { supabase } from '../api/supabase';

/**
 * Encrypts text using the server-managed pgsodium envelope encryption.
 * Per ADR-003, encryption happens server-side to ensure the master key
 * never reaches the client.
 */
export async function encryptText(userId: string, plainText: string): Promise<string> {
  const { data, error } = await supabase.rpc('encrypt_entry_text', {
    user_id: userId,
    plain_text: plainText,
  });

  if (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt content securely.');
  }

  return data as string;
}

/**
 * Decrypts text using the server-managed pgsodium envelope encryption.
 * Per ADR-003, decryption happens server-side to keep the DEK 
 * protected by the master key.
 */
export async function decryptText(userId: string, encryptedText: string): Promise<string> {
  const { data, error } = await supabase.rpc('decrypt_entry_text', {
    user_id: userId,
    encrypted_text: encryptedText,
  });

  if (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt content.');
  }

  return data as string;
}
