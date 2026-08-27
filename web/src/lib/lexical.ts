/**
 * Minimal Lexical → HTML renderer for Payload rich text.
 * Covers what the editor produces for the lawyer's content:
 * headings, paragraphs, lists, quotes, links, bold/italic/underline.
 * Kept dependency-free so the Workers bundle stays small.
 */

interface LexicalNode {
  type?: string;
  tag?: string;
  text?: string;
  format?: number | string;
  listType?: string;
  url?: string;
  newTab?: boolean;
  children?: LexicalNode[];
  fields?: { url?: string; newTab?: boolean };
}

const escapeHtml = (s: string) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

// Lexical text format bitmask
const BOLD = 1;
const ITALIC = 2;
const UNDERLINE = 8;

function renderText(node: LexicalNode): string {
  let html = escapeHtml(node.text ?? '');
  const f = typeof node.format === 'number' ? node.format : 0;
  if (f & BOLD) html = `<strong>${html}</strong>`;
  if (f & ITALIC) html = `<em>${html}</em>`;
  if (f & UNDERLINE) html = `<u>${html}</u>`;
  return html;
}

function renderChildren(node: LexicalNode): string {
  return (node.children ?? []).map(renderNode).join('');
}

function renderNode(node: LexicalNode): string {
  switch (node.type) {
    case 'text':
      return renderText(node);
    case 'linebreak':
      return '<br>';
    case 'paragraph': {
      const inner = renderChildren(node);
      return inner.trim() ? `<p>${inner}</p>` : '';
    }
    case 'heading': {
      const tag = /^h[1-6]$/.test(node.tag ?? '') ? node.tag : 'h2';
      return `<${tag}>${renderChildren(node)}</${tag}>`;
    }
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      return `<${tag}>${renderChildren(node)}</${tag}>`;
    }
    case 'listitem':
      return `<li>${renderChildren(node)}</li>`;
    case 'quote':
      return `<blockquote>${renderChildren(node)}</blockquote>`;
    case 'link':
    case 'autolink': {
      const url = node.fields?.url ?? node.url ?? '#';
      const target = (node.fields?.newTab ?? node.newTab) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${escapeHtml(url)}"${target}>${renderChildren(node)}</a>`;
    }
    case 'horizontalrule':
      return '<hr>';
    default:
      // Unknown container nodes: render children so content never disappears
      return renderChildren(node);
  }
}

export function lexicalToHtml(content: unknown): string {
  const root = (content as { root?: LexicalNode })?.root;
  if (!root) return '';
  return renderChildren(root);
}
