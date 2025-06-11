import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// We will create these in the next steps
// import cancellationService from '../services/cancellationService';
// import './CancellationPage.css';

const CancellationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the original booking item passed from the history page
  const bookingItem = location.state?.bookingItem;

  // For now, we'll just display the raw data to confirm it's being passed correctly.

  // Safeguard: if no data is passed, redirect back to history.
  useEffect(() => {
    if (!bookingItem) {
      navigate("/history");
    }
  }, [bookingItem, navigate]);

  if (!bookingItem) {
    return null; // Don't render anything before redirecting
  }

  return (
    <div className="cancellation-page">
      <h1>취소하는 예약 정보</h1>
      <pre>{JSON.stringify(bookingItem, null, 2)}</pre>
    </div>
  );
};

export default CancellationPage;
