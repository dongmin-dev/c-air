import React, { useState, useEffect } from "react";
import historyService from "../services/historyService";
import HistoryCard from "../components/HistoryCard";
import "./HistoryPage.css";

// Helper function to group history items by date
const groupHistoryByDate = (items, dateField) => {
  if (!items) return {};

  return items.reduce((acc, item) => {
    const date = new Date(item[dateField]).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

const HistoryPage = () => {
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState({
    // Default to a 30-day range ending today
    startDate: new Date(new Date().setDate(new Date().getDate() - 29))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [groupedHistory, setGroupedHistory] = useState({
    bookings: [],
    cancellations: [],
  });
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
          // Group the data after fetching
          const groupedBookings = groupHistoryByDate(
            data.bookings,
            "RESERVEDATETIME"
          );
          const groupedCancellations = groupHistoryByDate(
            data.cancellations,
            "CANCELDATETIME"
          );
          setGroupedHistory({
            bookings: groupedBookings,
            cancellations: groupedCancellations,
          });
        })
        .catch((err) => {
          setError("Failed to load history.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, dateRange]);

  // This handler updates the date range state when an input changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  return (
    <div className="history-page-container">
      <div className="history-header">
        <h1 className="page-title">내역</h1>
        <div className="date-picker-container">
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="date-input"
          />
          <span className="date-separator">~</span>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className="date-input"
          />
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
            {Object.keys(groupedHistory.bookings).length > 0 ? (
              Object.entries(groupedHistory.bookings).map(([date, items]) => (
                <div key={`booking-group-${date}`}>
                  <p className="section-date">{date}</p>
                  {items.map((item) => (
                    <HistoryCard
                      key={`booking-${item.RESERVEDATETIME}`}
                      item={item}
                      type="booking"
                    />
                  ))}
                </div>
              ))
            ) : (
              <p>No booking history found for this period.</p>
            )}
          </div>

          <div className="history-section">
            <h2>취소 내역</h2>
            {Object.keys(groupedHistory.cancellations).length > 0 ? (
              Object.entries(groupedHistory.cancellations).map(
                ([date, items]) => (
                  <div key={`cancel-group-${date}`}>
                    <p className="section-date">{date}</p>
                    {items.map((item) => (
                      <HistoryCard
                        key={`cancel-${item.CANCELDATETIME}`}
                        item={item}
                        type="cancellation"
                      />
                    ))}
                  </div>
                )
              )
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
