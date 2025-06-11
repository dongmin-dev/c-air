import React from "react";
// We will create this CSS file next
import "./HistoryCard.css";

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const HistoryCard = ({ item, type }) => {
  // Determine which date and amount to display based on the type of history
  const displayDate =
    type === "booking"
      ? new Date(item.RESERVEDATETIME)
      : new Date(item.CANCELDATETIME);
  const displayAmount = type === "booking" ? item.PAYMENT : item.REFUND;

  return (
    <div className="history-card">
      <div className="history-card-left">
        <span className="airline-name">{item.AIRLINE}</span>
      </div>
      <div className="history-card-center">
        <p className="route">
          {item.DEPARTUREAIRPORT} → {item.ARRIVALAIRPORT}
        </p>
        <p className="flight-meta">
          {new Date(item.DEPARTUREDATETIME).toLocaleDateString("ko-KR")} (
          {new Date(item.DEPARTUREDATETIME).toLocaleDateString("ko-KR", {
            weekday: "short",
          })}
          ){" "}
          {new Date(item.DEPARTUREDATETIME).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
          -
          {new Date(item.ARRIVALDATETIME).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
          {" · "}
          {item.FLIGHTNO}
          {" · "}
          {item.SEATCLASS}
        </p>
      </div>
      <div className="history-card-right">
        <p className="history-amount">{formatCurrency(displayAmount)}</p>
        {/* Conditionally render the cancel button only for booking history */}
        {type === "booking" && (
          <button className="cancel-button">취소하기</button>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
