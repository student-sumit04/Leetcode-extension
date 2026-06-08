/**
 * DOM Helper utilities for interacting with the page
 */

export function findCodeEditor() {
  return document.querySelector('.monaco-editor');
}

export function getEditorCode() {
  try {
    const models = window.monaco?.editor?.getModels?.();
    return models?.[0]?.getValue?.() || '';
  } catch (e) {
    console.error('Error getting code:', e);
    return '';
  }
}

export function getProblemTitle() {
  const titleElement = document.querySelector('[data-cy="question-title"]');
  return titleElement?.textContent || 'Unknown Problem';
}

export function getProblemSlug() {
  const path = window.location.pathname;
  const match = path.match(/\/problems\/([^/]+)/);
  return match ? match[1] : null;
}

export function getDifficulty() {
  const difficultyElement = document.querySelector('[data-difficulty]');
  return difficultyElement?.getAttribute('data-difficulty') || 'unknown';
}

export function createAlertBox(message, type = 'info') {
  const box = document.createElement('div');
  box.className = `alert alert-${type}`;
  box.style.padding = '12px';
  box.style.borderRadius = '6px';
  box.style.marginBottom = '12px';
  box.style.fontSize = '14px';

  if (type === 'success') {
    box.style.background = '#d4edda';
    box.style.color = '#155724';
    box.style.border = '1px solid #c3e6cb';
  } else if (type === 'error') {
    box.style.background = '#f8d7da';
    box.style.color = '#721c24';
    box.style.border = '1px solid #f5c6cb';
  } else {
    box.style.background = '#d1ecf1';
    box.style.color = '#0c5460';
    box.style.border = '1px solid #bee5eb';
  }

  box.textContent = message;
  return box;
}

export function insertAfterElement(newElement, referenceElement) {
  referenceElement?.parentNode?.insertBefore(
    newElement,
    referenceElement?.nextSibling
  );
}

export function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}
