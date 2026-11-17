import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SavedScan } from '../types/leafcheck';

interface ScansChartProps {
  scans: SavedScan[];
}

interface WeekBucket {
  key: string;
  label: string;
  count: number;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function ScansChart({ scans }: ScansChartProps) {
  const data = useMemo<WeekBucket[]>(() => {
    const now = new Date();
    const currentWeekStart = getWeekStart(now);
    const buckets: WeekBucket[] = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() - i * 7);
      const key = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
      buckets.push({
        key,
        label: i === 0 ? 'This wk' : formatWeekLabel(start),
        count: 0,
      });
    }

    const bucketMap = new Map(buckets.map((b) => [b.key, b]));

    for (const scan of scans) {
      const created = new Date(scan.createdAt);
      if (Number.isNaN(created.getTime())) continue;
      const wk = getWeekStart(created);
      const key = `${wk.getFullYear()}-${wk.getMonth()}-${wk.getDate()}`;
      const bucket = bucketMap.get(key);
      if (bucket) {
        bucket.count += 1;
      }
    }

    return buckets;
  }, [scans]);

  return (
    <div
      className="rounded-2xl border border-[#DCE2DA] bg-white p-5 dark:border-[#243028] dark:bg-[#151D17]"
      aria-label="Scans per week chart"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-[#17211A] dark:text-[#ECF2ED]">
            Scans per week
          </h2>
          <p className="text-xs text-[#57675C] dark:text-[#98A89D]">
            Weekly activity across the last 6 weeks
          </p>
        </div>
        <span className="text-sm font-semibold tabular-nums text-[#1E6B45] dark:text-[#6AD199]">
          {scans.length} {scans.length === 1 ? 'total scan' : 'total scans'}
        </span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(110, 128, 114, 0.22)"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: '#637368', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#637368', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(30, 107, 69, 0.08)' }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #CBD6C8',
                backgroundColor: '#FFFFFF',
                color: '#17211A',
                fontSize: '12px',
              }}
              formatter={(value: unknown) => [`${value ?? 0}`, 'Scans']}
            />
            <Bar
              dataKey="count"
              fill="#287B50"
              radius={[8, 8, 0, 0]}
              maxBarSize={44}
              name="Scans"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
