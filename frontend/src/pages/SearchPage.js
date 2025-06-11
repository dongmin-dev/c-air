import React, { useState, useEffect } from "react";
import flightService from "../services/flightService";
import SearchForm from "../components/SearchForm";
import "./SearchPage.css";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    departureAirport: "ICN",
    arrivalAirport: "JFK",
    departureDate: "2025-06-11",
    seatClass: "ECONOMY",
  });

  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    setError("");
    console.log("Searching with params:", searchParams);
    try {
      const results = await flightService.searchFlights(searchParams);
      setFlights(results);
      console.log("Search results:", results);
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
        setParams={setSearchParams} /* Pass the state setter function */
        onSearch={handleSearch}
      />
      {/* We will add the <SearchResults /> component here in a later step */}
    </div>
  );
};

export default SearchPage;
