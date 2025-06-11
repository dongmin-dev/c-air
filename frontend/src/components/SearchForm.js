import React from "react";
import "./SearchForm.css";

const SearchForm = ({ params, setParams, onSearch }) => {
  // This function handles changes for all input fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  return (
    <div className="search-form-wrapper">
      {/* We use a <form> tag to group the inputs */}
      <form
        className="search-form-container"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="form-section">
          <label htmlFor="departureAirport">출발지</label>
          <input
            type="text"
            id="departureAirport"
            name="departureAirport"
            className="form-input"
            value={params.departureAirport}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label htmlFor="arrivalAirport">도착지</label>
          <input
            type="text"
            id="arrivalAirport"
            name="arrivalAirport"
            className="form-input"
            value={params.arrivalAirport}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label htmlFor="departureDate">출발날짜</label>
          <input
            type="date"
            id="departureDate"
            name="departureDate"
            className="form-input"
            value={params.departureDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-section">
          <label htmlFor="seatClass">좌석등급</label>
          <select
            id="seatClass"
            name="seatClass"
            className="form-input"
            value={params.seatClass}
            onChange={handleChange}
          >
            <option value="ECONOMY">Economy</option>
            <option value="BUSINESS">Business</option>
          </select>
        </div>
        <button type="submit" className="search-action-button">
          검색하기
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
