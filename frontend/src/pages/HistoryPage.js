import React, { useState, useEffect } from "react";
import historyService from "../services/historyService";
import HistoryCard from "../components/HistoryCard";
import "./HistoryPage.css";

// New helper function to group history items by date
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
    startDate: "2025-05-01",
    endDate: "2025-06-30",
  });
  // This state will now hold the grouped data
  const [groupedHistory, setGroupedHistory] = useState({
    bookings: {},
    cancellations: {},
  });
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

  return (
    <div className="history-page-container">
      <div className="history-header">
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
