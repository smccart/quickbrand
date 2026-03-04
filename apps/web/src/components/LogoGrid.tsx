import { LogoCard } from './LogoCard';
import type { LogoVariation } from '@fetchkit/brand';

interface LogoGridProps {
  variations: LogoVariation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function LogoGrid({ variations, selectedId, onSelect }: LogoGridProps) {
  if (variations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No logos generated yet. Enter a company name to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {variations.map((v) => (
        <LogoCard
          key={v.id}
          variation={v}
          isSelected={v.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
