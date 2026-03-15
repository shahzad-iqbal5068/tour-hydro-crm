"use client";

type GroupDashboardTabsProps = {
  tabs: readonly { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
};

export default function GroupDashboardTabs({
  tabs,
  activeTab,
  onTabChange,
}: GroupDashboardTabsProps) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
