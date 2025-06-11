import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
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

  const [sortBy, setSortBy] = useState("price_asc");
  const [flights, setFlights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Use useCallback to memoize the function and ensure it has the latest state
  const performSearch = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const paramsWithSort = { ...searchParams, sortBy };
      const results = await flightService.searchFlights(paramsWithSort);
      setFlights(results);
    } catch (err) {
      setError("Failed to fetch flights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, sortBy]); // Dependencies for useCallback

  // This effect hook now correctly re-runs the search
  useEffect(() => {
    if (flights !== null) {
      performSearch();
    }
  }, [sortBy, performSearch]); // Add performSearch to the dependency array

  const handleSearchButtonClick = () => {
    setFlights(null); // Clear previous results completely for a new search
    // A slight delay to ensure state updates before searching
    setTimeout(() => performSearch(), 0);
  };

  return (
    <div className="search-page">
      <div className="search-page-title-container">
        <h1>항공기를 검색하세요.</h1>
      </div>
      <SearchForm
        params={searchParams}
        setParams={setSearchParams}
        onSearch={handleSearchButtonClick}
      />

      {flights !== null && (
        <SearchResults
          flights={flights}
          isLoading={isLoading}
          error={error}
          searchParams={searchParams}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}
    </div>
  );
};

export default SearchPage;
