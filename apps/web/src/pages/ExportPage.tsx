import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportPanel } from '@/components/ExportPanel';
import { FaviconPanel } from '@/components/FaviconPanel';
import { DesignTokensPanel } from '@/components/DesignTokensPanel';
import { SocialCardPanel } from '@/components/SocialCardPanel';
import { PaletteExportPanel } from '@/components/PaletteExportPanel';
import { PlaceholderPanel } from '@/components/PlaceholderPanel';
import { useFavicon } from '@/hooks/useFavicon';
import { useSocialCards } from '@/hooks/useSocialCards';
import { usePlaceholders } from '@/hooks/usePlaceholders';
import { useSiteColor } from '@/hooks/useSiteColor';
import type { LogoConfig } from '@fetchkit/brand';
import { semanticPaletteFromColorPalette, bundlePaletteExport } from '@fetchkit/brand';

export default function ExportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState<LogoConfig | null>(null);
  const favicon = useFavicon(config);
  const socialCards = useSocialCards(config);
  const { color, secondaryColor } = useSiteColor();
  const placeholders = usePlaceholders(color, secondaryColor);

  const paletteExport = useMemo(() => {
    if (!config) return null;
    const palette = semanticPaletteFromColorPalette(config.colors);
    return bundlePaletteExport(palette);
  }, [config?.colors.iconColor]);

  const handlePaletteDownload = async () => {
    if (!paletteExport) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    zip.file('palette.css', paletteExport.cssVariables);
    zip.file('tailwind-colors.js', paletteExport.tailwindConfig);
    zip.file('tokens.json', paletteExport.tokensJson);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const state = location.state as { config?: LogoConfig } | null;
    if (state?.config) {
      setConfig(state.config);
    } else {
      navigate('/create');
    }
  }, [location.state, navigate]);

  if (!config) return null;

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Export Your Assets</h1>
          <p className="text-sm text-muted-foreground">
            Download your logo, favicon, social cards, palette, placeholders, and design tokens.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to Refine
          </Button>
          <Button variant="outline" onClick={() => navigate('/create')}>
            Start Over
          </Button>
        </div>
      </div>

      <Tabs defaultValue="logo">
        <TabsList className="mb-6">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="favicon">Favicon</TabsTrigger>
          <TabsTrigger value="social">Social Cards</TabsTrigger>
          <TabsTrigger value="palette">Palette</TabsTrigger>
          <TabsTrigger value="placeholders">Placeholders</TabsTrigger>
          <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
        </TabsList>
        <TabsContent value="logo">
          <ExportPanel config={config} />
        </TabsContent>
        <TabsContent value="favicon">
          <FaviconPanel
            bundle={favicon.bundle}
            isGenerating={favicon.isGenerating}
            onDownloadAll={favicon.downloadAll}
            onDownloadSingle={favicon.downloadSingle}
          />
        </TabsContent>
        <TabsContent value="social">
          <SocialCardPanel
            cards={socialCards.cards}
            isGenerating={socialCards.isGenerating}
            onDownloadAll={socialCards.downloadAll}
            onDownloadSingle={socialCards.downloadSingle}
          />
        </TabsContent>
        <TabsContent value="palette">
          <PaletteExportPanel
            exportData={paletteExport}
            onDownloadZip={handlePaletteDownload}
          />
        </TabsContent>
        <TabsContent value="placeholders">
          <PlaceholderPanel
            bundle={placeholders.bundle}
            isGenerating={placeholders.isGenerating}
            onDownloadAll={placeholders.downloadAll}
            onDownloadSingle={placeholders.downloadSingle}
          />
        </TabsContent>
        <TabsContent value="tokens">
          <DesignTokensPanel config={config} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
