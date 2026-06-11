const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');

/**
 * POST /analyze
 * Analyze code for complexity and suggestions
 */
router.post('/', analyzeController.analyzeCode);

/**
 * POST /analyze/pattern
 * Detect patterns in code
 */
router.post('/pattern', analyzeController.detectPatterns);

/**
 * POST /analyze/optimize
 * Get optimization suggestions
 */
router.post('/optimize', analyzeController.getOptimizations);

module.exports = router;
