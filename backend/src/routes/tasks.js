import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for a user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        const result = await pool.query(
            'INSERT INTO tasks (user_id, text) VALUES ($1, $2) RETURNING *',
            [req.user.id, text]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a task
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;
        
        // Verify task belongs to user
        const taskCheck = await pool.query(
            'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (taskCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const result = await pool.query(
            'UPDATE tasks SET text = COALESCE($1, text), completed = COALESCE($2, completed), updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
            [text, completed, id, req.user.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verify task belongs to user
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete multiple tasks
router.post('/delete-multiple', authenticateToken, async (req, res) => {
    try {
        const { taskIds } = req.body;
        
        if (!Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({ error: 'Invalid task IDs' });
        }

        const result = await pool.query(
            'DELETE FROM tasks WHERE id = ANY($1) AND user_id = $2 RETURNING *',
            [taskIds, req.user.id]
        );

        res.json({ 
            message: 'Tasks deleted successfully',
            deletedCount: result.rows.length
        });
    } catch (error) {
        console.error('Error deleting tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 