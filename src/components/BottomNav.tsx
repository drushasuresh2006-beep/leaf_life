import { Camera, History, Home, Info } from 'lucide-react';
import { TranslationStrings } from '../i18n/translations';
import { RoutePage } from '../types/leafcheck';

interface BottomNavProps {
  currentPage: RoutePage;
  onNavigate: (page: RoutePage) => void;
  t: TranslationStrings;
}

export function BottomNav({ currentPage, onNavigate, t }: BottomNavProps) {
  const items: { id: RoutePage; label: string; icon: typeof Home }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'scan', label: t.navScan, icon: Camera },
    { id: 'history', label: t.navHistory, icon: History },
    { id: 'about', label: t.navAbout, icon: Info },
  ];

  const isActive = (id: RoutePage) => {
    if (id === 'scan' && (currentPage === 'care' || currentPage === 'result')) {
      return true;
    }
    return currentPage === id;
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#DCE2DA] bg-[#F6F7F3]/95 backdrop-blur-md md:hidden dark:border-[#243028] dark:bg-[#0E1410]/95"
    >
      <div className="grid grid-cols-4 items-center px-1 py-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex min-h-[48px] flex-col items-center justify-center rounded-xl px-1 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                active
                  ? 'text-[#1E6B45] dark:text-[#6AD199]'
                  : 'text-[#546358] hover:text-[#17211A] dark:text-[#98A89D] dark:hover:text-[#ECF2ED]'
              }`}
            >
              {active && (
                <span
                  className="mb-0.5 h-0.5 w-6 rounded-full bg-[#1E6B45] dark:bg-[#6AD199]"
                  aria-hidden="true"
                />
              )}
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.9} aria-hidden="true" />
              <span
                className={`mt-0.5 text-[11px] leading-none whitespace-nowrap ${
                  active ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
