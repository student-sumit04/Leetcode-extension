export function analyzeComplexity(code) {
  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';
  let details = [];

  // Count nested loops
  const loopCount = (code.match(/\b(for|while)\s*\(/gi) || []).length;
  const nestedLoops = detectNestedLoops(code);

  // Analyze loops
  if (nestedLoops > 1) {
    const power = Math.min(nestedLoops, 3);
    timeComplexity = `O(n${power > 1 ? '^' + power : ''})`;
    details.push(`${nestedLoops} nested loop(s) detected`);
  } else if (loopCount === 1) {
    timeComplexity = 'O(n)';
    details.push('Single loop detected');
  }

  // Analyze data structures
  if (code.includes('map') || code.includes('Map')) {
    spaceComplexity = 'O(n)';
    details.push('Hash map usage detected');
  } else if (code.includes('set') || code.includes('Set')) {
    spaceComplexity = 'O(n)';
    details.push('Set usage detected');
  } else if (code.includes('sort')) {
    if (timeComplexity === 'O(1)') {
      timeComplexity = 'O(n log n)';
    }
    details.push('Sorting detected');
  }

  // Recursive calls
  const recursiveCalls = code.match(/\breturn\s+\w+\s*\(/g) || [];
  if (recursiveCalls.length > 0) {
    details.push('Recursive function detected');
  }

  return {
    timeComplexity,
    spaceComplexity,
    details,
    confidence: calculateConfidence(details),
  };
}

function detectNestedLoops(code) {
  let maxDepth = 0;
  let currentDepth = 0;
  let inLoop = false;

  for (let i = 0; i < code.length; i++) {
    if (
      code.substring(i, i + 3) === 'for' ||
      code.substring(i, i + 5) === 'while'
    ) {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
      inLoop = true;
    } else if (code[i] === '}' && inLoop) {
      currentDepth--;
    }
  }

  return maxDepth;
}

function calculateConfidence(details) {
  if (details.length === 0) return 'low';
  if (details.length <= 2) return 'medium';
  return 'high';
}
