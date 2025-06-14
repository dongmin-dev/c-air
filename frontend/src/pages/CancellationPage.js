import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cancellationService from "../services/cancellationService";
import "./CancellationPage.css";
import { getAirlineLogo } from "../services/logoService"; // Import the new logo service function

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

// Helper to format full date and time for the route section
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

// Helper function to calculate cancellation fee and refund
const calculateRefund = (booking) => {
  if (!booking) return { fee: 0, refund: 0, daysUntilDeparture: 0 };

  const departureDate = new Date(booking.DEPARTUREDATETIME);
  const today = new Date();

  const diffTime =
    departureDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const daysUntilDeparture = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let fee = 0;
  if (daysUntilDeparture >= 15) {
    fee = 150000;
  } else if (daysUntilDeparture >= 4) {
    fee = 180000;
  } else if (daysUntilDeparture >= 1) {
    fee = 250000;
  } else {
    fee = booking.PAYMENT;
  }

  const refund = booking.PAYMENT - fee;
  return { fee, refund, daysUntilDeparture };
};

const CancellationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);

  const bookingItem = location.state?.bookingItem;

  useEffect(() => {
    if (!bookingItem) {
      navigate("/history");
    }
  }, [bookingItem, navigate]);

  const handleFinalCancel = async () => {
    if (isCancelling) return;
    setIsCancelling(true);

    try {
      await cancellationService.createCancellation(bookingItem);
      alert("Cancellation successful!");
      navigate("/history");
    } catch (error) {
      alert(`Cancellation failed: ${error.message}`);
    } finally {
      setIsCancelling(false);
    }
  };

  if (!bookingItem) {
    return <div>Loading...</div>;
  }

  const { fee, refund, daysUntilDeparture } = calculateRefund(bookingItem);

  return (
    <div className="cancellation-page-container">
      <h1 className="page-title">취소하는 예약 정보</h1>
      <div className="cancellation-content">
        <div className="cancellation-main">
          <div className="itinerary-details card-style">
            <div className="card-header">
              {/* Use the new function to get the correct logo */}
              <img
                src={getAirlineLogo(bookingItem.AIRLINE)}
                alt={bookingItem.AIRLINE}
                className="airline-logo-small"
              />
              <div className="flight-tags">
                <span className="tag">{bookingItem.FLIGHTNO}</span>
                <span className="tag">{bookingItem.SEATCLASS}</span>
              </div>
            </div>
            <div className="card-body">
              <div className="flight-route-detailed">
                <div className="route-leg">
                  <p className="airport-large">
                    {bookingItem.DEPARTUREAIRPORT}
                  </p>
                  <p className="leg-datetime">
                    {formatRouteDateTime(bookingItem.DEPARTUREDATETIME)}
                  </p>
                </div>
                <div className="route-line-detailed"></div>
                <div className="route-leg">
                  <p className="airport-large">{bookingItem.ARRIVALAIRPORT}</p>
                  <p className="leg-datetime">
                    {formatRouteDateTime(bookingItem.ARRIVALDATETIME)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="cancellation-policy card-style">
            <h2>위약금 정책</h2>
            <table>
              <thead>
                <tr>
                  <th>15일 이전</th>
                  <th>4일 - 14일 이전</th>
                  <th>3일 이전</th>
                  <th>당일</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>-150,000 원</td>
                  <td>-180,000 원</td>
                  <td>-250,000 원</td>
                  <td>전액 위약금</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="cancellation-summary card-style">
          <h2>환불 예상 금액</h2>
          <div className="fare-row">
            <span className="fare-label">결제 요금</span>
            <span className="fare-value">
              {formatCurrency(bookingItem.PAYMENT)}
            </span>
          </div>
          <div className="fare-row">
            <span className="fare-label">
              위약금 <small>(출발 {daysUntilDeparture}일 전)</small>
            </span>
            <span className="fare-value fee-amount">
              {formatCurrency(fee * -1)}
            </span>
          </div>
          <hr />
          <div className="fare-total">
            <span className="fare-label">총액</span>
            <span className="total-price">{formatCurrency(refund)}</span>
          </div>
        </div>
      </div>
      <div className="payment-footer">
        <div className="payment-footer-content">
          <div className="final-price-info">
            <span>최종 환불 금액</span>
            <span className="final-price">{formatCurrency(refund)}</span>
          </div>
          <button
            onClick={handleFinalCancel}
            disabled={isCancelling}
            className="payment-button cancel-final-button"
          >
            {isCancelling ? "취소 처리 중..." : "취소하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationPage;
