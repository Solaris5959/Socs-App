import express from 'express';
import logger from '../logger.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

/**
 * Catch-all 404 for any undefined dashboard routes
 */
router.use((req, res) => {
  res.status(404).json({ error: 'Dashboard route not found' });
});

/**
 * Error handler for this router
 */
router.use((err, req, res, next) => {
  logger.error('Dashboard router error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default router;
