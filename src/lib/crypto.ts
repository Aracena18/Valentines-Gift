// Simple SHA-256 hash using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Pre-computed hash of the secret phrase
// Default: "iloveyou" → change this to your secret phrase's hash
// To generate: open browser console, run:
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('yoursecret'))
//     .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join(''))
//     .then(console.log)
export const SECRET_HASH = '298229bfb26938785fea8b75bfcb8297b4560c438dbf22b1017890f3da498fea'; // "iloveyou"
