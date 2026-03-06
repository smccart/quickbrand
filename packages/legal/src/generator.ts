import type { LegalDocType, LegalInput, LegalDocument, LegalBundle } from './types';
import { LEGAL_DOC_TYPES } from './types';
import { privacyPolicyTemplate } from './templates/privacy-policy';
import { termsOfServiceTemplate } from './templates/terms-of-service';
import { cookieConsentTemplate } from './templates/cookie-consent';
import { disclaimerTemplate } from './templates/disclaimer';
import { acceptableUseTemplate } from './templates/acceptable-use';
import { dmcaTemplate } from './templates/dmca';

const templateMap: Record<LegalDocType, (input: LegalInput) => string> = {
  'privacy-policy': privacyPolicyTemplate,
  'terms-of-service': termsOfServiceTemplate,
  'cookie-consent': cookieConsentTemplate,
  disclaimer: disclaimerTemplate,
  'acceptable-use': acceptableUseTemplate,
  dmca: dmcaTemplate,
};

/** Convert a subset of Markdown to HTML. Covers headings, lists, tables, bold, italic, links, paragraphs. */
function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let inUl = false;
  let inOl = false;
  let inTable = false;

  function inline(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  function closeList() {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  }

  function closeTable() {
    if (inTable) { out.push('</tbody></table>'); inTable = false; }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList();
      closeTable();
      const level = headingMatch[1].length;
      out.push(`<h${level}>${inline(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Table row
    if (line.startsWith('|') && line.endsWith('|')) {
      closeList();
      // Skip separator rows like |---|---|
      if (/^\|[\s-:|]+\|$/.test(line)) {
        continue;
      }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (!inTable) {
        out.push('<table><thead><tr>');
        cells.forEach(c => out.push(`<th>${inline(c)}</th>`));
        out.push('</tr></thead><tbody>');
        inTable = true;
        continue;
      }
      out.push('<tr>');
      cells.forEach(c => out.push(`<td>${inline(c)}</td>`));
      out.push('</tr>');
      continue;
    } else {
      closeTable();
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      closeTable();
      if (!inUl) { closeList(); out.push('<ul>'); inUl = true; }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      closeTable();
      if (!inOl) { closeList(); out.push('<ol>'); inOl = true; }
      out.push(`<li>${inline(olMatch[1])}</li>`);
      continue;
    }

    // Close lists on non-list line
    closeList();

    // Empty line
    if (line.trim() === '') continue;

    // Paragraph
    out.push(`<p>${inline(line)}</p>`);
  }

  closeList();
  closeTable();
  return out.join('\n');
}

function normalizeInput(input: LegalInput): LegalInput {
  return {
    ...input,
    effectiveDate: input.effectiveDate || new Date().toISOString().split('T')[0],
    jurisdiction: input.jurisdiction || 'United States',
    appType: input.appType || 'website',
  };
}

export function generateDocument(type: LegalDocType, input: LegalInput): LegalDocument {
  const templateFn = templateMap[type];
  if (!templateFn) {
    throw new Error(`Unknown document type: ${type}`);
  }

  const normalized = normalizeInput(input);
  const markdown = templateFn(normalized);
  const html = markdownToHtml(markdown);
  const wordCount = markdown.split(/\s+/).filter(Boolean).length;

  return {
    type,
    title: LEGAL_DOC_TYPES[type].title,
    markdown,
    html,
    metadata: {
      generatedAt: new Date().toISOString(),
      effectiveDate: normalized.effectiveDate!,
      jurisdiction: normalized.jurisdiction!,
      wordCount,
    },
  };
}

export function generateBundle(types: LegalDocType[], input: LegalInput): LegalBundle {
  const normalized = normalizeInput(input);
  const documents = types.map(type => generateDocument(type, normalized));
  return { documents, input: normalized };
}
