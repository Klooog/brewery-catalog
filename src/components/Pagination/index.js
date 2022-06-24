import React from "react";

const Pagination = ({ resultsPerPage, totalResults, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalResults / resultsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul style={{ display: "flex" }}>
        {pageNumbers.map((number) => (
          <li key={number} style={{ listStyle: "none" }}>
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
