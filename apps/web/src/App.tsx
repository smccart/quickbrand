import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SiteColorProvider } from '@/hooks/useSiteColor';
import { ThemeProvider } from '@/hooks/useTheme';

const HomePage = lazy(() => import('@/pages/HomePage'));
const RefinePage = lazy(() => import('@/pages/RefinePage'));
const ExportPage = lazy(() => import('@/pages/ExportPage'));
const DocsPage = lazy(() => import('@/pages/DocsPage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));
const SeoPage = lazy(() => import('@/pages/SeoPage'));
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const PalettePage = lazy(() => import('@/pages/PalettePage'));
const PlaceholdersPage = lazy(() => import('@/pages/PlaceholdersPage'));

export default function App() {
  return (
    <ThemeProvider>
    <SiteColorProvider>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<RefinePage />} />
            <Route path="/create/results" element={<Navigate to="/create" replace />} />
            <Route path="/create/export" element={<ExportPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/seo" element={<SeoPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/palette" element={<PalettePage />} />
            <Route path="/placeholders" element={<PlaceholdersPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
    </SiteColorProvider>
    </ThemeProvider>
  );
}
