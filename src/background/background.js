// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('LeetCode AI Assistant installed');
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ANALYZE_CODE' || request.type === 'CODE_UPDATED') {
    // Send to backend for analysis
    fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: request.code,
        problemSlug: request.problemSlug,
      }),
    })
      .then(res => res.json())
      .then(data => sendResponse(data))
      .catch(err => sendResponse({ error: err.message }));

    return true; // Will respond asynchronously
  }
});

// Tab update listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('leetcode.com/problems')) {
    console.log('LeetCode problem page loaded:', tab.url);
  }
});
