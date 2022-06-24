import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";

import Filter from "../../components/Filter";
export default function BreweryList() {
  // Data Loading State
  const [initialBreweries, setInitialBreweries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedResults, setPaginatedResults] = useState([]);
  const [resultsPerPage] = useState(10);

  //  Filter State

  const [filteredResults, setFilteredResults] = useState([]);
  const [cityFilter, setCityFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [breweryTypeFilter, setBreweryTypeFilter] = useState("All");
  // Sort State
  const [sortAsc, setSortAsc] = useState(true);

  // Search State
  const [lastSearch, setLastSearch] = useState("");
  const [searchContainer, setSearchContainer] = useState("");
  // Refs
  const searchRef = useRef();

  // call API with any endpoint and store
  const fetchBreweryList = async (url) => {
    setLoading(true);
    const res = await fetch(url);

    let breweryList = await res.json();
    // Sort initial data asc by name
    breweryList = [...breweryList].sort((a, b) => (a.name > b.name ? 1 : -1));
    setInitialBreweries(breweryList);
    setFilteredResults(breweryList);
    setLoading(false);
  };

  // Initial api call
  useEffect(() => {
    fetchBreweryList("https://api.openbrewerydb.org/breweries");
  }, []);

  // Calculate pagination and seperate current page data from overall initial data
  useEffect(() => {
    const lastBreweryIndex = currentPage * resultsPerPage;
    const firstBreweryIndex = lastBreweryIndex - resultsPerPage;

    setPaginatedResults(
      filteredResults.slice(firstBreweryIndex, lastBreweryIndex)
    );
  }, [filteredResults, currentPage]);

  // Update filtered Results

  useEffect(() => {
    setFilteredResults(filterType(filterState(filterCity(initialBreweries))));
  }, [cityFilter, stateFilter, breweryTypeFilter]);
  // Sort
  const sortResults = () => {
    setFilteredResults([...filteredResults].reverse());

    setCurrentPage(1);
  };

  // Filter

  const filterSettings = (type, selection) => {
    switch (type) {
      case "state":
        setStateFilter(selection);

        setCityFilter("All");
        break;
      case "city":
        setCityFilter(selection);
        break;

      case "breweryType":
        setBreweryTypeFilter(selection);
        break;
      case "clearFilter":
        setCityFilter("All");
        setStateFilter("All");
        setBreweryTypeFilter("All");

      default:
        break;
    }
  };

  const filterCity = (results) => {
    if (cityFilter === "All") {
      return results;
    }

    let filtered = results.filter((result) => {
      return result.city === cityFilter;
    });

    return filtered;
  };
  const filterState = (results) => {
    if (stateFilter === "All") {
      return results;
    }

    let filtered = results.filter((result) => {
      return result.state === stateFilter;
    });

    return filtered;
  };
  const filterType = (results) => {
    console.log(breweryTypeFilter);
    if (breweryTypeFilter === "All") {
      return results;
    }

    let filtered = results.filter((result) => {
      return (
        result.brewery_type ===
        breweryTypeFilter.charAt(0).toLowerCase() + breweryTypeFilter.slice(1)
      );
    });

    return filtered;
  };
  // Search Query GET ten results
  const handleSearch = (e) => {
    e.preventDefault();
    setLastSearch(searchRef.current.value);
    filterSettings("clearFilter");
    fetchBreweryList(
      `https://api.openbrewerydb.org/breweries/search?query=${searchRef.current.value}`
    );
  };
  const handleSearchTyping = (e) => {
    setSearchContainer(e.target.value);
  };
  // Clear search input and reload initial data
  const clearSearch = (e) => {
    e.preventDefault();
    searchRef.current.value = "";

    // Return Recent Data
    fetchBreweryList("https://api.openbrewerydb.org/breweries");
  };

  // Pagination

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <main className="container">
      <div className="card">
        <h1>Brewery Catalog</h1>
        <form className="form-container" onSubmit={(e) => handleSearch(e)}>
          <div className="search-container">
            <input
              type="text"
              name="search"
              className="search-input"
              placeholder="Find a brewery"
              onChange={(e) => handleSearchTyping(e)}
              ref={searchRef}
            />

            <div className="search-button-container">
              <button className="search-button" type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="search-icon icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          {searchContainer.length !== 0 && (
            <button className="reset-button" onClick={(e) => clearSearch(e)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="reset-icon icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </form>

        <div className="results-card">
          <div className="results-heading">
            <h2>
              Brewery Results
              {lastSearch.length !== 0 && ` for "${lastSearch}"`}
            </h2>
            <div className="sort-container" onClick={sortResults}>
              <h2>Name: {sortAsc ? "(Asc)" : "(Dsc)"}</h2>
              <button className="sort-button">
                {sortAsc ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="sort-icon icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="sort-icon icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="filter-card">
            <h2>Filter</h2>
            <Filter
              initialBreweries={initialBreweries}
              stateFilter={stateFilter}
              breweryTypeFilter={breweryTypeFilter}
              filterSettings={filterSettings}
            />
          </div>
          {paginatedResults.length !== 0 ? (
            <>
              <ul className="results-container">
                {paginatedResults.map((breweryLink) => (
                  <li key={breweryLink.id} className="result">
                    <Link
                      className="result-link"
                      to={`/breweries/${breweryLink.id}`}
                    >
                      <div className="result-text">
                        <h3>{breweryLink.name}</h3>
                        {`${breweryLink.city}, ${breweryLink.state}`}
                      </div>
                    </Link>

                    {breweryLink.website_url !== null ? (
                      <a
                        className="result-button"
                        href={breweryLink.website_url}
                        target="_blank"
                      >
                        Visit Website
                      </a>
                    ) : (
                      <div className="no-website-container">
                        <p>No Website Availabe</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <Pagination
                resultsPerPage={resultsPerPage}
                totalResults={filteredResults.length}
                currentPage={currentPage}
                paginate={paginate}
              />
            </>
          ) : (
            <div className="no-results-container">
              <p className="no-results">No Results found!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
