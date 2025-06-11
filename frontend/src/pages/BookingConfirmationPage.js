import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// We will create the CSS for this page in a later step
// import './BookingConfirmationPage.css';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // The flight data is passed via the route's state property
  const flight = location.state?.flight;

  // This effect checks if a user navigated to this page directly
  // without selecting a flight. If so, it redirects them to the search page.
  useEffect(() => {
    if (!flight) {
      console.log("No flight data found, redirecting to search.");
      navigate("/search");
    }
  }, [flight, navigate]);

  // To prevent rendering errors before the redirect, we can return null.
  if (!flight) {
    return null;
  }

  // For now, just display a title to confirm we are on the right page
  // and have received the flight data.
  return (
    <div className="booking-page">
      <h1>여정 정보</h1>
      <pre>{JSON.stringify(flight, null, 2)}</pre>
    </div>
  );
};

export default BookingConfirmationPage;
