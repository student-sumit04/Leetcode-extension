import { analyzeComplexity } from '../parser/complexityAnalyzer';
import { detectPatterns } from '../parser/patternDetector';

/**
 * Main optimization engine that combines
 * complexity analysis and pattern detection
 */
export function optimizeCode(code) {
  const complexity = analyzeComplexity(code);
  const patterns = detectPatterns(code);

  return {
    complexity,
    patterns,
    score: calculateOptimizationScore(complexity, patterns),
    recommendations: generateRecommendations(complexity, patterns),
  };
}

function calculateOptimizationScore(complexity, patterns) {
  let score = 50; // Base score

  // Penalize high complexity
  if (complexity.timeComplexity.includes('n²')) {
    score -= 20;
  } else if (complexity.timeComplexity.includes('n log n')) {
    score += 10;
  }

  // Reward good patterns
  const goodPatterns = ['Binary Search', 'Dynamic Programming', 'Greedy'];
  patterns.forEach((pattern) => {
    if (goodPatterns.includes(pattern.name)) {
      score += 15;
    }
  });

  // Cap score at 100
  return Math.min(100, Math.max(0, score));
}

function generateRecommendations(complexity, patterns) {
  const recommendations = [];

  // Complexity-based recommendations
  if (complexity.timeComplexity === 'O(n²)') {
    recommendations.push(
      'Consider using a hash map or Set to reduce from O(n²) to O(n)'
    );
  }

  if (!patterns.length) {
    recommendations.push('Identify the algorithm pattern for better solutions');
  }

  if (complexity.details.includes('Sorting detected')) {
    recommendations.push(
      'Sorting adds O(n log n) complexity. Is it necessary?'
    );
  }

  return recommendations;
}

export function suggestAlternativeApproaches(code, patterns) {
  const suggestions = [];

  if (!patterns.length) {
    suggestions.push({
      approach: 'Brute Force',
      complexity: 'High',
      suggestion: 'Try using hash maps or two pointers',
    });
  }

  patterns.forEach((pattern) => {
    if (pattern.name === 'Two Pointer') {
      suggestions.push({
        current: pattern.name,
        alternative: 'Hash Map approach',
        tradeoff: 'O(1) space vs O(n) space',
      });
    }
  });

  return suggestions;
}
