import crypto from 'node:crypto';
import { getDb } from './db';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14;

export function nowIso() {
  return new Date().toISOString();
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, existingHash] = String(storedHash || '').split(':');
  if (!salt || !existingHash) return false;

  const calculated = crypto.scryptSync(password, salt, 64).toString('hex');
  const existingBuffer = Buffer.from(existingHash, 'hex');
  const calculatedBuffer = Buffer.from(calculated, 'hex');

  if (existingBuffer.length !== calculatedBuffer.length) return false;
  return crypto.timingSafeEqual(existingBuffer, calculatedBuffer);
}

export function createSession(userId) {
  const db = getDb();
  const token = crypto.randomBytes(32).toString('hex');
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  db.prepare(
    'INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)'
  ).run(token, userId, createdAt, expiresAt);

  return { token, expiresAt };
}

export function getSessionUser(req) {
  const db = getDb();
  const token = req.headers['x-session-token'];
  if (!token || typeof token !== 'string') return null;

  const session = db
    .prepare(
      `SELECT s.token, s.expires_at, u.id, u.username, u.email
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?`
    )
    .get(token);

  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  return {
    token: session.token,
    id: session.id,
    username: session.username,
    email: session.email,
  };
}

export function deleteSession(token) {
  if (!token || typeof token !== 'string') return;
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}
