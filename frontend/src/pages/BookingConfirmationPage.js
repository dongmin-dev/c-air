import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookingService from "../services/bookingService";
import "./BookingConfirmationPage.css";
import koreanAirLogo from "../koreanair.png"; // Import the logo

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const flight = location.state?.flight;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!flight) {
      navigate("/search");
    }
  }, [flight, navigate]);

  const handleBooking = async () => {
    if (isBooking) return;
    setIsBooking(true);

    try {
      await bookingService.createBooking(flight, user);
      alert("Booking successful! A confirmation has been sent to your email.");
      navigate("/history"); // Navigate to history page after successful booking
    } catch (error) {
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  if (!flight || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="booking-page-container">
      <h1 className="page-title">여정 정보</h1>
      <div className="booking-content">
        <div className="itinerary-details">
          <div className="flight-info-header">
            {/* Replace the text with the image */}
            <img
              src={koreanAirLogo}
              alt={flight.AIRLINE}
              className="airline-logo-small"
            />
          </div>
          <div className="flight-info-body">
            <p className="route">
              {flight.DEPARTUREAIRPORT} → {flight.ARRIVALAIRPORT}
            </p>
            <p className="flight-meta">
              {new Date(flight.DEPARTUREDATETIME).toLocaleDateString("ko-KR")} (
              {new Date(flight.DEPARTUREDATETIME).toLocaleDateString("ko-KR", {
                weekday: "short",
              })}
              ){" "}
              {new Date(flight.DEPARTUREDATETIME).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
              -
              {new Date(flight.ARRIVALDATETIME).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
              {" · "}
              {flight.FLIGHTNO}
              {" · "}
              {flight.SEATCLASS}
            </p>
          </div>
        </div>
        <div className="fare-summary">
          <h2>항공 운송료</h2>
          <div className="fare-item">
            <span>
              {flight.FLIGHTNO} {flight.SEATCLASS}
            </span>
          </div>
          <hr />
          <div className="fare-total">
            <span>총액</span>
            <span className="total-price">{formatCurrency(flight.PRICE)}</span>
          </div>
        </div>
      </div>

      <div className="payment-footer">
        <div className="final-price-info">
          <span>최종 결제 금액</span>
          <span className="final-price">{formatCurrency(flight.PRICE)}</span>
        </div>
        <button
          onClick={handleBooking}
          disabled={isBooking}
          className="payment-button"
        >
          {isBooking ? "Processing..." : "결제하기"}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
