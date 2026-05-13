import { deleteSession } from '../../../lib/auth';
import { methodGuard } from '../../../lib/api-utils';

export default function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const token = req.headers['x-session-token'];
  deleteSession(token);
  res.status(200).json({ ok: true });
}
