import crypto from 'node:crypto';
import { getDb } from './db';
import { getSessionUser } from './auth';

export function methodGuard(req, res, methods) {
  if (!methods.includes(req.method)) {
    res.setHeader('Allow', methods);
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  return true;
}

export function requireUser(req, res) {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return user;
}

export function randomCode(length = 8) {
  return crypto
    .randomBytes(length)
    .toString('base64url')
    .replace(/[^A-Z0-9]/gi, '')
    .toUpperCase()
    .slice(0, length);
}

export function randomPin(length = 6) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

export function getGroupMembership(groupId, userId) {
  const db = getDb();
  return db
    .prepare('SELECT role FROM group_members WHERE group_id = ? AND user_id = ?')
    .get(groupId, userId);
}

export function requireGroupRole(req, res, groupId, userId, roles = ['admin', 'member']) {
  const membership = getGroupMembership(groupId, userId);
  if (!membership || !roles.includes(membership.role)) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return membership;
}

export function parseGroupId(req, res) {
  const id = Number(req.query.groupId);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid group id' });
    return null;
  }
  return id;
}
