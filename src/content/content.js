import { injectAnalyzeButton } from './injectButton';
import { observePageChanges } from './observer';
import { renderCompanyTags } from './companyTags';
import { renderComplexityUI } from './complexityUI';
import { getProblemSlug } from '../utils/domHelpers';

function injectScript() {
  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = () => {
      script.remove();
      console.log('Inject script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load inject.js');
      script.remove();
    };
    document.documentElement.appendChild(script);
  } catch (error) {
    console.error('Error injecting script:', error);
  }
}

// Initialize extension components
injectScript();
injectAnalyzeButton();
observePageChanges();
renderCompanyTags();
renderComplexityUI();

// Listen for code updates from injected script
window.addEventListener('message', (event) => {
  // Ignore messages from other sources
  if (event.source !== window) return;
  
  if (event.data.type === 'LEETCODE_CODE') {
    const code = event.data.code;
    const problemSlug = getProblemSlug();
    
    // Broadcast to background script with error handling
    try {
      chrome.runtime.sendMessage(
        { type: 'CODE_UPDATED', code, problemSlug },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Message error:', chrome.runtime.lastError);
            return;
          }
          
          if (response) {
            // Update complexity display
            const complexityDiv = document.getElementById('complexity-display');
            if (complexityDiv) {
              const source = response.analysisSource
                ? `<p style="margin: 4px 0; font-size: 11px; opacity: 0.8;">Source: ${response.analysisSource}</p>`
                : '';
              complexityDiv.innerHTML = `
                <p style="margin: 4px 0;">Time: ${response.timeComplexity}</p>
                <p style="margin: 4px 0;">Space: ${response.spaceComplexity}</p>
                ${source}
              `;
              complexityDiv.style.display = 'block';
            }
          }
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
});

console.log('LeetCode AI Assistant loaded');
