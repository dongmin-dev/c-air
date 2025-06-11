import React from "react";
import "./HistoryCard.css";
import koreanAirLogo from "../koreanair.png"; // Import the logo image

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const HistoryCard = ({ item, type }) => {
  const displayAmount = type === "booking" ? item.PAYMENT : item.REFUND;

  return (
    <div className="history-card">
      <div className="history-card-left">
        {/* Replace the text with the image */}
        <img src={koreanAirLogo} alt={item.AIRLINE} className="airline-logo" />
      </div>
      <div className="history-card-center">
        {/* ... (rest of the component is the same) ... */}
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
        {type === "booking" && (
          <button className="cancel-button">취소하기</button>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
