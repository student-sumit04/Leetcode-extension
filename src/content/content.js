import { injectAnalyzeButton } from './injectButton';
import { observePageChanges } from './observer';
import { renderCompanyTags } from './companyTags';
import { renderComplexityUI } from './complexityUI';
import { getProblemSlug } from '../utils/domHelpers';

let analyzeRequested = false;

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

// Initialize extension components with error handling
try {
  injectScript();
} catch (error) {
  console.error('Failed to inject script:', error);
}

try {
  injectAnalyzeButton();
} catch (error) {
  console.error('Failed to inject analyze button:', error);
}

try {
  observePageChanges();
} catch (error) {
  console.error('Failed to observe page changes:', error);
}

try {
  renderCompanyTags();
} catch (error) {
  console.error('Failed to render company tags:', error);
}

try {
  renderComplexityUI();
} catch (error) {
  console.error('Failed to render complexity UI:', error);
}

// Listen for code updates from injected script
window.addEventListener('message', (event) => {
  // Ignore messages from other sources
  if (event.source !== window) return;

  const messageType = event.data?.type;

  if (messageType === 'LEETCODE_AI_REQUEST_CODE') {
    analyzeRequested = true;
    return;
  }

  if (messageType === 'LEETCODE_CODE_ERROR' && analyzeRequested) {
    analyzeRequested = false;
    resetAnalyzeButton();
    updateComplexityDisplay({
      error: true,
      message: event.data.message || 'Unable to read code from the editor.',
    });
    return;
  }
  
  if (messageType === 'LEETCODE_CODE') {
    if (!analyzeRequested) return;

    analyzeRequested = false;
    const code = event.data.code;
    const problemSlug = getProblemSlug();

    updateComplexityDisplay({
      loading: true,
      message: 'Analyzing with AI...',
    });
    
    // Broadcast to background script with error handling
    try {
      chrome.runtime.sendMessage(
        { type: 'ANALYZE_CODE', code, problemSlug },
        (response) => {
          resetAnalyzeButton();

          if (chrome.runtime.lastError) {
            console.error('Message error:', chrome.runtime.lastError);
            updateComplexityDisplay({
              error: true,
              message: 'Unable to analyze code. Please reload the extension and try again.',
            });
            return;
          }
          
          if (response?.error) {
            updateComplexityDisplay({
              error: true,
              message: response.error,
            });
            return;
          }

          updateComplexityDisplay(response);
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      resetAnalyzeButton();
      updateComplexityDisplay({
        error: true,
        message: 'Unable to send code for analysis.',
      });
    }
  }
});

function updateComplexityDisplay(response) {
  const complexityDiv = document.getElementById('complexity-display');
  if (!complexityDiv) return;

  if (response.loading) {
    complexityDiv.innerHTML = `
      <p style="margin: 0; color: #ffa116;">${escapeHtml(response.message)}</p>
    `;
    complexityDiv.style.display = 'block';
    return;
  }

  if (response.error) {
    complexityDiv.innerHTML = `
      <p style="margin: 0 0 6px 0; color: #ff6b6b; font-weight: 700;">Analysis failed</p>
      <p style="margin: 0; color: #ffffff;">${escapeHtml(response.message)}</p>
    `;
    complexityDiv.style.display = 'block';
    return;
  }

  if (!response.aiEnabled) {
    complexityDiv.innerHTML = `
      <p style="margin: 0 0 6px 0; color: #ffb84d; font-weight: 700;">AI unavailable</p>
      <p style="margin: 0; color: #ffffff;">Gemini could not analyze this run. Check your API key/quota and try again.</p>
      ${
        response.aiError
          ? `<p style="margin: 8px 0 0 0; font-size: 11px; opacity: 0.75;">${escapeHtml(response.aiError)}</p>`
          : ''
      }
    `;
    complexityDiv.style.display = 'block';
    return;
  }

  const source = response.analysisSource
    ? `<p style="margin: 6px 0 0 0; font-size: 11px; opacity: 0.8;">Source: ${escapeHtml(response.analysisSource)}</p>`
    : '';

  complexityDiv.innerHTML = `
    <p style="margin: 4px 0;">Time: ${escapeHtml(response.timeComplexity || 'Unknown')}</p>
    <p style="margin: 4px 0;">Space: ${escapeHtml(response.spaceComplexity || 'Unknown')}</p>
    ${source}
  `;
  complexityDiv.style.display = 'block';
}

function resetAnalyzeButton() {
  const button = document.getElementById('leetcode-ai-button');
  if (!button) return;

  button.innerText = 'Analyze Code';
  button.disabled = false;
  button.style.opacity = '1';
  button.style.cursor = 'pointer';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

console.log('LeetCode AI Assistant loaded');
