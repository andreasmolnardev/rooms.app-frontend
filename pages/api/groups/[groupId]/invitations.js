import { nowIso } from '../../../../lib/auth';
import { getDb } from '../../../../lib/db';
import {
  methodGuard,
  parseGroupId,
  randomCode,
  randomPin,
  requireGroupRole,
  requireUser,
} from '../../../../lib/api-utils';

export default function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const user = requireUser(req, res);
  if (!user) return;

  const groupId = parseGroupId(req, res);
  if (!groupId) return;

  const role = req.method === 'POST' ? ['admin'] : ['admin', 'member'];
  const membership = requireGroupRole(req, res, groupId, user.id, role);
  if (!membership) return;

  const db = getDb();

  if (req.method === 'GET') {
    const invitations = db
      .prepare(
        `SELECT id, code, pin, status, created_at AS createdAt
         FROM group_invitations
         WHERE group_id = ?
         ORDER BY created_at DESC`
      )
      .all(groupId);

    res.status(200).json({ invitations, role: membership.role });
    return;
  }

  const invite = {
    code: randomCode(8),
    pin: randomPin(6),
    createdAt: nowIso(),
  };

  const result = db
    .prepare(
      'INSERT INTO group_invitations (group_id, code, pin, created_by_user_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(groupId, invite.code, invite.pin, user.id, 'active', invite.createdAt);

  res.status(201).json({ invitation: { id: result.lastInsertRowid, ...invite, status: 'active' } });
}
