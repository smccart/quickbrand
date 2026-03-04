import { Button } from '@/components/ui/button';
import { LogoCanvas } from './LogoCanvas';
import { useExport } from '@/hooks/useExport';
import type { LogoConfig } from '@fetchkit/brand';

interface ExportPanelProps {
  config: LogoConfig;
}

export function ExportPanel({ config }: ExportPanelProps) {
  const { isExporting, exportSingle, exportAll } = useExport();

  return (
    <div className="space-y-8">
      {/* Preview section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Light mode previews */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Light Mode</h3>
          <div className="border rounded-lg p-6 bg-white space-y-6">
            <div>
              <p className="text-xs text-gray-400 mb-2">Horizontal</p>
              <LogoCanvas config={config} layout="horizontal" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Vertical</p>
              <LogoCanvas config={config} layout="vertical" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={() => exportSingle(config, 'horizontal', 'light')}
            >
              Download Horizontal
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={() => exportSingle(config, 'vertical', 'light')}
            >
              Download Vertical
            </Button>
          </div>
        </div>

        {/* Dark mode previews */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Dark Mode</h3>
          <div className="border rounded-lg p-6 bg-gray-900 space-y-6">
            <div>
              <p className="text-xs text-gray-500 mb-2">Horizontal</p>
              <LogoCanvas config={config} layout="horizontal" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Vertical</p>
              <LogoCanvas config={config} layout="vertical" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={() => exportSingle(config, 'horizontal', 'dark')}
            >
              Download Horizontal
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={() => exportSingle(config, 'vertical', 'dark')}
            >
              Download Vertical
            </Button>
          </div>
        </div>
      </div>

      {/* Download all */}
      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={isExporting}
          onClick={() => exportAll(config)}
        >
          {isExporting ? 'Exporting...' : 'Download All as ZIP'}
        </Button>
      </div>
    </div>
  );
}
