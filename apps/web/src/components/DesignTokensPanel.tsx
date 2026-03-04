import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { LogoConfig } from '@agentkit/brand';
import {
  generateCssVariables,
  generateTailwindColors,
  generateColorTokensJson,
  generateFontCss,
  generateFontLinkTag,
  generateTailwindFont,
} from '@agentkit/brand';

interface DesignTokensPanelProps {
  config: LogoConfig;
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{label}</h4>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre className="border rounded-lg p-4 text-xs overflow-x-auto bg-muted/50">
        {code}
      </pre>
    </div>
  );
}

export function DesignTokensPanel({ config }: DesignTokensPanelProps) {
  return (
    <div className="space-y-8">
      {/* Colors section */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium">Colors</h3>
        <CodeBlock
          label="CSS Custom Properties"
          code={generateCssVariables(config.colors)}
        />
        <CodeBlock
          label="Tailwind Config"
          code={generateTailwindColors(config.colors)}
        />
        <CodeBlock
          label="Design Tokens (JSON)"
          code={generateColorTokensJson(config.colors)}
        />
      </div>

      <Separator />

      {/* Typography section */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium">Typography</h3>
        <CodeBlock
          label="CSS"
          code={generateFontCss(config.font)}
        />
        <CodeBlock
          label="Google Fonts Link Tag"
          code={generateFontLinkTag(config.font)}
        />
        <CodeBlock
          label="Tailwind Config"
          code={generateTailwindFont(config.font)}
        />
      </div>
    </div>
  );
}
