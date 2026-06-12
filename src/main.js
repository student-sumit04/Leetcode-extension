/**
 * Main entry point for the extension
 * This file initializes all modules and sets up the extension
 */

import { analyzeComplexity } from './parser/complexityAnalyzer';
import { detectPatterns } from './parser/patternDetector';
import { analyzeWithAI } from './ai/gemini';
import { StorageService } from './services/storageService';
import { apiService } from './services/apiService';
import { getCompanies } from './services/companyService';

export const LeetCodeAI = {
  /**
   * Initialize the extension
   */
  init: async () => {
    console.log('LeetCode AI Extension Initializing...');

    // Load settings
    const settings = await StorageService.getSettings();
    window.leetcodeAISettings = settings || {};

    // Set up message listeners
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        handleMessage(request, sendResponse);
      }
    );

    console.log('LeetCode AI Extension Ready');
  },

  /**
   * Analyze code
   */
  analyzeCode: async (code) => {
    const complexity = analyzeComplexity(code);
    const patterns = detectPatterns(code);

    return {
      complexity,
      patterns,
      analysis: {
        score: calculateScore(complexity),
        timestamp: Date.now(),
      },
    };
  },

  /**
   * Get AI analysis
   */
  getAIAnalysis: async (code) => {
    const apiKey = window.leetcodeAISettings?.apiKey;
    if (!apiKey) {
      return { error: 'API key not configured' };
    }

    try {
      return await analyzeWithAI(code, apiKey);
    } catch (error) {
      console.error('AI Analysis error:', error);
      return { error: error.message };
    }
  },

  /**
   * Get company info
   */
  getCompanyInfo: (problemSlug) => {
    return getCompanies(problemSlug);
  },
};

/**
 * Handle messages from content scripts
 */
function handleMessage(request, sendResponse) {
  switch (request.type) {
    case 'ANALYZE_CODE':
      LeetCodeAI.analyzeCode(request.code).then(sendResponse);
      return true; // Will respond asynchronously

    case 'GET_COMPANIES':
      sendResponse({
        companies: LeetCodeAI.getCompanyInfo(request.problemSlug),
      });
      break;

    case 'GET_SETTINGS':
      sendResponse(window.leetcodeAISettings);
      break;

    case 'SAVE_SETTINGS':
      StorageService.saveSettings(request.settings).then(() => {
        window.leetcodeAISettings = request.settings;
        sendResponse({ success: true });
      });
      return true; // Will respond asynchronously

    default:
      console.log('Unknown message type:', request.type);
  }
}

/**
 * Calculate optimization score
 */
function calculateScore(complexity) {
  const scores = {
    'O(1)': 100,
    'O(log n)': 95,
    'O(n)': 85,
    'O(n log n)': 80,
    'O(n²)': 50,
    'O(2^n)': 20,
    'O(n!)': 10,
  };

  return scores[complexity.timeComplexity] || 50;
}

// Initialize on load
if (typeof window !== 'undefined') {
  LeetCodeAI.init();
}

export default LeetCodeAI;
