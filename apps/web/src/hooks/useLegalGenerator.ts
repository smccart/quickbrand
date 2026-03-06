import { useState, useCallback } from 'react';
import type { LegalDocType, LegalInput, LegalBundle } from '@fetchkit/legal';
import { generateBundle } from '@fetchkit/legal';

interface UseLegalGeneratorReturn {
  bundle: LegalBundle | null;
  isGenerating: boolean;
  generate: (types: LegalDocType[], input: LegalInput) => void;
  downloadAll: () => Promise<void>;
  downloadSingle: (type: LegalDocType) => void;
}

export function useLegalGenerator(): UseLegalGeneratorReturn {
  const [bundle, setBundle] = useState<LegalBundle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback((types: LegalDocType[], input: LegalInput) => {
    setIsGenerating(true);
    // Defer to next tick so UI updates
    setTimeout(() => {
      const result = generateBundle(types, input);
      setBundle(result);
      setIsGenerating(false);
    }, 0);
  }, []);

  const downloadAll = useCallback(async () => {
    if (!bundle) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    for (const doc of bundle.documents) {
      zip.file(`${doc.type}.md`, doc.markdown);
      zip.file(`${doc.type}.html`, doc.html);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legal-documents.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [bundle]);

  const downloadSingle = useCallback((type: LegalDocType) => {
    if (!bundle) return;
    const doc = bundle.documents.find(d => d.type === type);
    if (!doc) return;
    const blob = new Blob([doc.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.type}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [bundle]);

  return { bundle, isGenerating, generate, downloadAll, downloadSingle };
}
