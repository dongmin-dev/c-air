import React from "react";
import { useNavigate } from "react-router-dom";
import "./FlightCard.css";
import koreanAirLogo from "../koreanair.png";

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

  // Check if the flight is sold out
  const isSoldOut = flight.REMAINING_SEATS <= 0;

  return (
    <div className="flight-card">
      <div className="airline-section">
        <img
          src={koreanAirLogo}
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
          disabled={isSoldOut}
          title={isSoldOut ? "This flight is sold out" : "Select this flight"}
        >
          {isSoldOut ? "매진" : "선택하기 →"}
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
