import { nowIso } from '../../../lib/auth';
import { getDb } from '../../../lib/db';
import { methodGuard, requireUser } from '../../../lib/api-utils';

export default function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const user = requireUser(req, res);
  if (!user) return;

  const { code, pin } = req.body || {};
  if (!code || !pin) {
    res.status(400).json({ error: 'Invitation code and pin are required' });
    return;
  }

  const db = getDb();
  const invitation = db
    .prepare(
      `SELECT gi.id, gi.group_id AS groupId, g.name
       FROM group_invitations gi
       JOIN room_groups g ON g.id = gi.group_id
       WHERE gi.code = ? AND gi.pin = ? AND gi.status = 'active'`
    )
    .get(String(code).trim().toUpperCase(), String(pin).trim());

  if (!invitation) {
    res.status(404).json({ error: 'Invitation not found' });
    return;
  }

  const existing = db
    .prepare('SELECT role FROM group_members WHERE group_id = ? AND user_id = ?')
    .get(invitation.groupId, user.id);

  if (!existing) {
    db.prepare('INSERT INTO group_members (group_id, user_id, role, joined_at) VALUES (?, ?, ?, ?)').run(
      invitation.groupId,
      user.id,
      'member',
      nowIso()
    );
  }

  db.prepare('UPDATE group_invitations SET status = ? WHERE id = ?').run('used', invitation.id);
  res.status(200).json({ ok: true, groupName: invitation.name });
}
