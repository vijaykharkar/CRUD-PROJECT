// Pagination.js
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <nav aria-label="Pagination">
      <ul className="pagination mb-0">
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
        </li>
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {[...Array(totalPages).keys()].map((index) => (
          <li key={index} className="page-item">
            <button
              className="page-link"
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
