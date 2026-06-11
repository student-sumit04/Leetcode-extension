export function renderComplexityUI() {
  // Wait for page to fully load
  setTimeout(() => {
    const container = document.createElement('div');
    container.id = 'complexity-display';

    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.padding = '15px';
    container.style.background = '#1f1f1f';
    container.style.color = '#ffa116';
    container.style.zIndex = '99998';
    container.style.borderRadius = '8px';
    container.style.border = '2px solid #ffa116';
    container.style.fontSize = '14px';
    container.style.fontFamily = 'monospace';
    container.style.minWidth = '150px';
    container.style.display = 'none';

    const header = document.createElement('h4');
    header.innerText = 'Complexity';
    header.style.margin = '0 0 8px 0';
    header.style.fontSize = '12px';
    header.style.textTransform = 'uppercase';
    header.style.fontWeight = 'bold';

    container.appendChild(header);

    const content = document.createElement('div');
    content.innerHTML = `
      <p style="margin: 4px 0;">Time: --</p>
      <p style="margin: 4px 0;">Space: --</p>
    `;
    content.style.color = '#ffffff';

    container.appendChild(content);
    document.body.appendChild(container);

    // Show complexity display when needed
    // (This will be updated by content.js)
  }, 500);
}
