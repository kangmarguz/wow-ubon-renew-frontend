import { adminPlaceTabs } from "../lib/adminPlaces";

export function AdminPlacesTabs({ activeTab, tabCounts, onTabChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {adminPlaceTabs.map((tab) => {
        const isActiveTab = activeTab === tab.key;
        const count = tabCounts[tab.key] || 0;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
              isActiveTab
                ? "border-[#3f3328] bg-[#3f3328] text-white shadow-[0_10px_18px_rgba(63,51,40,0.14)]"
                : "border-[#dacbbc] bg-white/82 text-[#5f5145] hover:border-[#b79c82] hover:bg-white"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isActiveTab ? "bg-white/18 text-white" : "bg-[#f3e7da] text-[#816a57]"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
