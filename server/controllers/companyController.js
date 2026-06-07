const { companies, getCompaniesForProblem } = require('../models/Company');
const { inferCompanyTagsWithGemini } = require('../utils/geminiService');

const companyController = {
  /**
   * Get companies that asked a specific problem
   */
  getCompaniesByProblem: async (req, res) => {
    const { problemSlug } = req.params;
    const fallbackCompanyInfo =
      getCompaniesForProblem(problemSlug);
    let problemCompanies = fallbackCompanyInfo.companies;
    let source = fallbackCompanyInfo.source;
    let aiModel = null;
    let aiError = null;
    let reasoning = null;

    if (source !== 'exact') {
      try {
        const aiCompanyInfo = await inferCompanyTagsWithGemini({
          problemSlug,
          fallbackCompanyTags: fallbackCompanyInfo.companies,
        });

        if (aiCompanyInfo.success && aiCompanyInfo.companyTags.length > 0) {
          problemCompanies = aiCompanyInfo.companyTags;
          source = 'ai';
          aiModel = aiCompanyInfo.model;
          reasoning = aiCompanyInfo.companyTagReasoning;
        } else {
          aiError = aiCompanyInfo.reason || null;
        }
      } catch (error) {
        console.error('Gemini company tag inference failed:', error.message);
        aiError = error.message;
      }
    }

    res.json({
      problem: problemSlug,
      companies: problemCompanies,
      count: problemCompanies.length,
      source,
      inferred: source === 'inferred' || source === 'ai',
      aiModel,
      aiError,
      reasoning,
    });
  },

  /**
   * Get all companies and their statistics
   */
  getAllCompanies: (req, res) => {
    const stats = {};
    Object.values(companies).forEach((companyList) => {
      companyList.forEach((company) => {
        stats[company] = (stats[company] || 0) + 1;
      });
    });

    const sortedCompanies = Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .map(([company, count]) => ({ company, count }));

    res.json({
      total: sortedCompanies.length,
      companies: sortedCompanies,
    });
  },

  /**
   * Add company to a problem
   */
  addCompanyToProblem: (req, res) => {
    const { problemSlug } = req.params;
    const { company } = req.body;

    if (!company) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    if (!companies[problemSlug]) {
      companies[problemSlug] = [];
    }

    if (!companies[problemSlug].includes(company)) {
      companies[problemSlug].push(company);
    }

    res.json({
      success: true,
      problem: problemSlug,
      companies: companies[problemSlug],
    });
  },
};

module.exports = companyController;
