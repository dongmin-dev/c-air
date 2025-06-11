import React, { useState, useEffect } from "react";
import historyService from "../services/historyService";
import HistoryCard from "../components/HistoryCard"; // Import the new component
import "./HistoryPage.css"; // We will create this next

const HistoryPage = () => {
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-05-01",
    endDate: "2025-06-30",
  });
  const [history, setHistory] = useState({ bookings: [], cancellations: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  return (
    <div className="history-page-container">
      <div className="history-header">
        {/* Placeholder for the date range picker */}
        <div className="date-picker-placeholder">
          <span className="calendar-icon">📅</span>
          <span>
            {dateRange.startDate} ~ {dateRange.endDate}
          </span>
        </div>
      </div>

      {isLoading ? (
        <p>Loading history...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <div className="history-section">
            <h2>예약 내역</h2>
            <p className="section-date">2025년 6월 5일</p>
            {history.bookings.length > 0 ? (
              history.bookings.map((item) => (
                <HistoryCard
                  key={`booking-${item.RESERVEDATETIME}`}
                  item={item}
                  type="booking"
                />
              ))
            ) : (
              <p>No booking history found for this period.</p>
            )}
          </div>

          <div className="history-section">
            <h2>취소 내역</h2>
            <p className="section-date">2025년 6월 5일</p>
            {history.cancellations.length > 0 ? (
              history.cancellations.map((item) => (
                <HistoryCard
                  key={`cancel-${item.CANCELDATETIME}`}
                  item={item}
                  type="cancellation"
                />
              ))
            ) : (
              <p>No cancellation history found for this period.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryPage;
