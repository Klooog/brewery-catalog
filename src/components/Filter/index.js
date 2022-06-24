import React from "react";

const Filter = ({
  initialBreweries,
  stateFilter,
  breweryTypeFilter,
  filterSettings,
}) => {
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
    filterSettings(type, selection);
  };
  return (
    <div>
      <select
        value={stateFilter}
        onChange={(e) => filterData("state", e.target.value)}
      >
        <option value="All">All</option>
        {getStateOptions.map((stateOption) => (
          <option key={stateOption} value={stateOption}>
            {stateOption}
          </option>
        ))}
      </select>
      {cityOptions.length !== 0 && (
        <select onChange={(e) => filterData("city", e.target.value)}>
          <option value="All">All</option>
          {cityOptions.map((cityOption) => (
            <option key={cityOption} value={cityOption}>
              {cityOption}
            </option>
          ))}
        </select>
      )}
      <select
        value={breweryTypeFilter}
        id=""
        onChange={(e) => filterData("breweryType", e.target.value)}
      >
        <option value="All">All</option>
        {getTypeOptions.map((typeOption) => (
          <option key={typeOption} value={typeOption}>
            {typeOption}
          </option>
        ))}
      </select>
      <button onClick={() => filterData("clearFilter")}>Clear Filters</button>
    </div>
  );
};

export default Filter;
