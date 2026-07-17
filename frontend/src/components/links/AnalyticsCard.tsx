import type {ClickDTO} from "../../types/analytics";

const AnalyticsCard = ({ recentClicks }: { recentClicks: ClickDTO[] }) => {
  return (
    recentClicks.length > 0 ? (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Recent Clicks</h2>
        {recentClicks.map((click: ClickDTO) => (
          <div key={click.createdAt} className="border-b py-2">
            <p><strong>Browser:</strong> {click.browser || "N/A"}</p>
            <p><strong>OS:</strong> {click.os || "N/A"}</p>
            <p><strong>IP Address:</strong> {click.ipAddress || "N/A"}</p>
            <p><strong>Created At:</strong> { new Date(click.createdAt).toLocaleString() || "N/A"}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No recent clicks available.</p>
    )
  );
};

export default AnalyticsCard;