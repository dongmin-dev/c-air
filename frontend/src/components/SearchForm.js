import React from "react";

// We will create this CSS file in the next step
import "./SearchForm.css";

const SearchForm = ({ params, onSearch }) => {
  // For now, the inputs are not interactive. We are just building the layout.
  // We will pass the 'params' and an 'onSearch' function as props from the parent page.

  return (
    <div className="search-form-wrapper">
      <div className="search-form-container">
        <div className="form-section">
          <label>출발지</label>
          <div className="form-value">서울/인천 (ICN)</div>
        </div>
        <div className="form-section">
          <label>도착지</label>
          <div className="form-value">뉴욕/존 F. 케네디 (JFK)</div>
        </div>
        <div className="form-section">
          <label>출발날짜</label>
          <div className="form-value">2025. 10. 10.</div>
        </div>
        <div className="form-section">
          <label>좌석등급</label>
          <div className="form-value">전체</div>
        </div>
        <button className="search-action-button" onClick={onSearch}>
          검색하기
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
