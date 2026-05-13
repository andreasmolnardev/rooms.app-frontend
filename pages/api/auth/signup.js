import { createSession, hashPassword, nowIso } from '../../../lib/auth';
import { getDb } from '../../../lib/db';
import { methodGuard } from '../../../lib/api-utils';

export default function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  if (String(password).length < 8) {
    res.status(400).json({ error: 'Password must contain at least 8 characters' });
    return;
  }

  const trimmedUsername = String(username).trim();
  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const db = getDb();
    const createdAt = nowIso();
    const insert = db.prepare(
      'INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)'
    );

    const result = insert.run(trimmedUsername, normalizedEmail, hashPassword(password), createdAt);
    const session = createSession(result.lastInsertRowid);

    res.status(201).json({
      token: session.token,
      user: {
        id: result.lastInsertRowid,
        username: trimmedUsername,
        email: normalizedEmail,
      },
    });
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }
    res.status(500).json({ error: 'Could not create user' });
  }
}
