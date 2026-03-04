import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportPanel } from '@/components/ExportPanel';
import { FaviconPanel } from '@/components/FaviconPanel';
import { DesignTokensPanel } from '@/components/DesignTokensPanel';
import { SocialCardPanel } from '@/components/SocialCardPanel';
import { useFavicon } from '@/hooks/useFavicon';
import { useSocialCards } from '@/hooks/useSocialCards';
import type { LogoConfig } from '@fetchkit/brand';

export default function ExportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState<LogoConfig | null>(null);
  const favicon = useFavicon(config);
  const socialCards = useSocialCards(config);

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
            Download your logo, favicon, social cards, and design tokens.
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
        <TabsContent value="tokens">
          <DesignTokensPanel config={config} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
