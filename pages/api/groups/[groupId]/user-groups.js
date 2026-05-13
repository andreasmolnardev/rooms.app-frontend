import { nowIso } from '../../../../lib/auth';
import { getDb } from '../../../../lib/db';
import { methodGuard, parseGroupId, requireGroupRole, requireUser } from '../../../../lib/api-utils';

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
    const userGroups = db
      .prepare(
        `SELECT ug.id, ug.name, ug.description, ug.created_at AS createdAt
         FROM user_groups ug
         WHERE ug.group_id = ?
         ORDER BY ug.name ASC`
      )
      .all(groupId);

    res.status(200).json({ userGroups, role: membership.role });
    return;
  }

  const { name, description } = req.body || {};
  if (!name) {
    res.status(400).json({ error: 'User group name is required' });
    return;
  }

  const result = db
    .prepare('INSERT INTO user_groups (group_id, name, description, created_at) VALUES (?, ?, ?, ?)')
    .run(groupId, String(name).trim(), description ? String(description).trim() : null, nowIso());

  const userGroup = db
    .prepare('SELECT id, name, description, created_at AS createdAt FROM user_groups WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json({ userGroup });
}
