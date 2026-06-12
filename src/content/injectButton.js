export function injectAnalyzeButton() {
  if (document.getElementById('leetcode-ai-button')) return;

  const button = document.createElement('button');

  button.id = 'leetcode-ai-button';
  button.innerText = 'Analyze Code';
  button.title = 'Analyze your code with AI';

  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '99999';
  button.style.padding = '12px 20px';
  button.style.borderRadius = '8px';
  button.style.cursor = 'pointer';
  button.style.backgroundColor = '#ffa116';
  button.style.color = '#1f1f1f';
  button.style.border = 'none';
  button.style.fontWeight = 'bold';
  button.style.fontSize = '14px';
  button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  button.style.transition = 'all 0.3s ease';

  button.onmouseover = () => {
    button.style.backgroundColor = '#ffb84d';
    button.style.transform = 'scale(1.05)';
  };

  button.onmouseout = () => {
    button.style.backgroundColor = '#ffa116';
    button.style.transform = 'scale(1)';
  };

  button.addEventListener('click', () => {
    if (button.disabled) return;

    console.log('Analyze Clicked');
    button.innerText = 'Analyzing...';
    button.disabled = true;
    button.style.opacity = '0.8';
    button.style.cursor = 'wait';
    window.postMessage({ type: 'LEETCODE_AI_REQUEST_CODE' }, '*');
  });

  document.body.appendChild(button);
}
