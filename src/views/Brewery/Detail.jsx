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

    // Format phone
    let phoneArray = brewery.phone.split("");
    phoneArray.splice(0, 0, "(");
    phoneArray.splice(4, 0, ")");
    phoneArray.splice(5, 0, " ");
    phoneArray.splice(9, 0, " ");
    phoneArray.splice(10, 0, "-");
    phoneArray.splice(11, 0, " ");
    brewery.phone = phoneArray.join("");
    setBreweryDetails(brewery);
  };
  useEffect(() => {
    fetchBreweryDetails(`https://api.openbrewerydb.org/breweries/${id}`);
  }, []);
  return (
    breweryDetails && (
      <main className="details-container">
        <div className="details-card">
          <div className="details-header">
            <h1>{breweryDetails.name}</h1>
          </div>

          <div className="details-content">
            <div className="detail">
              <p className="detail-strong">Address</p>
              <p className="detail-text">{`${breweryDetails.city}, ${breweryDetails.state} ${breweryDetails.postal_code}`}</p>
            </div>

            <div className="detail">
              <p className="detail-strong">Country</p>
              <p className="detail-text">{breweryDetails.country}</p>
            </div>

            <div className="detail">
              <p className="detail-strong">Phone Number</p>
              <p className="detail-text">{breweryDetails.phone}</p>
            </div>

            <div className="detail">
              <p className="detail-strong">Website</p>
              {breweryDetails.website_url !== null ? (
                <p>
                  <a
                    className="result-button"
                    href={breweryDetails.website_url}
                    target="_blank"
                  >
                    View Website
                  </a>
                </p>
              ) : (
                <p className="detail-text">No Website Available</p>
              )}
            </div>
          </div>
          <Link className="details-button" to="/breweries">
            Back to Breweries
          </Link>
        </div>
      </main>
    )
  );
}
