import { AlertCircle, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { getPlantName } from '../data/plants';
import { TranslationStrings } from '../i18n/translations';
import {
  CareAnswers,
  LastFertilised,
  PlantId,
  PotDrainage,
  SunlightLevel,
  WateringFrequency,
} from '../types/leafcheck';
import { SelectedLeafImage } from './ScanPage';

interface CareQuestionsPageProps {
  plant: PlantId;
  selectedImage: SelectedLeafImage | null;
  careAnswers: CareAnswers;
  onChangeCareAnswers: (next: CareAnswers) => void;
  onBack: () => void;
  onSkipAndAnalyse: () => Promise<void>;
  onAnalyseWithCare: () => Promise<void>;
  isAnalysing: boolean;
  errorMessage: string | null;
  t: TranslationStrings;
}

export function CareQuestionsPage({
  plant,
  selectedImage,
  careAnswers,
  onChangeCareAnswers,
  onBack,
  onSkipAndAnalyse,
  onAnalyseWithCare,
  isAnalysing,
  errorMessage,
  t,
}: CareQuestionsPageProps) {
  const [lastAttemptSkipped, setLastAttemptSkipped] = useState(false);

  if (!selectedImage) {
    return (
      <div className="rounded-2xl border border-[#DCE2DA] bg-white p-8 text-center dark:border-[#243028] dark:bg-[#151D17]">
        <h1 className="font-display text-xl font-semibold text-[#17211A] dark:text-[#ECF2ED]">
          No leaf photo selected
        </h1>
        <p className="mt-2 text-sm text-[#57675C] dark:text-[#98A89D]">
          Please choose or take a leaf photo first before answering care questions.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1E6B45] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#165435] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45]"
        >
          Back to Scan
        </button>
      </div>
    );
  }

  const wateringOptions: { value: WateringFrequency; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'every_2_3_days', label: 'Every 2–3 days' },
    { value: 'weekly', label: 'Once a week' },
    { value: 'when_soil_dry', label: 'When topsoil feels dry' },
  ];

  const sunlightOptions: { value: SunlightLevel; label: string }[] = [
    { value: 'low', label: 'Low light / shade' },
    { value: 'medium', label: 'Medium / partial sun' },
    { value: 'bright', label: 'Bright direct sun' },
  ];

  const drainageOptions: { value: PotDrainage; label: string }[] = [
    { value: 'yes', label: 'Yes, drains freely' },
    { value: 'no', label: 'No drainage holes' },
    { value: 'not_sure', label: 'Not sure' },
  ];

  const fertilisedOptions: { value: LastFertilised; label: string }[] = [
    { value: 'never', label: 'Never' },
    { value: 'recently', label: 'Recently (within 30 days)' },
    { value: 'long_ago', label: 'Long ago (over 2 months)' },
  ];

  const handleSkip = () => {
    setLastAttemptSkipped(true);
    return onSkipAndAnalyse();
  };

  const handleAnalyse = () => {
    setLastAttemptSkipped(false);
    return onAnalyseWithCare();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isAnalysing}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#DCE2DA] bg-white px-3.5 py-2 text-sm font-medium text-[#233328] transition-colors hover:bg-[#EFF3EC] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#243028] dark:bg-[#151D17] dark:text-[#DCE6DF] dark:hover:bg-[#1D2821]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to photo</span>
        </button>

        <button
          type="button"
          onClick={handleSkip}
          disabled={isAnalysing}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-[#1E6B45] hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:text-[#7FD3A3]"
        >
          <span>{t.careSkipButton}</span>
        </button>
      </div>

      {/* Selected photo summary */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#DCE2DA] bg-white p-4 dark:border-[#243028] dark:bg-[#151D17]">
        <img
          src={selectedImage.previewUrl}
          alt={`${getPlantName(plant)} leaf thumbnail`}
          referrerPolicy="no-referrer"
          className="h-16 w-16 shrink-0 rounded-xl object-cover bg-[#E8EDE5] dark:bg-[#1D2820]"
        />
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold text-[#17211A] sm:text-2xl dark:text-[#ECF2ED]">
            {t.careTitle}
          </h1>
          <p className="text-sm text-[#57675C] dark:text-[#98A89D]">
            {getPlantName(plant)} · Optional home-care check (skippable)
          </p>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5BBB3] bg-[#FDF0ED] p-4 text-sm text-[#7A271B] dark:border-[#5D2A22] dark:bg-[#291411] dark:text-[#F4B4AA]"
        >
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="font-medium">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={lastAttemptSkipped ? handleSkip : handleAnalyse}
            disabled={isAnalysing}
            className="min-h-[40px] shrink-0 rounded-xl bg-[#8A2B1D] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#6E2116] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A2B1D]"
          >
            {isAnalysing ? t.scanAnalysing : 'Retry'}
          </button>
        </div>
      )}

      <div className="space-y-5">
        {/* Watering frequency */}
        <fieldset className="rounded-2xl border border-[#DCE2DA] bg-white p-5 dark:border-[#243028] dark:bg-[#151D17]">
          <legend className="px-1 text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            1. How often do you water this plant?
          </legend>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {wateringOptions.map((opt) => {
              const active = careAnswers.wateringFrequency === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChangeCareAnswers({ ...careAnswers, wateringFrequency: opt.value })
                  }
                  aria-pressed={active}
                  className={`flex min-h-[44px] items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                    active
                      ? 'border-[#1E6B45] bg-[#E8F3EC] font-semibold text-[#144D31] dark:border-[#49B67D] dark:bg-[#152B1E] dark:text-[#A7E8C2]'
                      : 'border-[#DCE2DA] bg-[#FAFBF9] font-medium text-[#28362D] hover:bg-[#EFF3EC] dark:border-[#253229] dark:bg-[#111813] dark:text-[#CED9D1] dark:hover:bg-[#1B261E]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Sunlight */}
        <fieldset className="rounded-2xl border border-[#DCE2DA] bg-white p-5 dark:border-[#243028] dark:bg-[#151D17]">
          <legend className="px-1 text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            2. How much sunlight does it get?
          </legend>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {sunlightOptions.map((opt) => {
              const active = careAnswers.sunlight === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeCareAnswers({ ...careAnswers, sunlight: opt.value })}
                  aria-pressed={active}
                  className={`flex min-h-[44px] items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                    active
                      ? 'border-[#1E6B45] bg-[#E8F3EC] font-semibold text-[#144D31] dark:border-[#49B67D] dark:bg-[#152B1E] dark:text-[#A7E8C2]'
                      : 'border-[#DCE2DA] bg-[#FAFBF9] font-medium text-[#28362D] hover:bg-[#EFF3EC] dark:border-[#253229] dark:bg-[#111813] dark:text-[#CED9D1] dark:hover:bg-[#1B261E]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Pot drainage */}
        <fieldset className="rounded-2xl border border-[#DCE2DA] bg-white p-5 dark:border-[#243028] dark:bg-[#151D17]">
          <legend className="px-1 text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            3. Does the pot have drainage holes?
          </legend>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {drainageOptions.map((opt) => {
              const active = careAnswers.potDrainage === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeCareAnswers({ ...careAnswers, potDrainage: opt.value })}
                  aria-pressed={active}
                  className={`flex min-h-[44px] items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                    active
                      ? 'border-[#1E6B45] bg-[#E8F3EC] font-semibold text-[#144D31] dark:border-[#49B67D] dark:bg-[#152B1E] dark:text-[#A7E8C2]'
                      : 'border-[#DCE2DA] bg-[#FAFBF9] font-medium text-[#28362D] hover:bg-[#EFF3EC] dark:border-[#253229] dark:bg-[#111813] dark:text-[#CED9D1] dark:hover:bg-[#1B261E]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Last fertilised */}
        <fieldset className="rounded-2xl border border-[#DCE2DA] bg-white p-5 dark:border-[#243028] dark:bg-[#151D17]">
          <legend className="px-1 text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            4. When was it last fertilised or given compost?
          </legend>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {fertilisedOptions.map((opt) => {
              const active = careAnswers.lastFertilised === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChangeCareAnswers({ ...careAnswers, lastFertilised: opt.value })
                  }
                  aria-pressed={active}
                  className={`flex min-h-[44px] items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                    active
                      ? 'border-[#1E6B45] bg-[#E8F3EC] font-semibold text-[#144D31] dark:border-[#49B67D] dark:bg-[#152B1E] dark:text-[#A7E8C2]'
                      : 'border-[#DCE2DA] bg-[#FAFBF9] font-medium text-[#28362D] hover:bg-[#EFF3EC] dark:border-[#253229] dark:bg-[#111813] dark:text-[#CED9D1] dark:hover:bg-[#1B261E]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={handleAnalyse}
          disabled={isAnalysing}
          aria-busy={isAnalysing}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E6B45] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#165435] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] focus-visible:ring-offset-2 dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
        >
          {isAnalysing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span>{t.scanAnalysing}</span>
            </>
          ) : (
            <span>{t.careAnalyseButton}</span>
          )}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          disabled={isAnalysing}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-[#CBD4C8] bg-white px-5 py-3 text-sm font-semibold text-[#233328] transition-colors hover:bg-[#EFF3EC] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2D3B32] dark:bg-[#17211B] dark:text-[#DCE6DF] dark:hover:bg-[#202D25]"
        >
          {t.careSkipButton}
        </button>
      </div>
    </div>
  );
}
