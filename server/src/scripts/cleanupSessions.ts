import { getSessionDb } from '../db';

export async function cleanupExpiredSessions() {
  const db = await getSessionDb();
  const now = Math.floor(Date.now() / 1000);

  await db.run(
    'DELETE FROM sessions WHERE expired < ?',
    [now]
  );
}