import React, { useState, useEffect } from "react";
import flightService from "../services/flightService";
// We will create and import these CSS and components in the next steps
// import './SearchPage.css';
// import SearchForm from '../components/SearchForm';
// import SearchResults from '../components/SearchResults';

const SearchPage = () => {
  // State to hold the search form inputs
  const [searchParams, setSearchParams] = useState({
    departureAirport: "ICN",
    arrivalAirport: "JFK",
    departureDate: "2025-06-11", // Defaulting to the current date for this example
    seatClass: "ECONOMY",
  });

  // State for the flight results, loading status, and errors
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // We will implement the search logic here in a later step
  const handleSearch = async () => {
    setIsLoading(true);
    setError("");
    try {
      const results = await flightService.searchFlights(searchParams);
      setFlights(results);
    } catch (err) {
      setError("Failed to fetch flights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // For now, let's just add a title to show the page is rendering
  return (
    <div className="search-page">
      <h1>항공기를 검색하세요.</h1>
      {/* We will add the <SearchForm /> and <SearchResults /> components here */}
    </div>
  );
};

export default SearchPage;
