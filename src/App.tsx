import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const HomePage = lazy(() => import('@/pages/HomePage'));
const CreatePage = lazy(() => import('@/pages/CreatePage'));
const RefinePage = lazy(() => import('@/pages/RefinePage'));
const ExportPage = lazy(() => import('@/pages/ExportPage'));
const DocsPage = lazy(() => import('@/pages/DocsPage'));

export default function App() {
  return (
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
            <Route path="/create" element={<CreatePage />} />
            <Route path="/create/results" element={<RefinePage />} />
            <Route path="/create/export" element={<ExportPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
