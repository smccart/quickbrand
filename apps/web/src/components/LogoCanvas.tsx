import { useMemo } from 'react';
import { Icon } from '@iconify/react';
import type { LogoConfig, LayoutDirection } from '@fetchkit/brand';

interface LogoCanvasProps {
  config: LogoConfig;
  layout: LayoutDirection;
  className?: string;
}

export function LogoCanvas({ config, layout, className = '' }: LogoCanvasProps) {
  const { companyName, font, icon, colors } = config;

  const letters = useMemo(() => {
    return Array.from(companyName).map((char, i) => ({
      char,
      color: colors.letterColors[i] ?? colors.letterColors[0],
    }));
  }, [companyName, colors.letterColors]);

  if (layout === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Icon icon={icon.id} width={40} height={40} style={{ color: colors.iconColor }} />
        <span
          className="whitespace-nowrap"
          style={{ fontFamily: `'${font.family}', sans-serif`, fontWeight: font.weight, fontSize: '28px' }}
        >
          {letters.map((l, i) => (
            <span key={i} style={{ color: l.color }}>
              {l.char}
            </span>
          ))}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <Icon icon={icon.id} width={40} height={40} style={{ color: colors.iconColor }} />
      <span
        className="whitespace-nowrap"
        style={{ fontFamily: `'${font.family}', sans-serif`, fontWeight: font.weight, fontSize: '24px' }}
      >
        {letters.map((l, i) => (
          <span key={i} style={{ color: l.color }}>
            {l.char}
          </span>
        ))}
      </span>
    </div>
  );
}
