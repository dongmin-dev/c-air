import React from "react";
import { useNavigate } from "react-router-dom";
import "./HistoryCard.css";
import { getAirlineLogo } from "../services/logoService"; // Import the new logo service function

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const HistoryCard = ({ item, type }) => {
  const navigate = useNavigate();

  const displayDate =
    type === "booking"
      ? new Date(item.RESERVEDATETIME)
      : new Date(item.CANCELDATETIME);
  const displayAmount = type === "booking" ? item.PAYMENT : item.REFUND;

  const handleCancelClick = () => {
    navigate("/cancel", { state: { bookingItem: item } });
  };

  const hasDeparted = new Date(item.DEPARTUREDATETIME) < new Date();

  return (
    <div className="history-card">
      <div className="history-card-left">
        {/* Use the new function to get the correct logo */}
        <img
          src={getAirlineLogo(item.AIRLINE)}
          alt={item.AIRLINE}
          className="airline-logo"
        />
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
        <p className="event-time">
          {type === "booking" ? "예약 시간" : "취소 시간"}:{" "}
          {displayDate.toLocaleString("ko-KR")}
        </p>
      </div>
      <div className="history-card-right">
        <p className="history-amount">{formatCurrency(displayAmount)}</p>
        {type === "booking" && (
          <button
            className="cancel-button"
            onClick={handleCancelClick}
            disabled={hasDeparted}
            title={
              hasDeparted
                ? "This flight has already departed."
                : "Cancel this booking"
            }
          >
            취소하기
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
