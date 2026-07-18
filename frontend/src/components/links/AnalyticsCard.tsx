import type {ClickDTO} from "../../types/analytics";

const AnalyticsCard = ({ recentClicks }: { recentClicks: ClickDTO[] }) => {
  return (
    recentClicks.length > 0 ? (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Browser</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">OS</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">IP</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {recentClicks.map((click: ClickDTO) => (
                <tr key={click.createdAt} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-800">{click.browser || "N/A"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{click.os || "N/A"}</td>
                  <td className="max-w-60 truncate px-4 py-4 text-sm text-slate-700">{click.ipAddress || "N/A"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{new Date(click.createdAt).toLocaleString() || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
        No recent clicks available.
      </div>
    )
  );
};

export default AnalyticsCard;