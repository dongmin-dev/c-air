import React, { useState, useEffect } from "react";
import flightService from "../services/flightService";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults"; // Import the SearchResults component
import "./SearchPage.css";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    departureAirport: "ICN",
    arrivalAirport: "JFK",
    departureDate: "2025-06-11",
    seatClass: "ECONOMY",
  });

  const [flights, setFlights] = useState(null); // Initialize as null to track initial state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    setError("");
    setFlights(null); // Clear previous results
    try {
      const results = await flightService.searchFlights(searchParams);
      setFlights(results);
    } catch (err) {
      setError("Failed to fetch flights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-page-title-container">
        <h1>항공기를 검색하세요.</h1>
      </div>
      <SearchForm
        params={searchParams}
        setParams={setSearchParams}
        onSearch={handleSearch}
      />

      {/* Conditionally render SearchResults only if a search has been performed */}
      {flights !== null && (
        <SearchResults
          flights={flights}
          isLoading={isLoading}
          error={error}
          searchParams={searchParams}
        />
      )}
    </div>
  );
};

export default SearchPage;
