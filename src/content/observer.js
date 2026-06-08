export function observePageChanges() {
  let editorDetected = Boolean(document.querySelector('.monaco-editor'));

  if (editorDetected) {
    console.log('Code editor detected');
  }

  const observer = new MutationObserver(() => {
    if (editorDetected) return;

    editorDetected = Boolean(document.querySelector('.monaco-editor'));
    if (editorDetected) {
      console.log('Code editor detected');
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
}
