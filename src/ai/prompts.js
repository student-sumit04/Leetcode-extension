export function getPrompt(type, context = {}) {
  const prompts = {
    complexity: `Analyze this JavaScript code for time and space complexity:

Code:
\`\`\`javascript
${context.code}
\`\`\`

Provide:
1. Time Complexity (Big O notation)
2. Space Complexity (Big O notation)
3. Brief explanation
4. Key bottlenecks`,

    optimization: `Suggest optimizations for this code with current ${context.currentComplexity} time complexity:

Code:
\`\`\`javascript
${context.code}
\`\`\`

Provide:
1. Specific optimization strategies
2. Alternative algorithms
3. Expected improvement
4. Implementation tips`,

    pattern: `Identify coding patterns in this solution:

Code:
\`\`\`javascript
${context.code}
\`\`\`

Identify:
1. Pattern names (Two Pointer, Sliding Window, etc)
2. Data structures used
3. When to use this pattern
4. Similar problems`,

    explanation: `Explain this LeetCode solution clearly:

Code:
\`\`\`javascript
${context.code}
\`\`\`

Cover:
1. Algorithm approach
2. Step-by-step walkthrough
3. Why this works
4. Common pitfalls`,

    improvement: `What can be improved in this code:

Code:
\`\`\`javascript
${context.code}
\`\`\`

Suggest:
1. Code quality improvements
2. Performance optimizations
3. Edge cases to handle
4. Best practices`,
  };

  return prompts[type] || prompts.complexity;
}

export function generateSystemPrompt() {
  return `You are an expert LeetCode tutor and competitive programmer. 
Your role is to help users understand and optimize their solutions.
Provide clear, concise analysis with actionable insights.
Always explain why something is optimal or suboptimal.
Focus on practical improvements and learning.`;
}
