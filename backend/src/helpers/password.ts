import { randomBytes, scrypt as derive, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(derive) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

export async function hash(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64);
  return `${salt}:${derived.toString('hex')}`;
}

export async function verify(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const storedKey = Buffer.from(key, 'hex');
  const derived = await scrypt(password, salt, 64);
  if (storedKey.length !== derived.length) return false;
  return timingSafeEqual(storedKey, derived);
}
