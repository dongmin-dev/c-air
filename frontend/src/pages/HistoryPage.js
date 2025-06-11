import React, { useState, useEffect } from "react";
import historyService from "../services/historyService";
// We will create and import these CSS and components in the next steps
// import './HistoryPage.css';

const HistoryPage = () => {
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-05-01", // Default start date
    endDate: "2025-06-30", // Default end date
  });
  const [history, setHistory] = useState({ bookings: [], cancellations: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get the logged-in user when the component loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch history when the user or date range changes
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError("");
      historyService
        .getHistory(user.cno, dateRange)
        .then((data) => {
          setHistory(data);
        })
        .catch((err) => {
          setError("Failed to load history.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, dateRange]);

  // For now, let's just add a title to show the page is rendering
  return (
    <div className="history-page">
      <h1>예약/취소 내역</h1>
      {/* We will add the date range picker and history lists here */}
      {isLoading && <p>Loading history...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>Bookings:</h3>
      <pre>{JSON.stringify(history.bookings, null, 2)}</pre>
      <h3>Cancellations:</h3>
      <pre>{JSON.stringify(history.cancellations, null, 2)}</pre>
    </div>
  );
};

export default HistoryPage;
