import React from "react";
import { useNavigate } from "react-router-dom";
import "./FlightCard.css";
import { getAirlineLogo } from "../services/logoService"; // Import the new logo service function

// Helper function to format the date and time
const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("ko-KR", options).format(date);
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate("/book", { state: { flight: flight } });
  };

  const isSoldOut = flight.REMAINING_SEATS <= 0;
  const hasDeparted = new Date(flight.DEPARTUREDATETIME) < new Date();

  const getButtonState = () => {
    if (isSoldOut) {
      return { text: "매진", title: "This flight is sold out" };
    }
    if (hasDeparted) {
      return { text: "출발 완료", title: "This flight has already departed" };
    }
    return { text: "선택하기 →", title: "Select this flight" };
  };

  const buttonState = getButtonState();

  return (
    <div className="flight-card">
      <div className="airline-section">
        {/* Use the new function to get the correct logo */}
        <img
          src={getAirlineLogo(flight.AIRLINE)}
          alt={flight.AIRLINE}
          className="airline-logo"
        />
      </div>
      <div className="details-section">
        <div className="time-info">
          <p className="time">
            {formatDateTime(flight.DEPARTUREDATETIME).split(" ")[4]}
          </p>
          <p className="airport-code">{flight.DEPARTUREAIRPORT}</p>
        </div>
        <div className="duration-line"></div>
        <div className="time-info">
          <p className="time">
            {formatDateTime(flight.ARRIVALDATETIME).split(" ")[4]}
          </p>
          <p className="airport-code">{flight.ARRIVALAIRPORT}</p>
        </div>
      </div>
      <div className="seats-section">
        {isSoldOut ? "매진" : `잔여좌석 ${flight.REMAINING_SEATS}석`}
      </div>
      <div className="pricing-section">
        <p className="flight-number">{flight.FLIGHTNO}</p>
        <p className="price">{formatCurrency(flight.PRICE)}</p>
        <button
          className="select-button"
          onClick={handleSelect}
          disabled={isSoldOut || hasDeparted}
          title={buttonState.title}
        >
          {buttonState.text}
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
