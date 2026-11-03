import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const [logs] = await pool.query(
      `SELECT l.habit_id, DATE_FORMAT(l.log_date, '%Y-%m-%d') AS log_date, l.completed
       FROM habit_logs l JOIN habits h ON h.id = l.habit_id
       WHERE h.user_id = ? AND l.log_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
       ORDER BY l.log_date`, [req.userId]
    );
    res.json(logs.map(log => ({ ...log, completed: Boolean(log.completed) })));
  } catch (error) { next(error); }
});

router.post('/toggle', async (req, res, next) => {
  const { habit_id: habitId, log_date: logDate, completed } = req.body;
  if (!Number.isInteger(Number(habitId)) || !/^\d{4}-\d{2}-\d{2}$/.test(logDate || '') || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'A valid habit_id, log_date, and completed value are required' });
  }
  try {
    const [habit] = await pool.query('SELECT id FROM habits WHERE id = ? AND user_id = ?', [habitId, req.userId]);
    if (!habit.length) return res.status(404).json({ message: 'Habit not found' });
    if (completed) {
      await pool.query('INSERT INTO habit_logs (habit_id, log_date, completed) VALUES (?, ?, TRUE) ON DUPLICATE KEY UPDATE completed = TRUE', [habitId, logDate]);
    } else {
      await pool.query('DELETE FROM habit_logs WHERE habit_id = ? AND log_date = ?', [habitId, logDate]);
    }
    res.json({ habit_id: Number(habitId), log_date: logDate, completed });
  } catch (error) { next(error); }
});

export default router;
