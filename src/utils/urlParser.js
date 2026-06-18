/**
 * URL parsing utilities for LeetCode
 */

export function parseLeetCodeURL() {
  const url = window.location.href;

  return {
    isProblem: url.includes('/problems/'),
    isContest: url.includes('/contest/'),
    isDiscuss: url.includes('/discuss/'),
    slug: extractSlug(url),
    url: url,
  };
}

export function extractSlug(url) {
  const problemMatch = url.match(/\/problems\/([^/?]+)/);
  if (problemMatch) {
    return problemMatch[1];
  }
  return null;
}

export function getProblemIdFromSlug(slug) {
  // LeetCode problem IDs can be extracted or looked up
  // This is a basic implementation
  return slug?.replace(/-/g, '_');
}

export function isValidProblemURL(url) {
  return /leetcode\.com\/problems\/[a-zA-Z0-9-]+/.test(url);
}

export function buildProblemURL(slug) {
  return `https://leetcode.com/problems/${slug}/`;
}

export function getProblemDifficulty(url) {
  // This would need to be extracted from the page
  // Returning placeholder
  return 'unknown';
}

export function extractLanguage() {
  // Try to detect the programming language from the editor
  const languageIndicator = document.querySelector('[data-language]');
  return languageIndicator?.getAttribute('data-language') || 'javascript';
}
