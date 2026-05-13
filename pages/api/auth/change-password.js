import { hashPassword, verifyPassword } from '../../../lib/auth';
import { getDb } from '../../../lib/db';
import { methodGuard, requireUser } from '../../../lib/api-utils';

export default function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const user = requireUser(req, res);
  if (!user) return;

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Missing password data' });
    return;
  }

  if (String(newPassword).length < 8) {
    res.status(400).json({ error: 'New password must contain at least 8 characters' });
    return;
  }

  const db = getDb();
  const record = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(user.id);
  if (!record || !verifyPassword(currentPassword, record.password_hash)) {
    res.status(401).json({ error: 'Current password is invalid' });
    return;
  }

  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(newPassword), user.id);
  res.status(200).json({ ok: true });
}
