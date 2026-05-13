import { createSession, verifyPassword } from '../../../lib/auth';
import { getDb } from '../../../lib/db';
import { methodGuard } from '../../../lib/api-utils';

export default function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const { identifier, password } = req.body || {};
  if (!identifier || !password) {
    res.status(400).json({ error: 'Missing credentials' });
    return;
  }

  const value = String(identifier).trim();
  const db = getDb();
  const user = db
    .prepare('SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?')
    .get(value, value.toLowerCase());

  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const session = createSession(user.id);
  res.status(200).json({
    token: session.token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}
