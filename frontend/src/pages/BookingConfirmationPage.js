import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookingService from "../services/bookingService";
import "./BookingConfirmationPage.css";
import koreanAirLogo from "../koreanair.png";

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

// New helper to format full date and time for the route section
const formatRouteDateTime = (isoString) => {
  const date = new Date(isoString);
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  };
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
  return `${date.toLocaleDateString(
    "ko-KR",
    dateOptions
  )} ${date.toLocaleTimeString("en-GB", timeOptions)}`;
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
      navigate("/history");
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
        <div className="itinerary-details card-style">
          <div className="card-header">
            <img
              src={koreanAirLogo}
              alt={flight.AIRLINE}
              className="airline-logo-small"
            />
            <div className="flight-tags">
              <span className="tag">{flight.FLIGHTNO}</span>
              <span className="tag">{flight.SEATCLASS}</span>
            </div>
          </div>
          <div className="card-body">
            <div className="flight-route-detailed">
              <div className="route-leg">
                <p className="airport-large">{flight.DEPARTUREAIRPORT}</p>
                <p className="leg-datetime">
                  {formatRouteDateTime(flight.DEPARTUREDATETIME)}
                </p>
              </div>
              <div className="route-line-detailed"></div>
              <div className="route-leg">
                <p className="airport-large">{flight.ARRIVALAIRPORT}</p>
                <p className="leg-datetime">
                  {formatRouteDateTime(flight.ARRIVALDATETIME)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="fare-summary card-style">
          <h2>항공 운송료</h2>
          <div className="flight-tags">
            <span className="tag">{flight.FLIGHTNO}</span>
            <span className="tag">{flight.SEATCLASS}</span>
          </div>
          <hr />
          <div className="fare-row">
            <span>총액</span>
            <span className="total-price">{formatCurrency(flight.PRICE)}</span>
          </div>
        </div>
      </div>
      <div className="payment-footer">
        <div className="payment-footer-content">
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
    </div>
  );
};

export default BookingConfirmationPage;
