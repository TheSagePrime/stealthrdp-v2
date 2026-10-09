/* Labels for fenced code languages in the copyable code frame of guide articles. */

const labels: Record<string, string> = {
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  powershell: 'PowerShell',
  ps: 'PowerShell',
  cmd: 'Command Prompt',
  bat: 'Command Prompt',
  apache: 'Apache config',
  htaccess: '.htaccess',
  nginx: 'Nginx config',
  text: 'Text',
};

function codeLabel(language?: string) {
  return (language && labels[language.toLowerCase()]) || 'Command';
}

const COPY_ICON = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8Zm-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z"/></svg>';

/* Wraps every <pre> in trusted article HTML with the copyable code frame. */
export function withCopyableCode(html: string) {
  return html.replace(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/gi, (_full, attrs: string, body: string) => {
    const language = /\bclass=["'][^"']*language-([\w-]+)/i.exec(`${attrs} ${body}`)?.[1];
    const cleanAttrs = /\btabindex\s*=/i.test(attrs) ? attrs : ` tabindex="0"${attrs}`;
    return `<figure class="sr-code" data-code><figcaption class="sr-code-head"><span>${codeLabel(language)}</span>`
      + `<button type="button" class="sr-code-copy" data-copy-code aria-label="Copy code">${COPY_ICON}<span>Copy</span></button></figcaption>`
      + `<pre${cleanAttrs}>${body}</pre></figure>`;
  });
}
