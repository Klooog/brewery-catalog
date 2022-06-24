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

    fetchBreweryList(
      `https://api.openbrewerydb.org/breweries/search?query=${searchRef.current.value}`
    );
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
    <main>
      <h1>Brewery Catalog</h1>
      <form onSubmit={(e) => handleSearch(e)}>
        <input
          type="text"
          name="search"
          placeholder="Find a brewery"
          ref={searchRef}
        />
        <button type="submit">Search</button>
        <button onClick={(e) => clearSearch(e)}>Reset</button>
      </form>

      <div>
        <h1>Filter</h1>
        <Filter
          initialBreweries={initialBreweries}
          stateFilter={stateFilter}
          breweryTypeFilter={breweryTypeFilter}
          filterSettings={filterSettings}
        />
      </div>
      <div>
        <button onClick={sortResults}>
          <span>sort</span>
        </button>
      </div>
      <ul>
        {loading
          ? "Loading..."
          : paginatedResults.length === 0
          ? "No Results Available"
          : paginatedResults.map((brewery) => (
              <li key={brewery.id}>
                <Link to={`/breweries/${brewery.id}`}>{brewery.name}</Link>-{" "}
                {brewery.city}, {brewery.state}
              </li>
            ))}
        <Pagination
          resultsPerPage={resultsPerPage}
          totalResults={filteredResults.length}
          paginate={paginate}
        />
      </ul>
    </main>
  );
}
