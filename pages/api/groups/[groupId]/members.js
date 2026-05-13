import { getDb } from '../../../../lib/db';
import { methodGuard, parseGroupId, requireGroupRole, requireUser } from '../../../../lib/api-utils';

export default function handler(req, res) {
  if (!methodGuard(req, res, ['GET'])) return;

  const user = requireUser(req, res);
  if (!user) return;

  const groupId = parseGroupId(req, res);
  if (!groupId) return;

  const membership = requireGroupRole(req, res, groupId, user.id, ['admin', 'member']);
  if (!membership) return;

  const db = getDb();
  const members = db
    .prepare(
      `SELECT u.id, u.username, u.email, gm.role, gm.joined_at AS joinedAt
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       WHERE gm.group_id = ?
       ORDER BY gm.role ASC, u.username ASC`
    )
    .all(groupId);

  res.status(200).json({ members, role: membership.role });
}
