const ALGO = "AES-GCM";
const KEY_LEN = 256;
const IV_LEN = 12;
const TAG_LEN = 128;

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 250000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGO, length: KEY_LEN },
    false,
    ["encrypt", "decrypt"]
  );
}

export function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

export async function encryptFile(
  file: ArrayBuffer,
  password: string
): Promise<{ ciphertext: Uint8Array; iv: Uint8Array; salt: Uint8Array }> {
  const salt = randomBytes(16);
  const iv = randomBytes(IV_LEN);
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGO, iv: iv as BufferSource, tagLength: TAG_LEN },
    key,
    file
  );
  return {
    ciphertext: new Uint8Array(ciphertext),
    iv,
    salt,
  };
}

export async function decryptFile(
  ciphertext: Uint8Array,
  iv: Uint8Array,
  salt: Uint8Array,
  password: string
): Promise<ArrayBuffer> {
  const key = await deriveKey(password, salt);
  return crypto.subtle.decrypt(
    { name: ALGO, iv: iv as BufferSource, tagLength: TAG_LEN },
    key,
    ciphertext as BufferSource
  );
}
