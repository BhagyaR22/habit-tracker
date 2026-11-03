import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const [habits] = await pool.query('SELECT id, name FROM habits WHERE user_id = ? ORDER BY created_at, id', [req.userId]);
    res.json(habits);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  if (!name || name.length > 150) return res.status(400).json({ message: 'Habit name must be between 1 and 150 characters' });
  try {
    const [result] = await pool.query('INSERT INTO habits (user_id, name) VALUES (?, ?)', [req.userId, name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM habits WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Habit not found' });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;
