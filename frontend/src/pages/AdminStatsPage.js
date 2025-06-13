import React, { useState, useEffect } from "react";
import statsService from "../services/statsService";
// import './AdminStatsPage.css'; // Will create later

const AdminStatsPage = () => {
  const [stats, setStats] = useState({ routeStats: [], customerRanking: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    statsService
      .getStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        setError("Failed to load statistics.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="admin-stats-page">
      <h1>관리자 통계</h1>
      {isLoading ? (
        <p>Loading statistics...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <h2>Route Statistics (CUBE Results)</h2>
          <pre>{JSON.stringify(stats.routeStats, null, 2)}</pre>
          <hr />
          <h2>Customer Spending Ranking</h2>
          <pre>{JSON.stringify(stats.customerRanking, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AdminStatsPage;
