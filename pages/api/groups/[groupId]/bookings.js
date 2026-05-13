import { nowIso } from '../../../../lib/auth';
import { getDb } from '../../../../lib/db';
import { methodGuard, parseGroupId, requireGroupRole, requireUser } from '../../../../lib/api-utils';

function toDayRange(dateStr) {
  const date = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export default function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const user = requireUser(req, res);
  if (!user) return;

  const groupId = parseGroupId(req, res);
  if (!groupId) return;

  const membership = requireGroupRole(req, res, groupId, user.id, ['admin', 'member']);
  if (!membership) return;

  const db = getDb();

  if (req.method === 'GET') {
    const { date, roomId } = req.query;
    const range = toDayRange(typeof date === 'string' ? date : undefined);

    const bookings = db
      .prepare(
        `SELECT b.id, b.title, b.notes, b.start_at AS startAt, b.end_at AS endAt,
                r.id AS roomId, r.name AS roomName, r.color AS roomColor,
                u.id AS userId, u.username
         FROM bookings b
         JOIN rooms r ON r.id = b.room_id
         JOIN users u ON u.id = b.user_id
         WHERE b.group_id = ?
           AND b.start_at >= ?
           AND b.start_at < ?
           AND (? IS NULL OR b.room_id = ?)
         ORDER BY b.start_at ASC`
      )
      .all(groupId, range.start, range.end, roomId ? Number(roomId) : null, roomId ? Number(roomId) : null);

    res.status(200).json({ bookings, role: membership.role });
    return;
  }

  const { roomId, title, notes, startAt, endAt } = req.body || {};
  if (!roomId || !title || !startAt || !endAt) {
    res.status(400).json({ error: 'Missing booking fields' });
    return;
  }

  const start = new Date(startAt);
  const end = new Date(endAt);

  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start >= end) {
    res.status(400).json({ error: 'Invalid booking timespan' });
    return;
  }

  const room = db
    .prepare('SELECT id, name, color FROM rooms WHERE id = ? AND group_id = ?')
    .get(Number(roomId), groupId);

  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }

  const overlap = db
    .prepare(
      `SELECT id FROM bookings
       WHERE group_id = ? AND room_id = ?
         AND start_at < ?
         AND end_at > ?
       LIMIT 1`
    )
    .get(groupId, Number(roomId), end.toISOString(), start.toISOString());

  if (overlap) {
    res.status(409).json({ error: 'Booking overlaps with an existing entry' });
    return;
  }

  const result = db
    .prepare(
      'INSERT INTO bookings (group_id, room_id, user_id, title, notes, start_at, end_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .run(
      groupId,
      Number(roomId),
      user.id,
      String(title).trim(),
      notes ? String(notes).trim() : null,
      start.toISOString(),
      end.toISOString(),
      nowIso()
    );

  const booking = db
    .prepare(
      `SELECT b.id, b.title, b.notes, b.start_at AS startAt, b.end_at AS endAt,
              r.id AS roomId, r.name AS roomName, r.color AS roomColor,
              u.id AS userId, u.username
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN users u ON u.id = b.user_id
       WHERE b.id = ?`
    )
    .get(result.lastInsertRowid);

  res.status(201).json({ booking });
}
