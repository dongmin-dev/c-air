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

  const [sortBy, setSortBy] = useState("price_asc");
  const [flights, setFlights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // This function is now separate, can be called by search button OR sort change
  const performSearch = async () => {
    setIsLoading(true);
    setError("");
    // No longer setting flights to null, so the list doesn't disappear during sort
    try {
      const paramsWithSort = { ...searchParams, sortBy };
      const results = await flightService.searchFlights(paramsWithSort);
      setFlights(results);
    } catch (err) {
      setError("Failed to fetch flights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // This effect hook re-runs the search whenever 'sortBy' changes.
  useEffect(() => {
    // Only run the search if flights have been loaded at least once
    if (flights !== null) {
      performSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleSearchButtonClick = () => {
    setFlights(null); // Clear previous results completely for a new search
    performSearch();
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
