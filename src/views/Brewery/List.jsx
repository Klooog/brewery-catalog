import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BreweryList() {
  // State
  const [initialBreweries, setInitialBreweries] = useState([]);
  const [loading, setLoading] = useState(false);
  // Refs
  const searchRef = useRef();

  // call API with any endpoint and store
  const fetchBreweryList = async (url) => {
    setLoading(true);
    const res = await fetch(url);

    const breweryList = await res.json();
    console.log(url);
    setInitialBreweries(breweryList);

    setLoading(false);
  };

  // Initial api call
  useEffect(() => {
    fetchBreweryList("https://api.openbrewerydb.org/breweries?per_page=10");
  }, []);

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
      <ul>
        {loading
          ? "Loading..."
          : initialBreweries.length === 0
          ? "No Results Available"
          : initialBreweries.map((brewery) => (
              <li key={brewery.id}>
                <Link to={`/breweries/${brewery.id}`}>{brewery.name}</Link>-{" "}
                {brewery.city}, {brewery.state}
              </li>
            ))}
      </ul>
    </main>
  );
}
