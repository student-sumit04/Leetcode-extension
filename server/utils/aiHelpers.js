/**
 * Backend AI helper utilities
 */

export function formatAnalysisResponse(complexity, patterns) {
  return {
    complexity,
    patterns,
    recommendations: generateRecommendations(complexity, patterns),
    score: calculateScore(complexity),
  };
}

function generateRecommendations(complexity, patterns) {
  const recommendations = [];

  if (complexity.timeComplexity.includes('²')) {
    recommendations.push({
      type: 'Optimization',
      message:
        'Consider using a hash map to reduce from O(n²) to O(n)',
      priority: 'high',
    });
  }

  if (patterns.length === 0) {
    recommendations.push({
      type: 'Learning',
      message:
        'Identify common patterns like Two Pointer, Sliding Window',
      priority: 'medium',
    });
  }

  return recommendations;
}

function calculateScore(complexity) {
  const scores = {
    'O(1)': 100,
    'O(log n)': 90,
    'O(n)': 80,
    'O(n log n)': 75,
    'O(n²)': 50,
    'O(2^n)': 20,
  };

  return scores[complexity.timeComplexity] || 50;
}

module.exports = {
  formatAnalysisResponse,
};
