import Navbar from "../components/common/Navbar";
import Spinner from "../components/common/Spinner";
import AnalyticsCard from "../components/links/AnalyticsCard";
import useAnalytics from "../hooks/useAnalytics";
import { useParams } from "react-router-dom";

export default function AnalyticsPage() {

  const { id } = useParams<{ id: string }>();
  const { analytics, isLoading } = useAnalytics(id || "");

  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {isLoading ? (
        <Spinner />
      ) : analytics ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <p>Total Clicks: {analytics.totalClicks}</p>
          <p>Today's Clicks: {analytics.todayClicks}</p>
          {analytics.lastClicked && (
            <div>
              <h3 className="text-xl font-semibold mt-4">Last Clicked</h3>
              <p>{analytics.lastClicked.browser}</p>
              <p>{analytics.lastClicked.os}</p>
              <p>{analytics.lastClicked.ipAddress}</p>
              <p>{new Date(analytics.lastClicked.createdAt).toLocaleString()}</p>
            </div>
          )}
          <AnalyticsCard recentClicks={analytics.recentClicks} />
        </div>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>

    </>
  );
}
