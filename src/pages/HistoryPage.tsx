import { AlertCircle, Camera, Filter, Leaf, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ScansChart } from '../components/ScansChart';
import { getPlantName, PLANTS } from '../data/plants';
import { TranslationStrings } from '../i18n/translations';
import { SavedScan } from '../types/leafcheck';
import { getConfidenceTier } from '../utils/storage';

type ResultFilter = 'all' | 'healthy' | 'issue' | 'not_sure';

interface HistoryPageProps {
  scans: SavedScan[];
  storageAvailable: boolean;
  onSelectScan: (scan: SavedScan) => void;
  onDeleteScan: (id: string) => void;
  onClearAll: () => void;
  onNavigateScan: () => void;
  t: TranslationStrings;
}

export function HistoryPage({
  scans,
  storageAvailable,
  onSelectScan,
  onDeleteScan,
  onClearAll,
  onNavigateScan,
  t,
}: HistoryPageProps) {
  const [plantFilter, setPlantFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      if (plantFilter !== 'all' && scan.plant !== plantFilter) {
        return false;
      }

      const isUncertain =
        scan.isNotLeaf || scan.plantMatchesSelection === false || scan.confidence < 50;
      const isHealthy = !isUncertain && scan.adviceKey === 'healthy';

      if (resultFilter === 'not_sure' && !isUncertain) return false;
      if (resultFilter === 'healthy' && !isHealthy) return false;
      if (resultFilter === 'issue' && (isUncertain || isHealthy)) return false;

      return true;
    });
  }, [scans, plantFilter, resultFilter]);

  const formatConfidenceText = (confidence: number) => {
    const tier = getConfidenceTier(confidence);
    if (tier === 'high') return `${t.confidenceHigh} (${confidence}%)`;
    if (tier === 'medium') return `${t.confidenceMedium} (${confidence}%)`;
    return `${t.confidenceLow} (${confidence}%)`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#17211A] sm:text-3xl dark:text-[#ECF2ED]">
            {t.historyTitle}
          </h1>
          <p className="text-sm text-[#57675C] dark:text-[#98A89D]">
            Saved locally on this device · No account needed
          </p>
        </div>

        {scans.length > 0 && (
          <div className="flex items-center gap-2">
            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#E5C6C0] bg-white px-4 py-2 text-sm font-semibold text-[#8A2B1D] transition-colors hover:bg-[#FDF0ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A2B1D] dark:border-[#4F2620] dark:bg-[#17211B] dark:text-[#F09A8E] dark:hover:bg-[#2B1714]"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span>{t.historyClearAll}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-[#E5C6C0] bg-[#FDF0ED] p-1.5 dark:border-[#5D2A22] dark:bg-[#291411]">
                <span className="px-2 text-xs font-semibold text-[#7A271B] dark:text-[#F4B4AA]">
                  Delete all scans?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="min-h-[36px] rounded-lg bg-[#9E3020] px-3 text-xs font-semibold text-white hover:bg-[#7D2417] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E3020]"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="min-h-[36px] rounded-lg bg-white px-3 text-xs font-semibold text-[#28362D] hover:bg-[#EFF3EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:bg-[#17211B] dark:text-[#ECF2ED]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!storageAvailable && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-[#D9CEAD] bg-[#FBF7EB] p-4 text-sm text-[#4A3B16] dark:border-[#4A3F20] dark:bg-[#221D11] dark:text-[#F0DFB3]"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            Browser storage is currently unavailable in this session, so scans are kept only until
            you close or refresh the page.
          </p>
        </div>
      )}

      {scans.length === 0 ? (
        <div className="rounded-3xl border border-[#DCE2DA] bg-white p-10 text-center dark:border-[#243028] dark:bg-[#151D17]">
          <Leaf
            className="mx-auto h-10 w-10 text-[#3B6A4D] dark:text-[#7FD3A3]"
            aria-hidden="true"
          />
          <h2 className="mt-3 font-display text-xl font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            {t.historyEmptyTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#57675C] dark:text-[#98A89D]">
            When you scan a leaf and save the screening result, your photo thumbnail, confidence,
            and care notes appear here.
          </p>
          <button
            type="button"
            onClick={onNavigateScan}
            className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#1E6B45] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#165435] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:bg-[#2F8A5B] dark:hover:bg-[#389E6A]"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            <span>{t.ctaScanLeaf}</span>
          </button>
        </div>
      ) : (
        <>
          <ScansChart scans={scans} />

          {/* Filters */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#DCE2DA] bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#243028] dark:bg-[#151D17]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#17211A] dark:text-[#ECF2ED]">
              <Filter className="h-4 w-4 text-[#1E6B45] dark:text-[#6AD199]" aria-hidden="true" />
              <span>Filter scans</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 text-sm">
                <span className="text-xs font-medium text-[#57675C] dark:text-[#98A89D]">
                  Plant
                </span>
                <select
                  value={plantFilter}
                  onChange={(e) => setPlantFilter(e.target.value)}
                  className="min-h-[44px] rounded-xl border border-[#CBD4C8] bg-[#FAFBF9] px-3 py-2 text-sm text-[#17211A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2B382F] dark:bg-[#111813] dark:text-[#ECF2ED]"
                >
                  <option value="all">All plants</option>
                  {PLANTS.map((plant) => (
                    <option key={plant.id} value={plant.id}>
                      {plant.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <span className="text-xs font-medium text-[#57675C] dark:text-[#98A89D]">
                  Result
                </span>
                <select
                  value={resultFilter}
                  onChange={(e) => setResultFilter(e.target.value as ResultFilter)}
                  className="min-h-[44px] rounded-xl border border-[#CBD4C8] bg-[#FAFBF9] px-3 py-2 text-sm text-[#17211A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2B382F] dark:bg-[#111813] dark:text-[#ECF2ED]"
                >
                  <option value="all">All results</option>
                  <option value="healthy">Healthy</option>
                  <option value="issue">Possible issue</option>
                  <option value="not_sure">Not sure</option>
                </select>
              </label>
            </div>
          </div>

          {/* Filtered list or empty filter message */}
          {filteredScans.length === 0 ? (
            <div className="rounded-2xl border border-[#DCE2DA] bg-white p-8 text-center dark:border-[#243028] dark:bg-[#151D17]">
              <p className="text-base font-semibold text-[#17211A] dark:text-[#ECF2ED]">
                No scans match these filters
              </p>
              <button
                type="button"
                onClick={() => {
                  setPlantFilter('all');
                  setResultFilter('all');
                }}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-xl border border-[#CBD4C8] bg-white px-4 py-2 text-sm font-semibold text-[#233328] hover:bg-[#EFF3EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:border-[#2D3B32] dark:bg-[#17211B] dark:text-[#DCE6DF]"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredScans.map((scan) => {
                const isUncertain =
                  scan.isNotLeaf || scan.plantMatchesSelection === false || scan.confidence < 50;
                const isHealthy = !isUncertain && scan.adviceKey === 'healthy';
                const displayResult = isUncertain
                  ? t.resultNotSureTitle
                  : isHealthy
                    ? 'Likely healthy'
                    : `Likely: ${scan.label}`;

                const dateLabel = new Date(scan.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <article
                    key={scan.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#DCE2DA] bg-white transition-shadow hover:shadow-sm dark:border-[#243028] dark:bg-[#151D17]"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectScan(scan)}
                      className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E6B45]"
                    >
                      <div className="h-40 w-full overflow-hidden bg-[#EDF2EA] dark:bg-[#1B261E]">
                        {scan.thumbnailDataUrl ? (
                          <img
                            src={scan.thumbnailDataUrl}
                            alt={`${getPlantName(scan.plant)} scanned leaf`}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#526E5B] dark:text-[#8FB99D]">
                            <Leaf className="h-8 w-8" aria-hidden="true" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2 p-4">
                        <p className="text-xs text-[#57675C] dark:text-[#98A89D]">
                          {getPlantName(scan.plant)} · {dateLabel}
                        </p>
                        <h3 className="font-display text-lg font-semibold text-[#17211A] dark:text-[#ECF2ED]">
                          {displayResult}
                        </h3>
                        <p className="text-xs font-semibold tabular-nums text-[#2A5E42] dark:text-[#7FD3A3]">
                          Confidence: {formatConfidenceText(scan.confidence)}
                        </p>
                        {typeof scan.helpful === 'boolean' && (
                          <p className="text-xs text-[#57675C] dark:text-[#98A89D]">
                            Marked helpful: {scan.helpful ? t.resultYes : t.resultNo}
                          </p>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center justify-between border-t border-[#EAEFEA] px-4 py-2 dark:border-[#212B24]">
                      <button
                        type="button"
                        onClick={() => onSelectScan(scan)}
                        className="min-h-[44px] px-1 text-xs font-semibold text-[#1E6B45] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B45] dark:text-[#7FD3A3]"
                      >
                        View details
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteScan(scan.id)}
                        aria-label={`Delete ${getPlantName(scan.plant)} scan from ${dateLabel}`}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#8A2B1D] hover:bg-[#FDF0ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A2B1D] dark:text-[#F09A8E] dark:hover:bg-[#2B1714]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
