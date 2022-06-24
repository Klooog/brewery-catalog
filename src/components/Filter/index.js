import { useState, useRef } from "react";

const Filter = ({
  initialBreweries,
  stateFilter,
  breweryTypeFilter,
  filterSettings,
}) => {
  const [stateSelected, setStateSelected] = useState(false);
  const [citySelected, setCitySelected] = useState(false);
  const [breweryTypeSelected, setBreweryTypeSelected] = useState(false);

  const citySelectRef = useRef();
  const getCityOptions = () => {
    let cityOptions = [];
    initialBreweries.map((breweryData) => {
      cityOptions.push({ city: breweryData.city, state: breweryData.state });
    });
    cityOptions = cityOptions.filter((option) => option.state === stateFilter);
    console.log(cityOptions);
    return [...new Set(cityOptions.map((breweryData) => breweryData.city))];
  };

  let cityOptions = [];
  if (stateFilter !== "All") {
    cityOptions = getCityOptions();
  }
  const getStateOptions = [
    ...new Set(initialBreweries.map((breweryData) => breweryData.state)),
  ];

  const getTypeOptions = [
    ...new Set(
      initialBreweries.map(
        (breweryData) =>
          breweryData.brewery_type.charAt(0).toUpperCase() +
          breweryData.brewery_type.slice(1)
      )
    ),
  ];

  const filterData = (type, selection) => {
    switch (type) {
      case "state":
        if (selection === "All") {
          setStateSelected(false);
          setCitySelected(false);
        } else {
          setStateSelected(true);
        }

        break;
      case "city":
        if (selection === "All") {
          setCitySelected(false);
          citySelectRef.current.value = "All";
        } else {
          setCitySelected(true);
        }
        break;
      case "breweryType":
        if (selection === "All") {
          setBreweryTypeSelected(false);
        } else {
          setBreweryTypeSelected(true);
        }
        break;
      case "clearFilter":
        setStateSelected(false);
        setCitySelected(false);
        setBreweryTypeSelected(false);
        break;
    }
    filterSettings(type, selection);
  };
  return (
    <div className="filter-container">
      <div className="select-container">
        <label htmlFor="stateSelect">State:</label>
        <select
          value={stateFilter}
          name="stateSelect"
          id="stateSelect"
          onChange={(e) => filterData("state", e.target.value)}
        >
          <option value="All">All</option>
          {getStateOptions.map((stateOption) => (
            <option key={stateOption} value={stateOption}>
              {stateOption}
            </option>
          ))}
        </select>
        {stateSelected && (
          <button
            className="clear-button"
            onClick={() => filterData("state", "All")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      {cityOptions.length !== 0 && (
        <div className="select-container">
          <label htmlFor="citySelect">City:</label>
          <select
            id="citySelect"
            name="citySelect"
            ref={citySelectRef}
            onChange={(e) => filterData("city", e.target.value)}
          >
            <option value="All">All</option>
            {cityOptions.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption}
              </option>
            ))}
          </select>

          {citySelected && (
            <button
              className="clear-button"
              onClick={() => filterData("city", "All")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="select-container">
        <label htmlFor="breweryTypeSelect">Brewery Type:</label>
        <select
          value={breweryTypeFilter}
          id="breweryTypeSelect"
          name="breweryTypeSelect"
          onChange={(e) => filterData("breweryType", e.target.value)}
        >
          <option value="All">All</option>
          {getTypeOptions.map((typeOption) => (
            <option key={typeOption} value={typeOption}>
              {typeOption}
            </option>
          ))}
        </select>
        {breweryTypeSelected && (
          <button
            className="clear-button"
            onClick={() => filterData("breweryType", "All")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <button
        className="clear-filter-button"
        onClick={() => filterData("clearFilter")}
      >
        Clear All
      </button>
    </div>
  );
};

export default Filter;
