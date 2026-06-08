const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';

function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

  return {
    apiKey,
    model,
    enabled: Boolean(apiKey),
  };
}

async function analyzeLeetCodeProblemWithGemini({
  code,
  problemSlug,
  fallbackComplexity,
  fallbackCompanyTags,
}) {
  const { apiKey, model, enabled } = getGeminiConfig();

  if (!enabled) {
    return {
      success: false,
      reason: 'Gemini API key not configured',
    };
  }

  const prompt = buildProblemAnalysisPrompt({
    code,
    problemSlug,
    fallbackComplexity,
    fallbackCompanyTags,
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('\n')
      .trim() || '';

  return {
    success: true,
    model,
    analysis: normalizeGeminiAnalysis(parseJsonResponse(text)),
  };
}

async function inferCompanyTagsWithGemini({ problemSlug, fallbackCompanyTags }) {
  const { apiKey, model, enabled } = getGeminiConfig();

  if (!enabled) {
    return {
      success: false,
      reason: 'Gemini API key not configured',
    };
  }

  const prompt = `You are helping a LeetCode Chrome extension.

Problem slug: ${problemSlug || 'unknown'}
Fallback company tags: ${JSON.stringify(fallbackCompanyTags || [])}

Infer likely company tags for this LeetCode problem. For unseen or latest questions,
do not claim exact historical frequency. Return likely interview/company tags based
on the problem topic, algorithm pattern, and common company interview preferences.

Return only valid JSON:
{
  "companyTags": ["Company"],
  "companyTagReasoning": "One short sentence",
  "confidence": "low" | "medium" | "high"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('\n')
      .trim() || '';
  const parsed = parseJsonResponse(text);

  return {
    success: true,
    model,
    companyTags: normalizeCompanyTags(parsed.companyTags),
    companyTagReasoning:
      parsed.companyTagReasoning || 'AI inferred likely company tags.',
    confidence: parsed.confidence || 'medium',
  };
}

function buildProblemAnalysisPrompt({
  code,
  problemSlug,
  fallbackComplexity,
  fallbackCompanyTags,
}) {
  return `You are an expert LeetCode tutor and interview-prep assistant.

Analyze the user's submitted solution and the LeetCode problem context.

Problem slug: ${problemSlug || 'unknown'}
Fallback complexity estimate: ${JSON.stringify(fallbackComplexity || {})}
Fallback company tags: ${JSON.stringify(fallbackCompanyTags || [])}

Code:
\`\`\`
${code}
\`\`\`

Return only valid JSON with this exact shape:
{
  "timeComplexity": "Big-O string",
  "spaceComplexity": "Big-O string",
  "explanation": "Short explanation of the complexity",
  "bottlenecks": ["Short bottleneck"],
  "suggestions": ["Short actionable suggestion"],
  "companyTags": ["Company"],
  "companyTagReasoning": "One sentence explaining why these are likely tags",
  "confidence": "low" | "medium" | "high"
}

For companyTags on unseen or latest LeetCode questions, infer likely interview
company tags from the problem topic and algorithm pattern. Do not claim exact
historical company frequency unless the slug is already present in the fallback tags.`;
}

function parseJsonResponse(text) {
  if (!text) return {};

  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw error;
    }
    return JSON.parse(match[0]);
  }
}

function normalizeGeminiAnalysis(analysis) {
  return {
    timeComplexity: analysis.timeComplexity || 'Unknown',
    spaceComplexity: analysis.spaceComplexity || 'Unknown',
    explanation: analysis.explanation || '',
    bottlenecks: Array.isArray(analysis.bottlenecks)
      ? analysis.bottlenecks.slice(0, 5)
      : [],
    suggestions: Array.isArray(analysis.suggestions)
      ? analysis.suggestions.slice(0, 5)
      : [],
    companyTags: normalizeCompanyTags(analysis.companyTags),
    companyTagReasoning: analysis.companyTagReasoning || '',
    confidence: analysis.confidence || 'medium',
  };
}

function normalizeCompanyTags(companyTags) {
  if (!Array.isArray(companyTags)) return [];

  return Array.from(
    new Set(
      companyTags
        .filter((company) => typeof company === 'string')
        .map((company) => company.trim())
        .filter(Boolean)
    )
  ).slice(0, 8);
}

module.exports = {
  analyzeLeetCodeProblemWithGemini,
  inferCompanyTagsWithGemini,
  getGeminiConfig,
};
