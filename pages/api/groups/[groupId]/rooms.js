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
    const rooms = db
      .prepare(
        `SELECT id, name, capacity, color, created_at AS createdAt
         FROM rooms
         WHERE group_id = ?
         ORDER BY name ASC`
      )
      .all(groupId);

    res.status(200).json({ rooms, role: membership.role });
    return;
  }

  const { name, capacity, color } = req.body || {};
  if (!name) {
    res.status(400).json({ error: 'Room name is required' });
    return;
  }

  const result = db
    .prepare('INSERT INTO rooms (group_id, name, capacity, color, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(
      groupId,
      String(name).trim(),
      Number.isFinite(Number(capacity)) ? Number(capacity) : 0,
      color || '#2563eb',
      nowIso()
    );

  const room = db
    .prepare('SELECT id, name, capacity, color, created_at AS createdAt FROM rooms WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json({ room });
}
