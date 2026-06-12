import { getPrompt } from './prompts';

export async function analyzeWithAI(code, apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const prompt = getPrompt('complexity', { code });

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
        apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText =
      data.candidates[0]?.content?.parts[0]?.text || 'No analysis available';

    return parseAIResponse(analysisText);
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw error;
  }
}

export async function getOptimizationSuggestions(code, timeComplexity, apiKey) {
  if (!apiKey) {
    return ['Enable Gemini API key for AI suggestions'];
  }

  try {
    const prompt = getPrompt('optimization', {
      code,
      currentComplexity: timeComplexity,
    });

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
        apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const suggestionsText =
      data.candidates[0]?.content?.parts[0]?.text || '';

    return parseSuggestions(suggestionsText);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return ['Unable to fetch AI suggestions'];
  }
}

function parseAIResponse(text) {
  // Parse Gemini response and extract structured data
  const analysis = {
    explanation: text,
    keyPoints: [],
  };

  // Extract key points (lines starting with bullet points)
  const lines = text.split('\n');
  lines.forEach((line) => {
    if (line.match(/^[-•*]/)) {
      analysis.keyPoints.push(line.replace(/^[-•*]\s*/, ''));
    }
  });

  return analysis;
}

function parseSuggestions(text) {
  const suggestions = [];
  const lines = text.split('\n').filter((line) => line.trim());

  lines.forEach((line) => {
    if (line.length > 10) {
      suggestions.push(line.trim());
    }
  });

  return suggestions.slice(0, 5); // Return top 5 suggestions
}
