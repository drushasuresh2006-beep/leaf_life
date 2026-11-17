import {
  Camera,
  Check,
  HelpCircle,
  Leaf,
  Loader2,
  Sprout,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { SafetyBanner } from '../components/SafetyBanner';
import { ADVICE_BY_KEY, getCareIssueHints } from '../data/advice';
import { getPlantName } from '../data/plants';
import { TranslationStrings } from '../i18n/translations';
import { SavedScan } from '../types/leafcheck';

interface ResultPageProps {
  scan: SavedScan | null;
  isSaved: boolean;
  isAnalysing: boolean;
  onSave: (scan: SavedScan) => void;
  onDelete: (id: string) => void;
  onHelpfulChange: (scan: SavedScan, helpful: boolean) => void;
  onScanAnother: () => void;
  onGoHistory: () => void;
  t: TranslationStrings;
}

export function ResultPage({
  scan,
  isSaved,
  isAnalysing,
  onSave,
  onDelete,
  onHelpfulChange,
  onScanAnother,
  onGoHistory,
  t,
}: ResultPageProps) {
  const [thumbError, setThumbError] = useState(false);

  if (isAnalysing) {
    return (
      <div
        aria-busy="true"
        className="mx-auto max-w-2xl rounded-3xl border border-[#DCE2DA] bg-white p-10 text-center dark:border-[#243028] dark:bg-[#151D17]"
      >
        <Loader2
          className="mx-auto h-10 w-10 animate-spin text-[#1E6B45] dark:text-[#6AD199]"
          aria-hidden="true"
        />
        <h1 className="mt-4 font-display text-2xl font-semibold text-[#17211A] dark:text-[#ECF2ED]">
          {t.scanAnalysing}
        </h1>
        <p className="mt-2 text-sm text-[#57675C] dark:text-[#98A89D]">
          Checking leaf patterns and preparing general care guidance.
        </p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <SafetyBanner />
        <div className="rounded-3xl border border-[#DCE2DA] bg-white p-8 text-center dark:border-[#243028] dark:bg-[#151D17]">
          <Leaf
            className="mx-auto h-10 w-10 text-[#3B6A4D] dark:text-[#7FD3A3]"
            aria-hidden="true"
          />
          <h1 className="mt-3 font-display text-2xl font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            No scan selected
          </h1>
          <p className="mt-2 text-sm text-[#57675C] dark:text-[#98A89D]">
            Start a new leaf scan or open one of your saved checks from History.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onScanAnother}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#1E6B45] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#165435] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              <span>{t.ctaScanLeaf}</span>
            </button>
            <button
              type="button"
              onClick={onGoHistory}
              className="inline-flex min-h-[44px] items-center rounded-xl border border-[#CBD4C8] bg-white px-5 py-2.5 text-sm font-semibold text-[#233328] hover:bg-[#EFF3EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2D3B32] dark:bg-[#17211B] dark:text-[#DCE6DF] dark:hover:bg-[#202D25]"
            >
              <span>{t.navHistory}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isUncertain =
    scan.isNotLeaf || scan.plantMatchesSelection === false || scan.confidence < 50;
  const isHealthy = !isUncertain && scan.adviceKey === 'healthy';
  const advice = isUncertain
    ? ADVICE_BY_KEY.not_sure
    : (ADVICE_BY_KEY[scan.adviceKey] ?? ADVICE_BY_KEY.leaf_spot);

  const careHints = scan.careAnswers ? getCareIssueHints(scan.careAnswers, isHealthy) : null;
  const formattedDate = new Date(scan.createdAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const modeLabel = scan.mode === 'home' ? t.scanModeHome : t.scanModeField;
  const plantLabel = getPlantName(scan.plant);

  const uncertainExplanation = scan.isNotLeaf
    ? 'This image does not clearly look like a single plant leaf or plant part, so no condition is suggested.'
    : scan.plantMatchesSelection === false
      ? `The leaf in this photo does not appear to match ${plantLabel}, so no condition is suggested.`
      : 'Confidence is below 50%, so we are holding back any disease suggestion to avoid a misleading guess.';

  const retakeTips = [
    'Place a single leaf flat so no other leaves overlap.',
    'Shoot in bright, indirect daylight without flash glare or harsh shadows.',
    'Use a plain, neutral background such as paper, cloth, or stone.',
    'Hold steady until leaf veins and spots are in crisp focus.',
    'Move closer so the leaf fills most of the frame.',
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold text-[#17211A] sm:text-3xl dark:text-[#ECF2ED]">
          {t.resultTitle}
        </h1>
        <p className="text-xs text-[#57675C] dark:text-[#98A89D]">
          {plantLabel} · {modeLabel} · {formattedDate}
        </p>
      </div>

      {/* Mandatory always-visible screening banner */}
      <SafetyBanner />

      {/* Main result card */}
      <div className="rounded-3xl border border-[#DCE2DA] bg-white p-5 sm:p-6 dark:border-[#243028] dark:bg-[#151D17]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Thumbnail */}
          <div className="h-44 w-full shrink-0 overflow-hidden rounded-2xl border border-[#DCE2DA] bg-[#EDF2EA] sm:h-40 sm:w-40 dark:border-[#243028] dark:bg-[#1B261E]">
            {scan.thumbnailDataUrl && !thumbError ? (
              <img
                src={scan.thumbnailDataUrl}
                alt={`Scanned ${plantLabel} leaf`}
                referrerPolicy="no-referrer"
                onError={() => setThumbError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-3 text-center text-[#4F6B57] dark:text-[#8FB99D]">
                <Leaf className="h-7 w-7" aria-hidden="true" />
                <span className="text-xs font-medium">{plantLabel}</span>
              </div>
            )}
          </div>

          {/* Prediction summary */}
          <div className="min-w-0 flex-1 space-y-4">
            {isUncertain ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#8B3B2B] dark:text-[#F09A8E]">
                  <HelpCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Uncertain screening
                  </span>
                </div>
                <h2 className="font-display text-2xl font-semibold text-[#17211A] dark:text-[#ECF2ED]">
                  {t.resultNotSureTitle}
                </h2>
                <p className="text-sm leading-relaxed text-[#49594E] dark:text-[#B0BFB5]">
                  {uncertainExplanation}
                </p>
                <ConfidenceMeter confidence={scan.confidence} t={t} />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-[#57675C] dark:text-[#98A89D]">
                    Top screening match
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[#17211A] sm:text-3xl dark:text-[#ECF2ED]">
                    {isHealthy ? 'Likely healthy' : `Likely: ${scan.label}`}
                  </h2>
                </div>

                <ConfidenceMeter confidence={scan.confidence} t={t} />

                {scan.alternatives.length > 0 && (
                  <div className="border-t border-[#E6EBE4] pt-3.5 dark:border-[#232E27]">
                    <h3 className="text-xs font-semibold text-[#4B5A50] dark:text-[#A4B3A9]">
                      Top 3 other possibilities
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      {scan.alternatives.slice(0, 3).map((alt) => (
                        <li
                          key={alt.label}
                          className="flex items-center justify-between text-sm text-[#28362D] dark:text-[#D1DDD5]"
                        >
                          <span>{alt.label}</span>
                          <span className="font-semibold tabular-nums text-[#4E5E53] dark:text-[#98A89D]">
                            {alt.confidence}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {scan.reason && (
              <div className="border-t border-[#E6EBE4] pt-3.5 dark:border-[#232E27]">
                <h3 className="text-xs font-semibold text-[#4B5A50] dark:text-[#A4B3A9]">
                  Why this result
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#28362D] dark:text-[#D1DDD5]">
                  {scan.reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Retake tips when Not Sure, or General Advice when confident */}
      {isUncertain ? (
        <section
          aria-labelledby="retake-tips-heading"
          className="rounded-2xl border border-[#DCE2DA] bg-white p-5 sm:p-6 dark:border-[#243028] dark:bg-[#151D17]"
        >
          <h2
            id="retake-tips-heading"
            className="font-display text-lg font-semibold text-[#17211A] dark:text-[#ECF2ED]"
          >
            Tips for a clearer retake
          </h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#425247] dark:text-[#B4C3B9]">
            {retakeTips.map((tip) => (
              <li key={tip} className="flex items-start gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E6B45] dark:bg-[#6AD199]"
                  aria-hidden="true"
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section
          aria-labelledby="advice-heading"
          className="rounded-2xl border border-[#DCE2DA] bg-white p-5 sm:p-6 dark:border-[#243028] dark:bg-[#151D17]"
        >
          <h2
            id="advice-heading"
            className="font-display text-lg font-semibold text-[#17211A] dark:text-[#ECF2ED]"
          >
            General care guidance
          </h2>
          <p className="mt-1 text-sm text-[#57675C] dark:text-[#98A89D]">{advice.summary}</p>
          <ul className="mt-3.5 space-y-2.5 text-sm leading-relaxed text-[#2D3B32] dark:text-[#D5E0D8]">
            {advice.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E6B45] dark:bg-[#6AD199]"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Care issue card (shown only if Home mode care answers exist) */}
      {careHints && scan.careAnswers && (
        <section
          aria-labelledby="care-issue-heading"
          className="rounded-2xl border border-[#DCE2DA] bg-[#F2F6F0] p-5 sm:p-6 dark:border-[#243028] dark:bg-[#131C16]"
        >
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-[#1E6B45] dark:text-[#6AD199]" aria-hidden="true" />
            <h2
              id="care-issue-heading"
              className="font-display text-lg font-semibold text-[#17211A] dark:text-[#ECF2ED]"
            >
              Could it be a care issue?
            </h2>
          </div>

          <p className="mt-1.5 text-xs text-[#57675C] dark:text-[#98A89D]">
            Based on your answers: watering {scan.careAnswers.wateringFrequency.replace(/_/g, ' ')}{' '}
            · {scan.careAnswers.sunlight} sunlight · drainage: {scan.careAnswers.potDrainage.replace(/_/g, ' ')} · fertilised:{' '}
            {scan.careAnswers.lastFertilised.replace(/_/g, ' ')}
          </p>

          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#28362D] dark:text-[#D1DDD5]">
            {careHints.map((hint) => (
              <li key={hint} className="flex items-start gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A5E42] dark:bg-[#6AD199]"
                  aria-hidden="true"
                />
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Helpful feedback + Action bar */}
      <div className="flex flex-col gap-5 rounded-2xl border border-[#DCE2DA] bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#243028] dark:bg-[#151D17]">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            {t.resultHelpfulQuestion}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onHelpfulChange(scan, true)}
              aria-pressed={scan.helpful === true}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                scan.helpful === true
                  ? 'border-[#1E6B45] bg-[#E8F3EC] text-[#144D31] dark:border-[#49B67D] dark:bg-[#152B1E] dark:text-[#A7E8C2]'
                  : 'border-[#DCE2DA] bg-[#FAFBF9] text-[#28362D] hover:bg-[#EFF3EC] dark:border-[#253229] dark:bg-[#111813] dark:text-[#CED9D1] dark:hover:bg-[#1B261E]'
              }`}
            >
              <ThumbsUp className="h-4 w-4" aria-hidden="true" />
              <span>{t.resultYes}</span>
            </button>

            <button
              type="button"
              onClick={() => onHelpfulChange(scan, false)}
              aria-pressed={scan.helpful === false}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                scan.helpful === false
                  ? 'border-[#8A3B2B] bg-[#FDF0ED] text-[#7A271B] dark:border-[#D47160] dark:bg-[#291411] dark:text-[#F4B4AA]'
                  : 'border-[#DCE2DA] bg-[#FAFBF9] text-[#28362D] hover:bg-[#EFF3EC] dark:border-[#253229] dark:bg-[#111813] dark:text-[#CED9D1] dark:hover:bg-[#1B261E]'
              }`}
            >
              <ThumbsDown className="h-4 w-4" aria-hidden="true" />
              <span>{t.resultNo}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onSave(scan)}
            disabled={isSaved}
            className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
              isSaved
                ? 'border border-[#B9DEC8] bg-[#E8F5ED] text-[#144E32] dark:border-[#26543B] dark:bg-[#13291D] dark:text-[#8BE0B0]'
                : 'border border-[#1E6B45] bg-white text-[#1E6B45] hover:bg-[#EDF5EF] dark:border-[#49B67D] dark:bg-[#17211B] dark:text-[#7FD3A3] dark:hover:bg-[#1D2D23]'
            }`}
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>{isSaved ? t.resultSaved : t.resultSave}</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(scan.id)}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-[#E5C6C0] bg-white px-4 py-2 text-sm font-semibold text-[#8A2B1D] transition-colors hover:bg-[#FDF0ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A2B1D] dark:border-[#4F2620] dark:bg-[#17211B] dark:text-[#F09A8E] dark:hover:bg-[#2B1714]"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>{t.resultDelete}</span>
          </button>

          <button
            type="button"
            onClick={onScanAnother}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E6B45] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#165435] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] sm:flex-none dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            <span>{t.resultScanAnother}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
