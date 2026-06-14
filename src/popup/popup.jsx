import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Settings from './Settings';
import './popup.css';

function getAiStatus(analysis) {
  if (!analysis) return { unavailable: false, message: '' };

  const aiDisabled = analysis.aiEnabled === false;
  const aiError = typeof analysis.aiError === 'string' ? analysis.aiError : '';
  const quotaReached = /quota|resource_exhausted|429/i.test(aiError);

  if (aiDisabled && quotaReached) {
    return {
      unavailable: true,
      message:
        'AI is temporarily unavailable because Gemini quota is exhausted. Showing rule-based analysis instead.',
    };
  }

  if (aiDisabled) {
    return {
      unavailable: true,
      message:
        'AI is currently unavailable. Showing rule-based analysis instead.',
    };
  }

  return { unavailable: false, message: '' };
}

function Popup() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get current tab info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      if (!url.includes('leetcode.com')) {
        // Show message if not on LeetCode
      }
    });
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // Get the current tab's code through background script
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { type: 'GET_CURRENT_ANALYSIS' },
          (res) => resolve(res)
        );
      });
      setAnalysis(response);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const aiStatus = getAiStatus(analysis);

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>🤖 LeetCode AI</h1>
        <p>Code Analysis & Optimization</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>

      <main className="popup-content">
        {activeTab === 'analysis' && (
          <div className="analysis-tab">
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>

            {analysis && (
              <div className="analysis-results">
                {aiStatus.unavailable && (
                  <div className="ai-status ai-status-warning">
                    <strong>AI unavailable:</strong> {aiStatus.message}
                  </div>
                )}

                <div className="result-item">
                  <label>Time Complexity:</label>
                  <span className="result-value">
                    {analysis.timeComplexity}
                  </span>
                </div>
                <div className="result-item">
                  <label>Space Complexity:</label>
                  <span className="result-value">
                    {analysis.spaceComplexity}
                  </span>
                </div>
                {analysis.suggestions && (
                  <div className="suggestions">
                    <h3>Suggestions:</h3>
                    <ul>
                      {analysis.suggestions.map((sugg, idx) => (
                        <li key={idx}>{sugg}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && <Settings />}
      </main>

      <footer className="popup-footer">
        <p>v1.0.0 | Made with ❤️</p>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Popup />);
