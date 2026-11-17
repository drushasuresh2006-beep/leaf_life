import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { TranslationStrings } from '../i18n/translations';
import { getConfidenceTier } from '../utils/storage';

interface ConfidenceMeterProps {
  confidence: number;
  t: TranslationStrings;
}

export function ConfidenceMeter({ confidence, t }: ConfidenceMeterProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(confidence)));
  const tier = getConfidenceTier(clamped);

  const tierConfig = {
    high: {
      label: t.confidenceHigh,
      Icon: CheckCircle2,
      barClass: 'bg-[#1E6B45] dark:bg-[#49B67D]',
      badgeClass:
        'border-[#B9DEC8] bg-[#E8F5ED] text-[#144E32] dark:border-[#26543B] dark:bg-[#13291D] dark:text-[#8BE0B0]',
      rangeHint: '80% or higher',
    },
    medium: {
      label: t.confidenceMedium,
      Icon: AlertCircle,
      barClass: 'bg-[#B37412] dark:bg-[#E0A13B]',
      badgeClass:
        'border-[#E5CFA2] bg-[#FCF4E3] text-[#6D4608] dark:border-[#523C16] dark:bg-[#261D0D] dark:text-[#F2CB85]',
      rangeHint: '50%–79%',
    },
    low: {
      label: t.confidenceLow,
      Icon: HelpCircle,
      barClass: 'bg-[#B44332] dark:bg-[#E07160]',
      badgeClass:
        'border-[#E6BFB8] bg-[#FCECE9] text-[#7A271B] dark:border-[#59261F] dark:bg-[#291310] dark:text-[#F2A69B]',
      rangeHint: 'Below 50%',
    },
  }[tier];

  const Icon = tierConfig.Icon;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${tierConfig.badgeClass}`}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            {tierConfig.label} confidence ({tierConfig.rangeHint})
          </span>
        </div>
        <span className="text-base font-bold tabular-nums text-[#17211A] dark:text-[#ECF2ED]">
          {clamped}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Confidence ${clamped} percent, ${tierConfig.label}`}
        className="h-3 w-full overflow-hidden rounded-full bg-[#E3E8E0] dark:bg-[#232E27]"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${tierConfig.barClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
