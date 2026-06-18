// Common constants for the extension

export const EXTENSION_NAME = 'LeetCode AI Assistant';
export const EXTENSION_VERSION = '1.0.0';

export const COMPLEXITY_LEVELS = {
  CONSTANT: 'O(1)',
  LINEAR: 'O(n)',
  LINEARITHMIC: 'O(n log n)',
  QUADRATIC: 'O(n²)',
  EXPONENTIAL: 'O(2^n)',
  FACTORIAL: 'O(n!)',
};

export const ALGORITHMS = {
  TWO_POINTER: 'Two Pointer',
  SLIDING_WINDOW: 'Sliding Window',
  BINARY_SEARCH: 'Binary Search',
  DFS: 'Depth First Search',
  BFS: 'Breadth First Search',
  DYNAMIC_PROGRAMMING: 'Dynamic Programming',
  GREEDY: 'Greedy Algorithm',
};

export const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  SETTINGS: 'user_settings',
  ANALYSIS_HISTORY: 'analysis_history',
  AUTO_ANALYZE: 'auto_analyze',
  DARK_MODE: 'dark_mode',
};

export const API_ENDPOINTS = {
  BASE: 'http://localhost:5000',
  ANALYZE: '/analyze',
  COMPANIES: '/companies',
};

export const UI_COLORS = {
  PRIMARY: '#ffa116',
  DARK: '#1f1f1f',
  TEXT: '#ffffff',
  ERROR: '#ff4444',
  SUCCESS: '#44ff44',
};

export const LEETCODE_URL_PATTERNS = {
  PROBLEM: 'https://leetcode.com/problems/*',
  DISCUSS: 'https://leetcode.com/discuss/*',
  CONTEST: 'https://leetcode.com/contest/*',
};
