import Navbar from "../components/common/Navbar";
import Spinner from "../components/common/Spinner";
import AnalyticsCard from "../components/links/AnalyticsCard";
import useAnalytics from "../hooks/useAnalytics";
import { Link, useParams } from "react-router-dom";

export default function AnalyticsPage() {

  const { id } = useParams<{ id: string }>();
  const { analytics, isLoading } = useAnalytics(id || "");

  return (
    <>
    <Navbar />
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Spinner />
        </div>
      ) : analytics ? (
        <>
          <section className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Analytics
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Link performance
                </h2>
              </div>

              <Link
                to="/dashboard"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                <span aria-hidden="true">←</span>
                Back to Dashboard
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Total Clicks
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {analytics.totalClicks}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Today&apos;s Clicks
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {analytics.todayClicks}
                </p>
              </div>
            </div>
          </section>

          {analytics.lastClicked && (
            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6">
              <div className="border-b border-slate-200 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Last Activity
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                  Last Clicked
                </h3>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Browser
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {analytics.lastClicked.browser}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    OS
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {analytics.lastClicked.os}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    IP
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {analytics.lastClicked.ipAddress}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Time
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {new Date(analytics.lastClicked.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6">
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Recent Clicks
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                Table
              </h3>
            </div>
            <div className="mt-5">
          <AnalyticsCard recentClicks={analytics.recentClicks} />
            </div>
          </section>
        </>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-sm text-slate-600 shadow-sm">
          No analytics data available.
        </div>
      )}
      </div>
    </div>

    </>
  );
}
