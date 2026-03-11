import { useState, useCallback } from 'react';
import type { SecurityArtifactType, SecurityInput, SecurityBundle } from '@fetchkit/security';
import { generateBundle } from '@fetchkit/security';

interface UseSecurityGeneratorReturn {
  bundle: SecurityBundle | null;
  isGenerating: boolean;
  generate: (types: SecurityArtifactType[], input: SecurityInput) => void;
  downloadAll: () => Promise<void>;
  downloadSingle: (type: SecurityArtifactType) => void;
}

const MIME_TYPES: Record<string, string> = {
  typescript: 'text/typescript',
  text: 'text/plain',
  json: 'application/json',
  env: 'text/plain',
};

export function useSecurityGenerator(): UseSecurityGeneratorReturn {
  const [bundle, setBundle] = useState<SecurityBundle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback((types: SecurityArtifactType[], input: SecurityInput) => {
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
    a.download = 'security-config.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [bundle]);

  const downloadSingle = useCallback((type: SecurityArtifactType) => {
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
