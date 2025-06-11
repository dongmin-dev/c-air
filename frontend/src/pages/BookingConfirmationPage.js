import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bookingService from "../services/bookingService";
import "./BookingConfirmationPage.css"; // We will create this next

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
  const [isBooking, setIsBooking] = useState(false); // To prevent double clicks

  // The flight data is passed via the route's state property
  const flight = location.state?.flight;

  // This effect runs once to get the logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user is logged in, they shouldn't be here. Redirect to login.
      navigate("/");
    }
  }, [navigate]);

  // This effect checks if a user navigated to this page directly
  // without selecting a flight. If so, it redirects them to the search page.
  useEffect(() => {
    if (!flight) {
      console.log("No flight data found, redirecting to search.");
      navigate("/search");
    }
  }, [flight, navigate]);

  const handleBooking = async () => {
    if (isBooking) return; // Prevent double-click
    setIsBooking(true);

    try {
      await bookingService.createBooking(flight, user);
      alert("Booking successful! A confirmation has been sent to your email.");
      navigate("/search"); // Redirect to search page after successful booking
    } catch (error) {
      // Display the specific error message from the backend
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  // To prevent rendering errors before the redirect, we can return a loading/null state.
  if (!flight || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="booking-page-container">
      <h1 className="page-title">여정 정보</h1>
      <div className="booking-content">
        <div className="itinerary-details">
          <div className="flight-info-header">
            <span className="airline-name">{flight.AIRLINE}</span>
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
