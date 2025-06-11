import React from "react";
import FlightCard from "./FlightCard"; // Import our FlightCard component
import "./SearchResults.css"; // We will create this next

const SearchResults = ({ flights, isLoading, error, searchParams }) => {
  // This function decides what content to show based on the current state.
  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-message">Searching for flights...</div>;
    }

    if (error) {
      return <div className="error-message-results">{error}</div>;
    }

    // After a search is complete, if there are no flights, show a message.
    if (flights.length === 0) {
      return (
        <div className="no-results-message">
          No flights found for the selected criteria.
        </div>
      );
    }

    // If we have flight data, display the results.
    return (
      <>
        <div className="results-header">
          {/* Top summary bar from the prototype */}
          <div className="search-summary">
            {searchParams.departureAirport} - {searchParams.arrivalAirport}{" "}
            &middot; {searchParams.seatClass}
          </div>
          <div className="date-navigator">
            <button className="nav-arrow">&lt;</button>
            <span className="current-date">
              {new Date(searchParams.departureDate).toLocaleDateString(
                "ko-KR",
                { month: "long", day: "numeric", weekday: "short" }
              )}
            </span>
            <button className="nav-arrow">&gt;</button>
          </div>
        </div>

        <div className="sort-container">
          <select className="sort-dropdown">
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
