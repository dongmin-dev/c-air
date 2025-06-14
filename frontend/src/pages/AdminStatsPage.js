import React, { useState, useEffect } from "react";
import statsService from "../services/statsService";
import "./AdminStatsPage.css";

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const AdminStatsPage = () => {
  // 1. Update the initial state to use 'bookingSummary'
  const [stats, setStats] = useState({
    bookingSummary: [],
    customerRanking: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    statsService
      .getStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        setError("Failed to load statistics.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="admin-page-container">
      <h1 className="page-title">관리자 통계</h1>
      {isLoading ? (
        <p>Loading statistics...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="stats-content">
          <div className="stats-card">
            <h2>항공사 및 좌석 등급별 통계 (CUBE)</h2>
            <p>
              항공사/좌석 등급별 총 예약 수와 매출을 보여줍니다. 빈 값은 소계
              또는 총계를 의미합니다.
            </p>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>항공사</th>
                    <th>좌석 등급</th>
                    <th>총 예약 수</th>
                    <th>총 매출</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 2. Update the map to iterate over 'stats.bookingSummary' */}
                  {stats.bookingSummary.map((row, index) => (
                    <tr
                      key={index}
                      className={
                        !row.AIRLINE && !row.SEATCLASS
                          ? "grand-total"
                          : !row.SEATCLASS
                          ? "sub-total"
                          : ""
                      }
                    >
                      {/* 3. Update the data access to use new property names */}
                      <td>{row.AIRLINE || "소계"}</td>
                      <td>{row.SEATCLASS || "소계"}</td>
                      <td>{row.TOTAL_BOOKINGS}</td>
                      <td>{formatCurrency(row.TOTAL_REVENUE)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="stats-card">
            <h2>고객별 지출 순위</h2>
            <p>총 결제 금액을 기준으로 고객 순위를 보여줍니다.</p>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>고객 번호</th>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>예약 횟수</th>
                    <th>총 결제 금액</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.customerRanking.map((row) => (
                    <tr key={row.CNO}>
                      <td>{row.CUSTOMER_RANK}</td>
                      <td>{row.CNO}</td>
                      <td>{row.NAME}</td>
                      <td>{row.EMAIL}</td>
                      <td>{row.BOOKING_COUNT}</td>
                      <td>{formatCurrency(row.TOTAL_SPENT)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStatsPage;
