import {
  AlertCircle,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { getPlantsForMode, SAMPLE_LEAF_ASSETS } from '../data/plants';
import { TranslationStrings } from '../i18n/translations';
import { AppMode, PlantId } from '../types/leafcheck';

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

export interface SelectedLeafImage {
  previewUrl: string;
  source: File | string;
  fileName: string;
  fileSizeLabel?: string;
}

interface ScanPageProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  selectedPlant: PlantId;
  onSelectPlant: (plant: PlantId) => void;
  selectedImage: SelectedLeafImage | null;
  onImageSelected: (img: SelectedLeafImage | null) => void;
  onProceedToCare: () => void;
  onAnalyseNow: () => Promise<void>;
  isAnalysing: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  t: TranslationStrings;
}

export function ScanPage({
  mode,
  onModeChange,
  selectedPlant,
  onSelectPlant,
  selectedImage,
  onImageSelected,
  onProceedToCare,
  onAnalyseNow,
  isAnalysing,
  errorMessage,
  onClearError,
  t,
}: ScanPageProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const plants = getPlantsForMode(mode);
  const activeError = localError || errorMessage;

  const photoTips = [
    'One single leaf in the shot',
    'Bright, indirect natural light',
    'Plain, uncluttered background',
    'Leaf veins and spots in sharp focus',
    'Leaf fills most of the frame',
  ];

  const handleFileValidation = (file: File | undefined) => {
    setLocalError(null);
    onClearError();
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLocalError(
        'That file does not look like an image. Please choose a JPG, PNG, or WebP photo of a leaf.'
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setLocalError(
        `This photo is ${sizeMb} MB, which is over the 8 MB limit. Please choose a smaller photo or take a closer shot.`
      );
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const sizeLabel =
      file.size < 1024 * 1024
        ? `${Math.max(1, Math.round(file.size / 1024))} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    onImageSelected({
      previewUrl: objectUrl,
      source: file,
      fileName: file.name,
      fileSizeLabel: sizeLabel,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileValidation(file);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileValidation(file);
  };

  const handleRemoveImage = () => {
    setLocalError(null);
    onClearError();
    if (selectedImage && selectedImage.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    onImageSelected(null);
  };

  const handleUseSample = (sampleId: string) => {
    setLocalError(null);
    onClearError();
    const sample = SAMPLE_LEAF_ASSETS.find((item) => item.id === sampleId);
    if (!sample) return;

    if (mode !== sample.mode) {
      onModeChange(sample.mode);
    }
    onSelectPlant(sample.plantId);
    onImageSelected({
      previewUrl: sample.imageUrl,
      source: sample.imageUrl,
      fileName: `${sample.label}.jpg`,
      fileSizeLabel: 'Sample photo',
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold text-[#17211A] sm:text-3xl dark:text-[#ECF2ED]">
          {t.scanTitle}
        </h1>
        <p className="text-sm text-[#4F5F54] dark:text-[#A4B3A9]">
          Select where the plant grows, pick the plant type, and add one clear leaf photo.
        </p>
      </div>

      {activeError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5BBB3] bg-[#FDF0ED] p-4 text-sm text-[#7A271B] dark:border-[#5D2A22] dark:bg-[#291411] dark:text-[#F4B4AA]"
        >
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="font-medium">{activeError}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {errorMessage && !localError && selectedImage && (
              <button
                type="button"
                onClick={onAnalyseNow}
                disabled={isAnalysing}
                className="min-h-[40px] rounded-xl bg-[#8A2B1D] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#6E2116] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A2B1D]"
              >
                {isAnalysing ? t.scanAnalysing : 'Retry'}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setLocalError(null);
                onClearError();
              }}
              className="min-h-[40px] rounded-lg px-2 text-xs font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A271B]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left column: Mode + Plant selector + Photo tips */}
        <div className="space-y-6 lg:col-span-5">
          {/* Mode toggle */}
          <fieldset className="rounded-2xl border border-[#DCE2DA] bg-white p-5 dark:border-[#243028] dark:bg-[#151D17]">
            <legend className="px-1 text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
              Growing setting
            </legend>
            <p className="mt-1 mb-3 text-xs text-[#57675C] dark:text-[#98A89D]">
              Home mode includes optional pot-care questions.
            </p>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#EDF1EB] p-1 dark:bg-[#0F1511]">
              <button
                type="button"
                onClick={() => onModeChange('home')}
                aria-pressed={mode === 'home'}
                className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                  mode === 'home'
                    ? 'bg-[#1E6B45] text-white shadow-sm dark:bg-[#2F8A5B]'
                    : 'text-[#425247] hover:text-[#17211A] dark:text-[#A4B4A9] dark:hover:text-[#ECF2ED]'
                }`}
              >
                {t.scanModeHome}
              </button>
              <button
                type="button"
                onClick={() => onModeChange('field')}
                aria-pressed={mode === 'field'}
                className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                  mode === 'field'
                    ? 'bg-[#1E6B45] text-white shadow-sm dark:bg-[#2F8A5B]'
                    : 'text-[#425247] hover:text-[#17211A] dark:text-[#A4B4A9] dark:hover:text-[#ECF2ED]'
                }`}
              >
                {t.scanModeField}
              </button>
            </div>
          </fieldset>

          {/* Plant selector */}
          <fieldset className="rounded-2xl border border-[#DCE2DA] bg-white p-5 dark:border-[#243028] dark:bg-[#151D17]">
            <legend className="px-1 text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
              {t.scanSelectPlant}
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
              {plants.map((plant) => {
                const active = selectedPlant === plant.id;
                return (
                  <button
                    key={plant.id}
                    type="button"
                    onClick={() => onSelectPlant(plant.id)}
                    aria-pressed={active}
                    className={`flex min-h-[44px] items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] ${
                      active
                        ? 'border-[#1E6B45] bg-[#E8F3EC] text-[#144D31] font-semibold dark:border-[#49B67D] dark:bg-[#152B1E] dark:text-[#A7E8C2]'
                        : 'border-[#DCE2DA] bg-[#FAFBF9] text-[#28362D] hover:bg-[#EFF3EC] dark:border-[#253229] dark:bg-[#111813] dark:text-[#CED9D1] dark:hover:bg-[#1B261E]'
                    }`}
                  >
                    <span className="truncate">{plant.name}</span>
                    {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Photo tips */}
          <section
            aria-labelledby="photo-tips-heading"
            className="rounded-2xl border border-[#DCE2DA] bg-white p-5 dark:border-[#243028] dark:bg-[#151D17]"
          >
            <h2
              id="photo-tips-heading"
              className="text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]"
            >
              Photo tips for clearer screening
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[#49594E] dark:text-[#A8B7AD]">
              {photoTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A5E42] dark:bg-[#6AD199]"
                    aria-hidden="true"
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right column: Upload / Camera / Preview / Analyse */}
        <div className="space-y-5 lg:col-span-7">
          <div className="rounded-2xl border border-[#DCE2DA] bg-white p-5 sm:p-6 dark:border-[#243028] dark:bg-[#151D17]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[#17211A] dark:text-[#ECF2ED]">
                {t.scanUploadLabel}
              </h2>
              <span className="text-xs text-[#57675C] dark:text-[#98A89D]">
                Images only · Max 8 MB
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="sr-only"
              aria-label="Choose a leaf image from your device"
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
              className="sr-only"
              aria-label="Take a leaf photo with rear camera"
            />

            {!selectedImage ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
                  isDragging
                    ? 'border-[#1E6B45] bg-[#E8F3EC] dark:border-[#58B983] dark:bg-[#152B1E]'
                    : 'border-[#C7D1C4] bg-[#F9FAF7] dark:border-[#2D3B32] dark:bg-[#111813]'
                }`}
              >
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4EDE1] text-[#1E6B45] dark:bg-[#1B2B21] dark:text-[#7FD3A3]"
                  aria-hidden="true"
                >
                  <ImagePlus className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
                  Drag and drop a leaf photo here
                </p>
                <p className="mt-1 text-xs text-[#57675C] dark:text-[#98A89D]">
                  Photos stay on your device during this demo.
                </p>

                <div className="mt-5 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E6B45] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#165435] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
                  >
                    <Camera className="h-4 w-4" aria-hidden="true" />
                    <span>Take photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#CBD4C8] bg-white px-4 py-2.5 text-sm font-semibold text-[#17211A] transition-colors hover:bg-[#EFF3EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2D3B32] dark:bg-[#17211B] dark:text-[#ECF2ED] dark:hover:bg-[#202D25]"
                  >
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span>Upload file</span>
                  </button>
                </div>

                {/* Built-in sample leaf photos */}
                <div className="mt-6 w-full border-t border-[#E2E7DF] pt-4 dark:border-[#232E27]">
                  <p className="mb-2.5 text-xs font-medium text-[#57675C] dark:text-[#98A89D]">
                    Or try a sample photo
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SAMPLE_LEAF_ASSETS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleUseSample(sample.id)}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#D4DDD1] bg-white px-3 py-2 text-xs font-medium text-[#28362D] transition-colors hover:bg-[#EDF3EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2B382F] dark:bg-[#161F19] dark:text-[#D1DDD5] dark:hover:bg-[#1F2C24]"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#1E6B45] dark:text-[#6AD199]" aria-hidden="true" />
                        <span>{sample.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-[#DCE2DA] bg-[#EEF2EC] dark:border-[#243028] dark:bg-[#0F1511]">
                  <img
                    src={selectedImage.previewUrl}
                    alt={`Selected ${selectedPlant.replace('_', ' ')} leaf preview`}
                    referrerPolicy="no-referrer"
                    className="max-h-[340px] w-full object-contain"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#17211A] dark:text-[#ECF2ED]">
                      {selectedImage.fileName}
                    </p>
                    {selectedImage.fileSizeLabel && (
                      <p className="text-xs text-[#57675C] dark:text-[#98A89D]">
                        {selectedImage.fileSizeLabel}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={isAnalysing}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#CBD4C8] bg-white px-3.5 py-2 text-xs font-semibold text-[#233328] transition-colors hover:bg-[#EFF3EC] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2D3B32] dark:bg-[#17211B] dark:text-[#DCE6DF] dark:hover:bg-[#202D25]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Retake</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isAnalysing}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#E5C6C0] bg-white px-3.5 py-2 text-xs font-semibold text-[#8A2B1D] transition-colors hover:bg-[#FDF0ED] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A2B1D] dark:border-[#4F2620] dark:bg-[#17211B] dark:text-[#F09A8E] dark:hover:bg-[#2B1714]"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Analyse / Care step buttons */}
            <div className="mt-6 border-t border-[#E6EBE4] pt-5 dark:border-[#232E27]">
              {mode === 'home' ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={!selectedImage || isAnalysing}
                    onClick={onProceedToCare}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E6B45] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#165435] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] focus-visible:ring-offset-2 dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
                  >
                    <span>Next: Care check (optional)</span>
                  </button>

                  <button
                    type="button"
                    disabled={!selectedImage || isAnalysing}
                    onClick={onAnalyseNow}
                    aria-busy={isAnalysing}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#CBD4C8] bg-white px-5 py-3 text-sm font-semibold text-[#17211A] transition-colors hover:bg-[#EFF3EC] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2D3B32] dark:bg-[#17211B] dark:text-[#ECF2ED] dark:hover:bg-[#202D25]"
                  >
                    {isAnalysing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>{t.scanAnalysing}</span>
                      </>
                    ) : (
                      <span>{t.scanAnalyseButton}</span>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!selectedImage || isAnalysing}
                  onClick={onAnalyseNow}
                  aria-busy={isAnalysing}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1E6B45] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#165435] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] focus-visible:ring-offset-2 dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
                >
                  {isAnalysing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      <span>{t.scanAnalysing}</span>
                    </>
                  ) : (
                    <span>{t.scanAnalyseButton}</span>
                  )}
                </button>
              )}

              {!selectedImage && (
                <p className="mt-2.5 text-center text-xs text-[#57675C] dark:text-[#98A89D]">
                  Upload, snap, or select a sample leaf photo above to continue.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
