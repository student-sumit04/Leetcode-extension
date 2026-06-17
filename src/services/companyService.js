import companies from '../data/companies.json';

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

export function getCompanies(problemSlug) {
  if (!problemSlug) return [];
  return getCompanyInfo(problemSlug).companies;
}

export function getCompanyInfo(problemSlug) {
  if (!problemSlug) {
    return {
      companies: [],
      source: 'unknown',
      inferred: false,
    };
  }

  if (companies[problemSlug]) {
    return {
      companies: companies[problemSlug],
      source: 'exact',
      inferred: false,
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

  const inferred = Array.from(inferredCompanies).slice(0, 6);

  return {
    companies: inferred,
    source: inferred.length > 0 ? 'inferred' : 'unknown',
    inferred: inferred.length > 0,
  };
}

export function getAllCompanies() {
  const allCompanies = new Set();
  Object.values(companies).forEach((companyList) => {
    companyList.forEach((company) => allCompanies.add(company));
  });
  return Array.from(allCompanies).sort();
}

export function getProblemsByCompany(companyName) {
  const problems = [];
  Object.entries(companies).forEach(([problem, companyList]) => {
    if (companyList.includes(companyName)) {
      problems.push(problem);
    }
  });
  return problems;
}

export function addCompanyToProblem(problemSlug, companyName) {
  if (!companies[problemSlug]) {
    companies[problemSlug] = [];
  }
  if (!companies[problemSlug].includes(companyName)) {
    companies[problemSlug].push(companyName);
  }
}

export function getCompanyStats() {
  const stats = {};
  Object.values(companies).forEach((companyList) => {
    companyList.forEach((company) => {
      stats[company] = (stats[company] || 0) + 1;
    });
  });
  return stats;
}
