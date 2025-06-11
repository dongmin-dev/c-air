import React, { useState, useEffect } from "react";
import flightService from "../services/flightService";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";
import "./SearchPage.css";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    departureAirport: "ICN",
    arrivalAirport: "JFK",
    departureDate: "2025-06-11",
    seatClass: "ECONOMY",
  });

  // Add a new state for the sorting option
  const [sortBy, setSortBy] = useState("price_asc"); // Default to 'price_asc'
  const [flights, setFlights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    setError("");
    setFlights(null);
    try {
      // Include the sortBy parameter in the search request
      const paramsWithSort = { ...searchParams, sortBy };
      const results = await flightService.searchFlights(paramsWithSort);
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

      {flights !== null && (
        <SearchResults
          flights={flights}
          isLoading={isLoading}
          error={error}
          searchParams={searchParams}
          sortBy={sortBy}
          onSortChange={setSortBy} // Pass the setter function to the child
        />
      )}
    </div>
  );
};

export default SearchPage;
