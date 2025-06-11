import React, { useState } from "react";
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

  // A single, robust search function
  const handleSearch = async (currentSortBy = sortBy) => {
    setIsLoading(true);
    setError("");

    // If it's a new search from the button, clear results.
    // If it's just a sort, the list won't disappear.
    if (flights === null) {
      setFlights([]);
    }

    try {
      const paramsWithSort = { ...searchParams, sortBy: currentSortBy };
      const results = await flightService.searchFlights(paramsWithSort);
      setFlights(results);
    } catch (err) {
      setError("Failed to fetch flights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // This handler is for the sort dropdown
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // Trigger a search immediately with the new sort value
    handleSearch(newSortBy);
  };

  // This handler is for the main search button
  const handleSearchButtonClick = () => {
    setFlights(null); // Set to null to indicate a fresh search
    // Use a timeout to ensure state is cleared before the new search begins
    setTimeout(() => handleSearch(), 0);
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
          onSortChange={handleSortChange} // Use the new handler
        />
      )}
    </div>
  );
};

export default SearchPage;
