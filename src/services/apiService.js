import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export const apiService = {
  /**
   * Analyze code on backend
   */
  analyzeCode: (code, problemSlug) => {
    return axios.post(`${API_BASE}/analyze`, { code, problemSlug });
  },

  /**
   * Get company suggestions
   */
  getCompanyData: (problemSlug) => {
    return axios.get(`${API_BASE}/companies/${problemSlug}`);
  },

  /**
   * Save analysis result
   */
  saveAnalysis: (data) => {
    return axios.post(`${API_BASE}/analysis/save`, data);
  },

  /**
   * Get trending problems
   */
  getTrendingProblems: () => {
    return axios.get(`${API_BASE}/problems/trending`);
  },

  /**
   * Get problem statistics
   */
  getProblemStats: (problemSlug) => {
    return axios.get(`${API_BASE}/problems/${problemSlug}/stats`);
  },

  /**
   * Error handler wrapper
   */
  handleError: (error) => {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      return { error: 'No response from server' };
    } else {
      return { error: error.message };
    }
  },
};
