import React from "react";
import FlightCard from "./FlightCard";
import "./SearchResults.css";

// The component now accepts 'onDateChange' as a prop
const SearchResults = ({
  flights,
  isLoading,
  error,
  searchParams,
  sortBy,
  onSortChange,
  onDateChange,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-message">Searching for flights...</div>;
    }

    if (error) {
      return <div className="error-message-results">{error}</div>;
    }

    if (flights.length === 0) {
      return (
        <div className="no-results-message">
          No flights found for the selected criteria.
        </div>
      );
    }

    return (
      <>
        <div className="results-header">
          <div className="search-summary">
            {searchParams.departureAirport} - {searchParams.arrivalAirport}{" "}
            &middot; {searchParams.seatClass}
          </div>
          <div className="date-navigator">
            {/* The arrow buttons are now functional */}
            <button className="nav-arrow" onClick={() => onDateChange(-1)}>
              &lt;
            </button>
            <span className="current-date">
              {new Date(searchParams.departureDate).toLocaleDateString(
                "ko-KR",
                { month: "long", day: "numeric", weekday: "short" }
              )}
            </span>
            <button className="nav-arrow" onClick={() => onDateChange(1)}>
              &gt;
            </button>
          </div>
        </div>

        <div className="sort-container">
          <select
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="price_asc">최저가순</option>
            <option value="time_asc">출발시간순</option>
          </select>
        </div>

        <div className="flight-list">
          {flights.map((flight) => (
            <FlightCard
              key={`${flight.FLIGHTNO}-${flight.DEPARTUREDATETIME}`}
              flight={flight}
            />
          ))}
        </div>
      </>
    );
  };

  return <div className="search-results-container">{renderContent()}</div>;
};

export default SearchResults;
