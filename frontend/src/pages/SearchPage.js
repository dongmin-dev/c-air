import React, { useState, useEffect } from "react";
import flightService from "../services/flightService";
import SearchForm from "../components/SearchForm"; // Import the SearchForm component
import "./SearchPage.css"; // We will create this CSS file later for page-level layout

const SearchPage = () => {
  // State to hold the search form inputs
  const [searchParams, setSearchParams] = useState({
    departureAirport: "ICN",
    arrivalAirport: "JFK",
    departureDate: "2025-06-11",
    seatClass: "ECONOMY",
  });

  // State for the flight results, loading status, and errors
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // This function is called when the user clicks the search button
  const handleSearch = async () => {
    setIsLoading(true);
    setError("");
    console.log("Searching with params:", searchParams); // For debugging
    try {
      const results = await flightService.searchFlights(searchParams);
      setFlights(results);
      console.log("Search results:", results); // For debugging
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
      <SearchForm params={searchParams} onSearch={handleSearch} />
      {/* We will add the <SearchResults /> component here in a later step */}
    </div>
  );
};

export default SearchPage;
