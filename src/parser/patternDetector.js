/**
 * Pattern detection for common DSA patterns and algorithms
 */

export function detectPatterns(code) {
  const patterns = [];

  // Detect common patterns
  if (isTwoPointer(code)) {
    patterns.push({
      name: 'Two Pointer',
      description: 'Two pointer technique for array/string problems',
      algorithms: ['reverse', 'palindrome', 'container with most water'],
    });
  }

  if (isSlidingWindow(code)) {
    patterns.push({
      name: 'Sliding Window',
      description: 'Optimal for substring/subarray problems',
      algorithms: ['max subarray', 'longest substring'],
    });
  }

  if (isBinarySearch(code)) {
    patterns.push({
      name: 'Binary Search',
      description: 'Efficient search on sorted data',
      timeComplexity: 'O(log n)',
    });
  }

  if (isDepthFirstSearch(code)) {
    patterns.push({
      name: 'Depth First Search (DFS)',
      description: 'Graph/Tree traversal pattern',
      timeComplexity: 'O(V + E)',
    });
  }

  if (isBreadthFirstSearch(code)) {
    patterns.push({
      name: 'Breadth First Search (BFS)',
      description: 'Level-order traversal',
      timeComplexity: 'O(V + E)',
    });
  }

  if (isDynamicProgramming(code)) {
    patterns.push({
      name: 'Dynamic Programming',
      description: 'Overlapping subproblems with memoization',
      techniques: ['tabulation', 'memoization'],
    });
  }

  if (isGreedy(code)) {
    patterns.push({
      name: 'Greedy Algorithm',
      description: 'Make locally optimal choices',
    });
  }

  return patterns;
}

function isTwoPointer(code) {
  return (
    (code.match(/left.*?right|head.*?tail/gi) || []).length >= 2 &&
    code.includes('while')
  );
}

function isSlidingWindow(code) {
  return (
    (code.match(/window|start.*?end/gi) || []).length >= 2 &&
    code.includes('while')
  );
}

function isBinarySearch(code) {
  return (
    code.includes('mid') &&
    code.includes('left') &&
    code.includes('right') &&
    (code.includes('<') || code.includes('>'))
  );
}

function isDepthFirstSearch(code) {
  return (
    (code.includes('stack') || code.includes('recursive')) &&
    (code.includes('graph') || code.includes('tree') || code.includes('node'))
  );
}

function isBreadthFirstSearch(code) {
  return (
    code.includes('queue') &&
    (code.includes('graph') || code.includes('tree') || code.includes('level'))
  );
}

function isDynamicProgramming(code) {
  return (
    (code.includes('dp') || code.includes('memo') || code.includes('cache')) &&
    (code.includes('for') || code.includes('while'))
  );
}

function isGreedy(code) {
  return (
    (code.match(/sort|max|min|greedy/gi) || []).length >= 2 &&
    code.includes('for')
  );
}

export function patternSuggestions(patterns) {
  const suggestions = [];

  patterns.forEach((pattern) => {
    if (pattern.name === 'Two Pointer') {
      suggestions.push('✓ Good for in-place operations');
    } else if (pattern.name === 'Sliding Window') {
      suggestions.push('✓ Optimal for substring/subarray problems');
    } else if (pattern.name === 'Binary Search') {
      suggestions.push('✓ Very efficient for sorted data');
    } else if (pattern.name === 'Dynamic Programming') {
      suggestions.push('✓ Great for optimization problems');
    }
  });

  return suggestions;
}
