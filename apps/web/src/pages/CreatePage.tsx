import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyNameInput } from '@/components/CompanyNameInput';
import { generateLogos, CURATED_FONTS } from '@fetchkit/brand';
import { loadAllFonts } from '@/lib/browser';

export default function CreatePage() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (name: string) => {
    setIsGenerating(true);
    loadAllFonts(CURATED_FONTS);
    try {
      const variations = await generateLogos(name);
      navigate('/create/results', { state: { variations, companyName: name } });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">Create Your Logo</h1>
        <p className="text-muted-foreground text-lg">
          Enter your company name and we'll generate 30 unique logo variations
          for you to choose from.
        </p>
        <div className="flex justify-center">
          <CompanyNameInput onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>
        {isGenerating && (
          <p className="text-sm text-muted-foreground animate-pulse">
            Searching for icons and generating logos...
          </p>
        )}
      </div>
    </div>
  );
}
