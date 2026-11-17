import { ShieldAlert } from 'lucide-react';

export function SafetyBanner() {
  return (
    <div
      role="note"
      aria-label="Screening notice"
      className="flex items-start gap-3 rounded-2xl border border-[#D9CEAD] bg-[#FBF7EB] p-4 text-sm text-[#4A3B16] dark:border-[#4A3F20] dark:bg-[#221D11] dark:text-[#F0DFB3]"
    >
      <ShieldAlert
        className="mt-0.5 h-5 w-5 shrink-0 text-[#8B6817] dark:text-[#E5C16C]"
        aria-hidden="true"
      />
      <p className="leading-relaxed font-medium">
        This is a screening aid, not a diagnosis. Consult your local agriculture officer or nursery
        expert before treating.
      </p>
    </div>
  );
}
