import React from "react";
import { useNavigate } from "react-router-dom";
import "./HistoryCard.css";
import koreanAirLogo from "../koreanair.png";

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const HistoryCard = ({ item, type }) => {
  const navigate = useNavigate();
  const displayAmount = type === "booking" ? item.PAYMENT : item.REFUND;

  // This function will be called when the "Cancel" button is clicked
  const handleCancelClick = () => {
    // Navigate to the '/cancel' page and pass the entire booking item in the state
    navigate("/cancel", { state: { bookingItem: item } });
  };

  return (
    <div className="history-card">
      <div className="history-card-left">
        <img src={koreanAirLogo} alt={item.AIRLINE} className="airline-logo" />
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
          <button className="cancel-button" onClick={handleCancelClick}>
            취소하기
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
