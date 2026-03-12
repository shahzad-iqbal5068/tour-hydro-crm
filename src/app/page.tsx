import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Hydro CRM",
  description: "Overview of tourist cruise sales, inquiries and WhatsApp leads.",
};
const dummyPackages = [
  { name: "Dow Cruise Trip N", key: "dow-cruise-tripn", color: "bg-sky-500" },
  { name: "Cruise Express", key: "cruise-express", color: "bg-indigo-500" },
  { name: "Fun and Fun", key: "fun-and-fun", color: "bg-emerald-500" },
  { name: "Yacht & Cruise", key: "yacht-cruise", color: "bg-amber-500" },
  { name: "Blue World", key: "blue-world", color: "bg-fuchsia-500" },
];

const dailyData = [8, 5, 12, 9, 6];
const weeklyData = [42, 35, 58, 50, 31];
const monthlyData = [180, 140, 220, 190, 130];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Hydro CRM overview
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Dummy sales metrics for tourist cruises. Later you can replace this
            with real API data.
          </p>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial sm:flex-none">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 sm:min-w-0 sm:flex-initial">
            <span>🔍</span>
            <input
              placeholder="Search clients, packages..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 sm:w-40"
            />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
            Today&apos;s inquiries
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            32
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            +12% vs yesterday
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
            Weekly bookings
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            216
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            +8% vs last week
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
            Monthly revenue
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            48,200 AED
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Approximate, based on package mix
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
            Active WhatsApp leads
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            87
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Across all cruise packages
          </p>
        </div>
      </div>

      {/* Package performance charts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Daily */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Today by package
          </p>
          <div className="flex items-end gap-2">
            {dailyData.map((value, idx) => (
              <div key={dummyPackages[idx].key} className="flex-1">
                <div className="flex h-24 items-end">
                  <div
                    className={`${dummyPackages[idx].color} w-full rounded-t-md`}
                    style={{ height: `${(value / 14) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
                  {value}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-zinc-400 dark:text-zinc-500">
                  {dummyPackages[idx].name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            This week by package
          </p>
          <div className="flex items-end gap-2">
            {weeklyData.map((value, idx) => (
              <div key={dummyPackages[idx].key} className="flex-1">
                <div className="flex h-24 items-end">
                  <div
                    className={`${dummyPackages[idx].color} w-full rounded-t-md`}
                    style={{ height: `${(value / 70) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
                  {value}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-zinc-400 dark:text-zinc-500">
                  {dummyPackages[idx].name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            This month by package
          </p>
          <div className="flex items-end gap-2">
            {monthlyData.map((value, idx) => (
              <div key={dummyPackages[idx].key} className="flex-1">
                <div className="flex h-24 items-end">
                  <div
                    className={`${dummyPackages[idx].color} w-full rounded-t-md`}
                    style={{ height: `${(value / 260) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
                  {value}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-zinc-400 dark:text-zinc-500">
                  {dummyPackages[idx].name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
