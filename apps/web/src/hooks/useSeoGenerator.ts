import { useState, useCallback } from 'react';
import type { SeoArtifactType, SeoInput, SeoBundle } from '@fetchkit/seo';
import { generateBundle } from '@fetchkit/seo';

interface UseSeoGeneratorReturn {
  bundle: SeoBundle | null;
  isGenerating: boolean;
  generate: (types: SeoArtifactType[], input: SeoInput) => void;
  downloadAll: () => Promise<void>;
  downloadSingle: (type: SeoArtifactType) => void;
}

const MIME_TYPES: Record<string, string> = {
  html: 'text/html',
  xml: 'application/xml',
  text: 'text/plain',
  json: 'application/json',
};

export function useSeoGenerator(): UseSeoGeneratorReturn {
  const [bundle, setBundle] = useState<SeoBundle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback((types: SeoArtifactType[], input: SeoInput) => {
    setIsGenerating(true);
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

    for (const artifact of bundle.artifacts) {
      zip.file(artifact.filename, artifact.content);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seo-toolkit.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [bundle]);

  const downloadSingle = useCallback((type: SeoArtifactType) => {
    if (!bundle) return;
    const artifact = bundle.artifacts.find(a => a.type === type);
    if (!artifact) return;
    const mimeType = MIME_TYPES[artifact.language] || 'text/plain';
    const blob = new Blob([artifact.content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifact.filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [bundle]);

  return { bundle, isGenerating, generate, downloadAll, downloadSingle };
}
