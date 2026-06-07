const { getCompaniesForProblem } = require('../models/Company');
const {
  analyzeLeetCodeProblemWithGemini,
} = require('../utils/geminiService');

const analyzeController = {
  /**
   * Analyze code for time and space complexity
   */
  analyzeCode: async (req, res) => {
    const { code, problemSlug } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    try {
      // Simple complexity analysis
      const fallbackComplexity = {
        timeComplexity: detectComplexity(code),
        spaceComplexity: detectSpaceComplexity(code),
      };
      const companyInfo = problemSlug
        ? getCompaniesForProblem(problemSlug)
        : { companies: [], source: 'unknown' };
      let aiResult = null;

      try {
        aiResult = await analyzeLeetCodeProblemWithGemini({
          code,
          problemSlug,
          fallbackComplexity,
          fallbackCompanyTags: companyInfo.companies,
        });
      } catch (error) {
        console.error('Gemini analysis failed:', error.message);
        aiResult = {
          success: false,
          reason: error.message,
        };
      }

      const aiAnalysis = aiResult?.success ? aiResult.analysis : null;
      const companyTags =
        aiAnalysis?.companyTags?.length > 0
          ? aiAnalysis.companyTags
          : companyInfo.companies;
      const companyTagSource = aiAnalysis?.companyTags?.length
        ? 'ai'
        : companyInfo.source;
      const suggestions =
        aiAnalysis?.suggestions?.length > 0
          ? aiAnalysis.suggestions
          : [
              'Consider using a hash map for O(1) lookups',
              'Avoid nested loops when possible',
              'Use appropriate data structures',
            ];

      res.json({
        success: true,
        timeComplexity:
          aiAnalysis?.timeComplexity || fallbackComplexity.timeComplexity,
        spaceComplexity:
          aiAnalysis?.spaceComplexity || fallbackComplexity.spaceComplexity,
        analysisSource: aiAnalysis ? 'gemini' : 'rule-based',
        aiEnabled: Boolean(aiAnalysis),
        aiModel: aiResult?.model || null,
        aiError: aiResult?.success === false ? aiResult.reason : null,
        explanation: aiAnalysis?.explanation || null,
        bottlenecks: aiAnalysis?.bottlenecks || [],
        confidence: aiAnalysis?.confidence || 'medium',
        problem: problemSlug || null,
        companyTags,
        companyTagSource,
        companyTagReasoning: aiAnalysis?.companyTagReasoning || null,
        inferredCompanyTags:
          companyTagSource === 'ai' || companyTagSource === 'inferred',
        suggestions,
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Detect patterns in the code
   */
  detectPatterns: (req, res) => {
    const { code } = req.body;

    const patterns = [];
    if (code.includes('left') && code.includes('right')) {
      patterns.push('Two Pointer');
    }
    if (code.includes('window') || code.includes('start')) {
      patterns.push('Sliding Window');
    }
    if (code.includes('binary')) {
      patterns.push('Binary Search');
    }

    res.json({ patterns });
  },

  /**
   * Get optimization suggestions
   */
  getOptimizations: (req, res) => {
    const { code, currentComplexity } = req.body;

    const optimizations = [
      'Use memoization to avoid recalculation',
      'Consider using a different data structure',
      'Look for opportunities to reduce time complexity',
    ];

    res.json({ optimizations });
  },
};

function detectComplexity(code) {
  const loopCount = (code.match(/\b(for|while)\b/gi) || []).length;

  if (loopCount === 0) return 'O(1)';
  if (loopCount === 1) return 'O(n)';
  if (loopCount === 2) return 'O(n²)';
  return 'O(n³) or higher';
}

function detectSpaceComplexity(code) {
  if (code.includes('Map') || code.includes('map')) return 'O(n)';
  if (code.includes('Set') || code.includes('set')) return 'O(n)';
  return 'O(1)';
}

module.exports = analyzeController;
