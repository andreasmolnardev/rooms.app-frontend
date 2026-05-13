import { methodGuard, requireUser } from '../../../lib/api-utils';

export default function handler(req, res) {
  if (!methodGuard(req, res, ['GET'])) return;
  const user = requireUser(req, res);
  if (!user) return;

  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}
