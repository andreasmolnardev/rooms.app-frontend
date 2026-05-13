import { nowIso } from '../../../lib/auth';
import { getDb } from '../../../lib/db';
import { methodGuard, randomCode, randomPin, requireUser } from '../../../lib/api-utils';

export default function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const user = requireUser(req, res);
  if (!user) return;

  const db = getDb();

  if (req.method === 'GET') {
    const groups = db
      .prepare(
        `SELECT g.id, g.name, g.description, g.invite_code AS inviteCode, g.invite_pin AS invitePin,
                gm.role,
                COUNT(DISTINCT r.id) AS roomCount,
                COUNT(DISTINCT b.id) AS bookingCount,
                COUNT(DISTINCT m.user_id) AS memberCount
         FROM room_groups g
         JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = ?
         LEFT JOIN rooms r ON r.group_id = g.id
         LEFT JOIN bookings b ON b.group_id = g.id
         LEFT JOIN group_members m ON m.group_id = g.id
         GROUP BY g.id, gm.role
         ORDER BY g.created_at DESC`
      )
      .all(user.id);

    res.status(200).json({ groups });
    return;
  }

  const { name, description } = req.body || {};
  if (!name) {
    res.status(400).json({ error: 'Group name is required' });
    return;
  }

  const inviteCode = randomCode(8);
  const invitePin = randomPin(6);
  const createdAt = nowIso();

  const tx = db.transaction(() => {
    const groupResult = db
      .prepare(
        'INSERT INTO room_groups (name, description, owner_user_id, invite_code, invite_pin, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(String(name).trim(), description ? String(description).trim() : null, user.id, inviteCode, invitePin, createdAt);

    const groupId = groupResult.lastInsertRowid;

    db.prepare('INSERT INTO group_members (group_id, user_id, role, joined_at) VALUES (?, ?, ?, ?)').run(
      groupId,
      user.id,
      'admin',
      createdAt
    );

    db.prepare('INSERT INTO group_invitations (group_id, code, pin, created_by_user_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
      groupId,
      inviteCode,
      invitePin,
      user.id,
      'active',
      createdAt
    );

    return groupId;
  });

  const groupId = tx();
  res.status(201).json({
    group: {
      id: groupId,
      name: String(name).trim(),
      description: description ? String(description).trim() : null,
      inviteCode,
      invitePin,
      role: 'admin',
      roomCount: 0,
      bookingCount: 0,
      memberCount: 1,
    },
  });
}
