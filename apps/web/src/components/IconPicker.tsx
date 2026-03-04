import { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/input';
import { searchIcons } from '@fetchkit/brand';
import type { IconConfig } from '@fetchkit/brand';

interface IconPickerProps {
  currentIcon: IconConfig;
  onSelect: (icon: IconConfig) => void;
}

export function IconPicker({ currentIcon, onSelect }: IconPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IconConfig[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const icons = await searchIcons(query.trim(), 24);
      setResults(icons);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Icon</h3>
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search icons..."
          className="h-8 text-sm"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="text-xs px-3 py-1 bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
        >
          {isSearching ? '...' : 'Search'}
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Current:</span>
        <Icon icon={currentIcon.id} width={20} height={20} />
        <span className="text-xs">{currentIcon.id}</span>
      </div>
      {results.length > 0 && (
        <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
          {results.map((icon) => (
            <button
              key={icon.id}
              onClick={() => onSelect(icon)}
              className={`p-2 rounded-md hover:bg-accent transition-colors flex items-center justify-center ${
                icon.id === currentIcon.id ? 'bg-accent ring-1 ring-primary' : ''
              }`}
              title={icon.id}
            >
              <Icon icon={icon.id} width={24} height={24} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
