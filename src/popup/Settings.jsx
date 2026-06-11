import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Load settings from chrome storage
    chrome.storage.sync.get(
      ['apiKey', 'autoAnalyze', 'darkMode'],
      (items) => {
        setApiKey(items.apiKey || '');
        setAutoAnalyze(items.autoAnalyze || false);
        setDarkMode(items.darkMode !== false);
      }
    );
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({
      apiKey,
      autoAnalyze,
      darkMode,
    });
    alert('Settings saved!');
  };

  return (
    <div className="settings-container">
      <div className="setting-group">
        <label htmlFor="api-key">Gemini API Key:</label>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="setting-input"
        />
      </div>

      <div className="setting-group checkbox">
        <input
          id="auto-analyze"
          type="checkbox"
          checked={autoAnalyze}
          onChange={(e) => setAutoAnalyze(e.target.checked)}
        />
        <label htmlFor="auto-analyze">Auto-analyze code on load</label>
      </div>

      <div className="setting-group checkbox">
        <input
          id="dark-mode"
          type="checkbox"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
        <label htmlFor="dark-mode">Dark Mode</label>
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Settings
      </button>

      <div className="setting-info">
        <h4>Get Gemini API Key:</h4>
        <p>
          Visit{' '}
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google AI Studio
          </a>
        </p>
      </div>
    </div>
  );
}
