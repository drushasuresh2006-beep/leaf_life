import { Camera, Lock, ShieldCheck, Sprout } from 'lucide-react';
import { USE_MOCK } from '../api/predict';
import { getPlantsForMode } from '../data/plants';
import { TranslationStrings } from '../i18n/translations';

interface AboutPageProps {
  onNavigateScan: () => void;
  t: TranslationStrings;
}

export function AboutPage({ onNavigateScan, t }: AboutPageProps) {
  const homePlants = getPlantsForMode('home');
  const fieldPlants = getPlantsForMode('field');

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold text-[#17211A] sm:text-3xl dark:text-[#ECF2ED]">
          {t.aboutTitle}
        </h1>
        <p className="text-sm text-[#57675C] dark:text-[#98A89D]">
          How LeafCheck works, what it covers, and why every result is only a starting point.
        </p>
      </div>

      {/* What it does and does not do */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#DCE2DA] bg-white p-5 sm:p-6 dark:border-[#243028] dark:bg-[#151D17]">
          <h2 className="font-display text-lg font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            What LeafCheck does
          </h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#425247] dark:text-[#B4C3B9]">
            <li className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E6B45] dark:bg-[#6AD199]"
                aria-hidden="true"
              />
              <span>
                Helps home gardeners, terrace growers, and small farmers organise leaf checks and
                spot common patterns.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E6B45] dark:bg-[#6AD199]"
                aria-hidden="true"
              />
              <span>
                Combines leaf screening with simple watering, light, and drainage checks for potted
                plants.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E6B45] dark:bg-[#6AD199]"
                aria-hidden="true"
              />
              <span>
                {USE_MOCK
                  ? 'Currently running in offline Demo Mode with simulated predictions for testing.'
                  : 'Uses Gemini vision screening to suggest likely matches from a fixed plant label list, with an estimated confidence score.'}
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[#DCE2DA] bg-white p-5 sm:p-6 dark:border-[#243028] dark:bg-[#151D17]">
          <h2 className="font-display text-lg font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            What LeafCheck does not do
          </h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#425247] dark:text-[#B4C3B9]">
            <li className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B6817] dark:bg-[#E5C16C]"
                aria-hidden="true"
              />
              <span>
                It is not a trained plant disease model and never replaces an agriculture extension
                officer, plant clinic, or nursery specialist.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B6817] dark:bg-[#E5C16C]"
                aria-hidden="true"
              />
              <span>
                It never recommends chemical pesticides, fungicides, or application dosages.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B6817] dark:bg-[#E5C16C]"
                aria-hidden="true"
              />
              <span>
                It cannot inspect roots, soil nutrients, or stem borers hidden below a leaf photo.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Real-world accuracy note */}
      <section className="rounded-2xl border border-[#DDD4B8] bg-[#FAF6EA] p-5 sm:p-6 dark:border-[#443B21] dark:bg-[#1E1A11]">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-[#8B6817] dark:text-[#E5C16C]"
            aria-hidden="true"
          />
          <div className="space-y-1.5">
            <h2 className="font-display text-lg font-semibold text-[#3C2F10] dark:text-[#F4E6C0]">
              Why real-world accuracy is lower than lab benchmarks
            </h2>
            <p className="text-sm leading-relaxed text-[#52431E] dark:text-[#DFCE9F]">
              Plant disease benchmarks trained on clean laboratory photos often score well under
              studio lighting, yet accuracy is usually lower on real-world photos taken outdoors.
              Uneven sunlight, shadows, dust, water droplets, overlapping leaves, and mixed soil
              backgrounds all make visual screening harder—which is why LeafCheck shows confidence
              estimates and withholds disease names below 50%.
            </p>
          </div>
        </div>
      </section>

      {/* Supported plants */}
      <section className="rounded-2xl border border-[#DCE2DA] bg-white p-5 sm:p-6 dark:border-[#243028] dark:bg-[#151D17]">
        <div className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-[#1E6B45] dark:text-[#6AD199]" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            Supported plants
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
              {t.scanModeHome}
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[#49594E] dark:text-[#B0BFB5]">
              {homePlants.map((plant) => (
                <li key={plant.id}>
                  {plant.name}{' '}
                  <span className="text-xs text-[#6B7A70] dark:text-[#84958A]">
                    ({plant.botanicalHint})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
              {t.scanModeField}
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[#49594E] dark:text-[#B0BFB5]">
              {fieldPlants.map((plant) => (
                <li key={plant.id}>
                  {plant.name}{' '}
                  <span className="text-xs text-[#6B7A70] dark:text-[#84958A]">
                    ({plant.botanicalHint})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="rounded-2xl border border-[#DCE2DA] bg-white p-5 sm:p-6 dark:border-[#243028] dark:bg-[#151D17]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Lock
              className="mt-0.5 h-5 w-5 shrink-0 text-[#1E6B45] dark:text-[#6AD199]"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <h2 className="font-display text-lg font-semibold text-[#17211A] dark:text-[#ECF2ED]">
                Privacy and local storage
              </h2>
              <p className="text-sm leading-relaxed text-[#425247] dark:text-[#B4C3B9]">
                {USE_MOCK
                  ? 'In Demo Mode, photos stay on your device.'
                  : 'Uploaded photos are sent to the app server for Gemini vision screening and are not stored in a user database.'}{' '}
                LeafCheck collects no personal details, no account data, and no precise GPS
                location. Saved scan thumbnails and notes live only in your browser&apos;s local
                storage.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateScan}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1E6B45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#165435] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            <span>{t.ctaScanLeaf}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
