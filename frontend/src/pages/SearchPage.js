import React, { useState, useEffect } from "react";
import flightService from "../services/flightService";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";
import "./SearchPage.css";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    departureAirport: "ICN",
    arrivalAirport: "JFK",
    departureDate: new Date().toISOString().split("T")[0],
    seatClass: "ECONOMY",
  });

  const [sortBy, setSortBy] = useState("price_asc");
  const [flights, setFlights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [airports, setAirports] = useState([]);

  useEffect(() => {
    flightService
      .getAirports()
      .then((data) => {
        setAirports(data);
      })
      .catch((err) => {
        console.error("Failed to fetch airports list:", err);
      });
  }, []);

  const executeSearch = async (params, sortValue) => {
    setIsLoading(true);
    setError("");

    if (flights === null) {
      setFlights([]);
    }

    try {
      const query = { ...params, sortBy: sortValue };
      const results = await flightService.searchFlights(query);
      setFlights(results);
    } catch (err) {
      setError("Failed to fetch flights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchButtonClick = () => {
    executeSearch(searchParams, sortBy);
  };

  const handleSortChange = (newSortValue) => {
    setSortBy(newSortValue);
    if (flights) {
      executeSearch(searchParams, newSortValue);
    }
  };

  // This new function handles changing the date by one day
  const handleDateArrowClick = (daysToAdd) => {
    const currentDate = new Date(searchParams.departureDate);
    // Set time to noon to avoid timezone-related day shifts
    currentDate.setUTCHours(12);
    currentDate.setDate(currentDate.getDate() + daysToAdd);

    const newDate = currentDate.toISOString().split("T")[0];
    const newParams = { ...searchParams, departureDate: newDate };

    // Update the state and execute a new search
    setSearchParams(newParams);
    executeSearch(newParams, sortBy);
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
        airports={airports}
      />

      {flights !== null && (
        <SearchResults
          flights={flights}
          isLoading={isLoading}
          error={error}
          searchParams={searchParams}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onDateChange={handleDateArrowClick} // Pass the new handler down
        />
      )}
    </div>
  );
};

export default SearchPage;
