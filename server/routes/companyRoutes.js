const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

/**
 * GET /companies/:problemSlug
 * Get companies that asked this problem
 */
router.get('/:problemSlug', companyController.getCompaniesByProblem);

/**
 * GET /companies
 * Get all companies and stats
 */
router.get('/', companyController.getAllCompanies);

/**
 * POST /companies/:problemSlug
 * Add company to problem
 */
router.post('/:problemSlug', companyController.addCompanyToProblem);

module.exports = router;
