import React from "react";

const Pagination = ({
  resultsPerPage,
  totalResults,
  currentPage,
  paginate,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalResults / resultsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination-container">
        <h2>Pages</h2>
        {pageNumbers.map((number) => (
          <li key={number} style={{ listStyle: "none" }}>
            <button
              style={{
                color: currentPage === number ? "#fff" : "#1a73e8",
                backgroundColor: currentPage === number ? "#1a73e8" : "#fff",
              }}
              className="pagination-button"
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
