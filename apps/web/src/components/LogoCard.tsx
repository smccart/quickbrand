import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { LogoCanvas } from './LogoCanvas';
import type { LogoVariation } from '@fetchkit/brand';

interface LogoCardProps {
  variation: LogoVariation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function LogoCard({ variation, isSelected, onSelect }: LogoCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className={`cursor-pointer p-4 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center min-h-30 ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={() => onSelect(variation.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <LogoCanvas
        config={variation.config}
        layout={hovered ? 'vertical' : 'horizontal'}
      />
    </Card>
  );
}
