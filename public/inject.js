let lastPostedCode = '';

function postEditorCode(force = false) {
  try {
    const models = window.monaco?.editor?.getModels?.() || [];
    if (models.length === 0) return;

    const code = models[0].getValue();
    if (!force && code === lastPostedCode) return;

    lastPostedCode = code;
    window.postMessage(
      {
        type: 'LEETCODE_CODE',
        code,
        timestamp: Date.now(),
      },
      '*'
    );
  } catch (error) {
    console.warn('Unable to read LeetCode editor code:', error.message);
  }
}

window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data?.type === 'LEETCODE_AI_REQUEST_CODE') {
    postEditorCode(true);
  }
});

setInterval(() => postEditorCode(false), 2000);
