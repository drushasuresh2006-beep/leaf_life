import { useCallback, useEffect, useState } from 'react';
import { predictLeaf } from './api/predict';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { getPlantsForMode } from './data/plants';
import { TRANSLATIONS } from './i18n/translations';
import { AboutPage } from './pages/AboutPage';
import { CareQuestionsPage } from './pages/CareQuestionsPage';
import { HistoryPage } from './pages/HistoryPage';
import { HomePage } from './pages/HomePage';
import { ResultPage } from './pages/ResultPage';
import { ScanPage, SelectedLeafImage } from './pages/ScanPage';
import {
  AppMode,
  CareAnswers,
  LanguageCode,
  PlantId,
  RoutePage,
  SavedScan,
} from './types/leafcheck';
import {
  createThumbnailDataUrl,
  loadSavedLanguage,
  loadScanHistory,
  saveLanguage,
  saveScanHistory,
} from './utils/storage';

const DEFAULT_CARE_ANSWERS: CareAnswers = {
  wateringFrequency: 'every_2_3_days',
  sunlight: 'medium',
  potDrainage: 'yes',
  lastFertilised: 'recently',
};

const VALID_PAGES: RoutePage[] = ['home', 'scan', 'care', 'result', 'history', 'about'];

function getPageFromHash(): RoutePage {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '') as RoutePage;
  return VALID_PAGES.includes(raw) ? raw : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<RoutePage>(() => getPageFromHash());
  const [language, setLanguage] = useState<LanguageCode>(() => loadSavedLanguage());

  const [{ scans: initialScans, storageAvailable: initialStorageAvailable }] = useState(() =>
    loadScanHistory()
  );
  const [savedScans, setSavedScans] = useState<SavedScan[]>(initialScans);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(initialStorageAvailable);

  const [mode, setMode] = useState<AppMode>('home');
  const [selectedPlant, setSelectedPlant] = useState<PlantId>('tomato');
  const [selectedImage, setSelectedImage] = useState<SelectedLeafImage | null>(null);
  const [careAnswers, setCareAnswers] = useState<CareAnswers>(DEFAULT_CARE_ANSWERS);

  const [isAnalysing, setIsAnalysing] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [currentScan, setCurrentScan] = useState<SavedScan | null>(null);

  const t = TRANSLATIONS[language];

  const navigate = useCallback((page: RoutePage) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const targetHash = `#${page}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggleLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    saveLanguage(lang);
  };

  const handleModeChange = (nextMode: AppMode) => {
    setMode(nextMode);
    const availablePlants = getPlantsForMode(nextMode);
    if (!availablePlants.some((p) => p.id === selectedPlant)) {
      setSelectedPlant(availablePlants[0]?.id ?? 'tomato');
    }
  };

  const persistScans = (nextScans: SavedScan[]) => {
    setSavedScans(nextScans);
    const ok = saveScanHistory(nextScans);
    if (!ok) {
      setStorageAvailable(false);
    }
  };

  const runAnalysis = async (answersToInclude?: CareAnswers) => {
    if (!selectedImage) return;
    setScanError(null);
    setIsAnalysing(true);

    try {
      const [prediction, thumbnailDataUrl] = await Promise.all([
        predictLeaf(selectedImage.source, selectedPlant, mode, answersToInclude),
        createThumbnailDataUrl(selectedImage.previewUrl),
      ]);

      const completedScan: SavedScan = {
        ...prediction,
        thumbnailDataUrl: thumbnailDataUrl ?? selectedImage.previewUrl,
        careAnswers: answersToInclude,
        helpful: null,
        savedAt: new Date().toISOString(),
      };

      setCurrentScan(completedScan);
      navigate('result');
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong while checking that photo. Please try again.';
      setScanError(msg);
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleSaveScan = (scan: SavedScan) => {
    const alreadyExists = savedScans.some((item) => item.id === scan.id);
    if (alreadyExists) return;
    const nextScans = [{ ...scan, savedAt: new Date().toISOString() }, ...savedScans];
    persistScans(nextScans);
  };

  const handleHelpfulChange = (scan: SavedScan, helpful: boolean) => {
    const updatedScan: SavedScan = { ...scan, helpful };
    setCurrentScan(updatedScan);

    const exists = savedScans.some((item) => item.id === scan.id);
    if (exists) {
      const nextScans = savedScans.map((item) => (item.id === scan.id ? updatedScan : item));
      persistScans(nextScans);
    } else {
      const nextScans = [
        { ...updatedScan, savedAt: new Date().toISOString() },
        ...savedScans,
      ];
      persistScans(nextScans);
    }
  };

  const handleDeleteScan = (id: string) => {
    const nextScans = savedScans.filter((item) => item.id !== id);
    persistScans(nextScans);

    if (currentScan?.id === id) {
      setCurrentScan(null);
      navigate(nextScans.length > 0 ? 'history' : 'scan');
    }
  };

  const handleClearAll = () => {
    persistScans([]);
    if (currentScan) {
      setCurrentScan((prev) => (prev ? { ...prev, helpful: prev.helpful ?? null } : null));
    }
  };

  const handleScanAnother = () => {
    setScanError(null);
    if (selectedImage && selectedImage.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
    setCareAnswers(DEFAULT_CARE_ANSWERS);
    navigate('scan');
  };

  const isCurrentScanSaved = currentScan
    ? savedScans.some((item) => item.id === currentScan.id)
    : false;

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7F3] text-[#17211A] dark:bg-[#0E1410] dark:text-[#ECF2ED]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-[#1E6B45] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Header
        currentPage={currentPage}
        onNavigate={navigate}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        t={t}
      />

      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-12"
      >
        {currentPage === 'home' && (
          <HomePage onNavigate={navigate} savedCount={savedScans.length} t={t} />
        )}

        {currentPage === 'scan' && (
          <ScanPage
            mode={mode}
            onModeChange={handleModeChange}
            selectedPlant={selectedPlant}
            onSelectPlant={setSelectedPlant}
            selectedImage={selectedImage}
            onImageSelected={setSelectedImage}
            onProceedToCare={() => navigate('care')}
            onAnalyseNow={() => runAnalysis(undefined)}
            isAnalysing={isAnalysing}
            errorMessage={scanError}
            onClearError={() => setScanError(null)}
            t={t}
          />
        )}

        {currentPage === 'care' && (
          <CareQuestionsPage
            plant={selectedPlant}
            selectedImage={selectedImage}
            careAnswers={careAnswers}
            onChangeCareAnswers={setCareAnswers}
            onBack={() => navigate('scan')}
            onSkipAndAnalyse={() => runAnalysis(undefined)}
            onAnalyseWithCare={() => runAnalysis(careAnswers)}
            isAnalysing={isAnalysing}
            errorMessage={scanError}
            t={t}
          />
        )}

        {currentPage === 'result' && (
          <ResultPage
            key={currentScan?.id ?? 'empty'}
            scan={currentScan}
            isSaved={isCurrentScanSaved}
            isAnalysing={isAnalysing}
            onSave={handleSaveScan}
            onDelete={handleDeleteScan}
            onHelpfulChange={handleHelpfulChange}
            onScanAnother={handleScanAnother}
            onGoHistory={() => navigate('history')}
            t={t}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            scans={savedScans}
            storageAvailable={storageAvailable}
            onSelectScan={(scan) => {
              setCurrentScan(scan);
              navigate('result');
            }}
            onDeleteScan={handleDeleteScan}
            onClearAll={handleClearAll}
            onNavigateScan={() => navigate('scan')}
            t={t}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigateScan={() => navigate('scan')} t={t} />
        )}
      </main>

      <footer className="hidden border-t border-[#DCE2DA] bg-[#F2F4EE] py-6 text-xs text-[#57675C] md:block dark:border-[#243028] dark:bg-[#0B100D] dark:text-[#8FA095]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <p>LeafCheck · Screening aid only, not a diagnosis.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate('about')}
              className="hover:text-[#17211A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:hover:text-[#ECF2ED]"
            >
              {t.navAbout}
            </button>
            <button
              type="button"
              onClick={() => navigate('history')}
              className="hover:text-[#17211A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:hover:text-[#ECF2ED]"
            >
              {t.navHistory}
            </button>
          </div>
        </div>
      </footer>

      <BottomNav currentPage={currentPage} onNavigate={navigate} t={t} />
    </div>
  );
}
