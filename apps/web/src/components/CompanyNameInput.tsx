import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CompanyNameInputProps {
  onGenerate: (name: string) => void;
  isGenerating: boolean;
  initialValue?: string;
}

export function CompanyNameInput({ onGenerate, isGenerating, initialValue = '' }: CompanyNameInputProps) {
  const [name, setName] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) onGenerate(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-lg">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your company name..."
        className="text-lg h-12"
        autoFocus
      />
      <Button type="submit" size="lg" disabled={!name.trim() || isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>
    </form>
  );
}
