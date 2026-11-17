import { AlertTriangle, ArrowRight, Camera, CheckSquare, Leaf, Sprout } from 'lucide-react';
import { useState } from 'react';
import { HERO_IMAGE_URL } from '../data/plants';
import { TranslationStrings } from '../i18n/translations';
import { RoutePage } from '../types/leafcheck';

interface HomePageProps {
  onNavigate: (page: RoutePage) => void;
  savedCount: number;
  t: TranslationStrings;
}

export function HomePage({ onNavigate, savedCount, t }: HomePageProps) {
  const [heroImageError, setHeroImageError] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Pick your growing mode and plant',
      description:
        'Choose Home / Garden for terrace pots and herbs, or Field / Farm for field crops.',
      Icon: Sprout,
    },
    {
      num: '02',
      title: 'Photograph one clear leaf',
      description:
        'Use bright, indirect light against a plain background so leaf spots and veins stay sharp.',
      Icon: Camera,
    },
    {
      num: '03',
      title: 'Review likely matches and care hints',
      description:
        'See confidence levels, non-chemical care pointers, and save notes locally to your device.',
      Icon: CheckSquare,
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero section */}
      <section className="overflow-hidden rounded-3xl border border-[#DCE2DA] bg-white dark:border-[#243028] dark:bg-[#151D17]">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-wide text-[#2A5E42] dark:text-[#7FD3A3]">
                Home gardens · Terrace pots · Small farms
              </p>
              <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-[#17211A] text-balance sm:text-4xl lg:text-[2.65rem] dark:text-[#ECF2ED]">
                {t.homeHeroTitle}
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-[#46554B] dark:text-[#B4C3B9]">
                {t.homeHeroSubtitle}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => onNavigate('scan')}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#1E6B45] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#165435] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] focus-visible:ring-offset-2 dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
              >
                <Camera className="h-5 w-5" aria-hidden="true" />
                <span>{t.ctaScanLeaf}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('history')}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#CED7CC] bg-transparent px-5 py-3 text-sm font-semibold text-[#233328] transition-colors hover:bg-[#EFF3EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2E3D33] dark:text-[#DCE6DF] dark:hover:bg-[#1D2821]"
              >
                <span>
                  {t.navHistory}
                  {savedCount > 0 ? ` (${savedCount})` : ''}
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative min-h-[220px] bg-[#E3EAE0] lg:col-span-5 lg:min-h-[340px] dark:bg-[#1B261E]">
            {!heroImageError ? (
              <img
                src={HERO_IMAGE_URL}
                alt="Healthy green tomato and herb leaves photographed in soft natural morning light"
                referrerPolicy="no-referrer"
                onError={() => setHeroImageError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 p-6 text-center text-[#3A5A45] dark:text-[#98C4A8]">
                <Leaf className="h-10 w-10" aria-hidden="true" />
                <p className="text-sm font-medium">Healthy garden foliage reference</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3-step How it works */}
      <section aria-labelledby="how-it-works-heading" className="space-y-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="how-it-works-heading"
            className="font-display text-2xl font-semibold text-[#17211A] dark:text-[#ECF2ED]"
          >
            {t.homeHowItWorksTitle}
          </h2>
          <p className="text-sm text-[#57675C] dark:text-[#98A89D]">
            Three quick steps · No account required
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.Icon;
            return (
              <div
                key={step.num}
                className="flex flex-col justify-between rounded-2xl border border-[#DCE2DA] bg-white p-5 sm:p-6 dark:border-[#243028] dark:bg-[#151D17]"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider tabular-nums text-[#2A5E42] dark:text-[#7FD3A3]">
                      STEP {step.num}
                    </span>
                    <Icon
                      className="h-5 w-5 text-[#2A5E42] dark:text-[#7FD3A3]"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-[#17211A] dark:text-[#ECF2ED]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4C5C51] dark:text-[#AAB9AF]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visible limitations notice */}
      <section
        aria-labelledby="limitations-heading"
        className="rounded-2xl border border-[#DDD4B8] bg-[#FAF6EA] p-5 sm:p-6 dark:border-[#443B21] dark:bg-[#1E1A11]"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-[#8B6817] dark:text-[#E5C16C]"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <h2
                id="limitations-heading"
                className="font-display text-lg font-semibold text-[#3C2F10] dark:text-[#F4E6C0]"
              >
                {t.homeLimitationsTitle}
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-[#52431E] dark:text-[#DFCE9F]">
                LeafCheck is an AI-assisted screening aid powered by Gemini—not a trained plant
                disease model, and never a certain diagnosis. It does not recommend chemical
                pesticides or dosages. Real-world field photos are harder to read than lab images,
                so confidence is only an estimate. Always confirm with a local nursery expert or
                agriculture officer before treating plants.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl border border-[#CBBF9B] bg-white px-4 py-2 text-sm font-semibold text-[#3C2F10] whitespace-nowrap transition-colors hover:bg-[#F3ECD6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6817] dark:border-[#594D2B] dark:bg-[#292316] dark:text-[#F4E6C0] dark:hover:bg-[#352E1D]"
          >
            Read limitations
          </button>
        </div>
      </section>
    </div>
  );
}
