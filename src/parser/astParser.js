/**
 * Parse JavaScript code using regex patterns
 * (For more complex parsing, integrate Acorn library)
 */
export function parseCode(code) {
  const ast = {
    functions: extractFunctions(code),
    loops: extractLoops(code),
    variables: extractVariables(code),
    dataStructures: extractDataStructures(code),
  };

  return ast;
}

export function extractFunctions(code) {
  const functions = [];
  const regex = /function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*(?:async\s*)?\(/g;
  let match;

  while ((match = regex.exec(code)) !== null) {
    functions.push({
      name: match[1] || match[2],
      startIndex: match.index,
    });
  }

  return functions;
}

export function extractLoops(code) {
  const loops = [];
  const regex = /\b(for|while|do)\b/gi;
  let match;

  while ((match = regex.exec(code)) !== null) {
    loops.push({
      type: match[1].toLowerCase(),
      index: match.index,
    });
  }

  return loops;
}

export function extractVariables(code) {
  const variables = [];
  const regex = /(?:var|let|const)\s+(\w+)\s*=/g;
  let match;

  while ((match = regex.exec(code)) !== null) {
    variables.push({
      name: match[1],
      index: match.index,
    });
  }

  return variables;
}

export function extractDataStructures(code) {
  const structures = [];

  if (code.includes('Map') || code.includes('map')) {
    structures.push('Map');
  }
  if (code.includes('Set') || code.includes('set')) {
    structures.push('Set');
  }
  if (code.includes('Array') || code.includes('[]')) {
    structures.push('Array');
  }
  if (code.includes('Object') || code.includes('{}')) {
    structures.push('Object');
  }

  return structures;
}

/**
 * Find potential optimizations in the code
 */
export function findOptimizations(code, ast) {
  const optimizations = [];

  // Check for repeated iterations
  if (ast.loops.length > 1) {
    optimizations.push(
      'Consider combining multiple loops to reduce time complexity'
    );
  }

  // Check for unnecessary data structures
  if (code.includes('sort')) {
    optimizations.push(
      'Sorting increases time complexity - consider using a hash map'
    );
  }

  // Check for potential memoization
  if (ast.functions.length > 1 && code.includes('return')) {
    optimizations.push(
      'Consider using memoization for repeated calculations'
    );
  }

  return optimizations;
}
