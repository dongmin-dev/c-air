import React from "react";
import { useNavigate } from "react-router-dom";
import "./FlightCard.css";
import koreanAirLogo from "../koreanair.png"; // Import the logo image

// Helper functions (formatDateTime, formatCurrency) remain the same...
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

  const hasDeparted = new Date(flight.DEPARTUREDATETIME) < new Date();

  return (
    <div className="flight-card">
      <div className="airline-section">
        {/* Replace the text with the image */}
        <img
          src={koreanAirLogo}
          alt={flight.AIRLINE}
          className="airline-logo"
        />
      </div>
      <div className="details-section">
        {/* ... (rest of the component is the same) ... */}
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
      <div className="seats-section">잔여좌석 {flight.REMAINING_SEATS}석</div>
      <div className="pricing-section">
        <p className="flight-number">{flight.FLIGHTNO}</p>
        <p className="price">{formatCurrency(flight.PRICE)}</p>
        <button
          className="select-button"
          onClick={handleSelect}
          disabled={hasDeparted}
        >
          선택하기 →
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
