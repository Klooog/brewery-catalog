import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
export default function BreweryList() {
  // Data Loading State
  const [initialBreweries, setInitialBreweries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedResults, setPaginatedResults] = useState([]);
  const [resultsPerPage] = useState(10);
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
      initialBreweries.slice(firstBreweryIndex, lastBreweryIndex)
    );
  }, [initialBreweries, currentPage]);
  // Sort
  const sortResults = () => {
    setInitialBreweries([...initialBreweries].reverse());

    setCurrentPage(1);
  };
  // Search Query GET ten results
  const handleSearch = (e) => {
    e.preventDefault();

    fetchBreweryList(
      `https://api.openbrewerydb.org/breweries/search?query=${searchRef.current.value}&per_page=10`
    );
  };

  // Clear search input and reload initial data
  const clearSearch = (e) => {
    e.preventDefault();
    searchRef.current.value = "";

    // Return Recent Data
    fetchBreweryList("https://api.openbrewerydb.org/breweries?per_page=10");
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
          totalResults={initialBreweries.length}
          paginate={paginate}
        />
      </ul>
    </main>
  );
}
