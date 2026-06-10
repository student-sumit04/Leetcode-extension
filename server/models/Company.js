// Company data model
const companies = {
  'two-sum': ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple', 'Adobe'],
  'reverse-linked-list': [
    'Adobe',
    'Amazon',
    'Apple',
    'Bloomberg',
    'Facebook',
    'Google',
  ],
  'contains-duplicate': ['Amazon', 'Google', 'Microsoft', 'Uber', 'Yahoo'],
  'valid-anagram': ['Amazon', 'Google', 'Meta', 'Bloomberg'],
  'best-time-to-buy-and-sell-stock': [
    'Amazon',
    'Google',
    'Apple',
    'Microsoft',
  ],
  'longest-substring-without-repeating-characters': [
    'Amazon',
    'Apple',
    'Facebook',
    'Google',
    'Microsoft',
    'Uber',
  ],
  'merge-k-sorted-lists': ['Amazon', 'Google', 'Uber', 'Zenefits'],
  'binary-search': ['Amazon', 'Apple', 'Google', 'Microsoft'],
  'number-of-islands': ['Amazon', 'Google', 'Microsoft', 'Meta'],
  'word-ladder': ['Amazon', 'Meta', 'Google'],
};

const problemPatterns = [
  {
    keywords: ['array', 'sum', 'duplicate', 'product', 'subarray', 'stock'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta'],
  },
  {
    keywords: ['string', 'substring', 'anagram', 'palindrome', 'regex'],
    companies: ['Amazon', 'Google', 'Meta', 'Bloomberg'],
  },
  {
    keywords: ['linked-list', 'list', 'node'],
    companies: ['Amazon', 'Microsoft', 'Adobe', 'Apple'],
  },
  {
    keywords: ['tree', 'binary-tree', 'bst', 'trie'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta'],
  },
  {
    keywords: ['graph', 'island', 'course', 'network', 'path'],
    companies: ['Google', 'Meta', 'Amazon', 'Uber'],
  },
  {
    keywords: ['dynamic', 'dp', 'robber', 'coin', 'climb'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
  },
  {
    keywords: ['heap', 'priority', 'k-sorted', 'top-k', 'median'],
    companies: ['Amazon', 'Google', 'Uber', 'Bloomberg'],
  },
  {
    keywords: ['binary-search', 'search', 'sorted'],
    companies: ['Amazon', 'Apple', 'Google', 'Microsoft'],
  },
];

function getCompaniesForProblem(problemSlug = '') {
  const exactCompanies = companies[problemSlug];

  if (exactCompanies) {
    return {
      companies: exactCompanies,
      source: 'exact',
    };
  }

  const inferredCompanies = new Set();

  problemPatterns.forEach(({ keywords, companies: patternCompanies }) => {
    const matchesPattern = keywords.some((keyword) =>
      problemSlug.includes(keyword)
    );

    if (matchesPattern) {
      patternCompanies.forEach((company) => inferredCompanies.add(company));
    }
  });

  return {
    companies: Array.from(inferredCompanies).slice(0, 6),
    source: inferredCompanies.size > 0 ? 'inferred' : 'unknown',
  };
}

module.exports = {
  companies,
  getCompaniesForProblem,
};
