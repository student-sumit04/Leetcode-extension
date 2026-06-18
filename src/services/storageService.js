/**
 * Chrome Storage Service for persisting extension data
 */

export const StorageService = {
  /**
   * Save data to Chrome storage
   */
  save: (key, data) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: data }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Get data from Chrome storage
   */
  get: (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key]);
        }
      });
    });
  },

  /**
   * Remove data from storage
   */
  remove: (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.remove([key], () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Save analysis history
   */
  saveAnalysis: (problemSlug, analysis) => {
    return new Promise(async (resolve) => {
      const history = (await StorageService.get('analysisHistory')) || {};
      history[problemSlug] = {
        ...analysis,
        timestamp: Date.now(),
      };
      await StorageService.save('analysisHistory', history);
      resolve();
    });
  },

  /**
   * Get analysis history for a problem
   */
  getAnalysisHistory: (problemSlug) => {
    return new Promise(async (resolve) => {
      const history = (await StorageService.get('analysisHistory')) || {};
      resolve(history[problemSlug]);
    });
  },

  /**
   * Save user settings
   */
  saveSettings: (settings) => {
    return StorageService.save('settings', {
      ...settings,
      lastUpdated: Date.now(),
    });
  },

  /**
   * Get user settings
   */
  getSettings: () => {
    return StorageService.get('settings');
  },
};
