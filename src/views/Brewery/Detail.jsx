import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function BreweryDetail() {
  const { id } = useParams();
  // State
  const [breweryDetails, setBreweryDetails] = useState([]);

  // GET Brewery Details https://api.openbrewerydb.org/breweries/{$id}
  const fetchBreweryDetails = async (url) => {
    const res = await fetch(url);

    const brewery = await res.json();

    setBreweryDetails(brewery);
  };
  useEffect(() => {
    fetchBreweryDetails(`https://api.openbrewerydb.org/breweries/${id}`);
  }, []);
  return (
    breweryDetails && (
      <main>
        <h1>{breweryDetails.name}</h1>
        <p>{`${breweryDetails.city}, ${breweryDetails.state} ${breweryDetails.postal_code}`}</p>
        <p>{breweryDetails.country}</p>
        <p>{breweryDetails.phone}</p>
        {breweryDetails.website_url !== null && (
          <p>
            <a href={breweryDetails.website_url}>View Website</a>
          </p>
        )}
        <Link to="/breweries">Back to Breweries</Link>
      </main>
    )
  );
}
