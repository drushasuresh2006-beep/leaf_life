import { Globe, Leaf } from 'lucide-react';
import { USE_MOCK } from '../api/predict';
import { TranslationStrings } from '../i18n/translations';
import { LanguageCode, RoutePage } from '../types/leafcheck';

interface HeaderProps {
  currentPage: RoutePage;
  onNavigate: (page: RoutePage) => void;
  language: LanguageCode;
  onToggleLanguage: (lang: LanguageCode) => void;
  t: TranslationStrings;
}

export function Header({
  currentPage,
  onNavigate,
  language,
  onToggleLanguage,
  t,
}: HeaderProps) {
  const navItems: { id: RoutePage; label: string }[] = [
    { id: 'home', label: t.navHome },
    { id: 'scan', label: t.navScan },
    { id: 'history', label: t.navHistory },
    { id: 'about', label: t.navAbout },
  ];

  const isNavActive = (id: RoutePage) => {
    if (id === 'scan' && (currentPage === 'care' || currentPage === 'result')) {
      return true;
    }
    return currentPage === id;
  };

  const badgeText = USE_MOCK ? t.demoBadge : t.aiBadge;

  return (
    <header className="sticky top-0 z-30 border-b border-[#DCE2DA] bg-[#F6F7F3]/95 backdrop-blur-md dark:border-[#243028] dark:bg-[#0E1410]/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6 md:gap-8 md:py-3">
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex min-h-[44px] items-center gap-2 rounded-xl px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:focus-visible:ring-[#58B983]"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E6B45] text-white dark:bg-[#2F8A5B]"
              aria-hidden="true"
            >
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-[#17211A] whitespace-nowrap dark:text-[#ECF2ED]">
              {t.appName}
            </span>
          </button>
        </div>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navItems.map((item) => {
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`min-h-[44px] px-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] rounded-md ${
                  active
                    ? 'text-[#1E6B45] underline decoration-2 underline-offset-8 dark:text-[#6AD199]'
                    : 'text-[#4B5A50] hover:text-[#17211A] dark:text-[#A9B8AE] dark:hover:text-[#ECF2ED]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            className="inline-flex items-center rounded-xl border border-[#DCE2DA] bg-white p-0.5 dark:border-[#243028] dark:bg-[#151D17]"
            role="group"
            aria-label={t.languageLabel}
          >
            <Globe
              className="ml-2 mr-1 h-3.5 w-3.5 text-[#58685D] dark:text-[#96A79C] hidden sm:block"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => onToggleLanguage('en')}
              aria-pressed={language === 'en'}
              className={`min-h-[38px] min-w-[40px] rounded-lg px-2.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                language === 'en'
                  ? 'bg-[#1E6B45] text-white dark:bg-[#2F8A5B]'
                  : 'text-[#4B5A50] hover:text-[#17211A] dark:text-[#A9B8AE] dark:hover:text-[#ECF2ED]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onToggleLanguage('hi')}
              aria-pressed={language === 'hi'}
              className={`min-h-[38px] min-w-[40px] rounded-lg px-2.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                language === 'hi'
                  ? 'bg-[#1E6B45] text-white dark:bg-[#2F8A5B]'
                  : 'text-[#4B5A50] hover:text-[#17211A] dark:text-[#A9B8AE] dark:hover:text-[#ECF2ED]'
              }`}
            >
              हिं
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('scan')}
            className="hidden md:inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1E6B45] px-4 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#165435] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] focus-visible:ring-offset-2 dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
          >
            {t.ctaScanLeaf}
          </button>
        </div>
      </div>

      <div
        role="status"
        className="border-t border-[#E6EBE4] bg-[#EDF2EA] px-4 py-1 text-center text-[11px] font-medium leading-snug text-[#294433] sm:text-xs dark:border-[#1E2922] dark:bg-[#141D17] dark:text-[#B9D4C2]"
      >
        {badgeText}
      </div>
    </header>
  );
}
