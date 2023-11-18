// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // Call the function to refresh and display city tables
  refreshCityTables();
});

// Function to update the city table with gas station data
function updateCityTable(city, records) {
  // Get the container element where city tables will be added
  var cityTableContainer = document.getElementById("cityTablesContainer");
  
  // Create a new table element for the city
  var cityTable = document.createElement("table");
  cityTable.classList.add("city-table");

  // Create table header
  var tableHeader = cityTable.createTHead();
  var headerRow = tableHeader.insertRow(0);

  // Create header cells with black text color
  var headerCell1 = headerRow.insertCell(0);
  headerCell1.innerHTML = "Gas Station";
  headerCell1.style.color = "black";
  headerCell1.style.background = "#f2f2f2";
  headerCell1.style.textAlign = "center";

  var headerCell2 = headerRow.insertCell(1);
  headerCell2.innerHTML = "Gasoline Type";
  headerCell2.style.color = "black";
  headerCell2.style.background = "#f2f2f2";
  headerCell2.style.textAlign = "center";
  
  var headerCell3 = headerRow.insertCell(2);
  headerCell3.innerHTML = "Price";
  headerCell3.style.color = "black";
  headerCell3.style.background = "#f2f2f2";
  headerCell3.style.textAlign = "center";


  // Create table body
  var tableBody = cityTable.createTBody();

  // Populate the table body with gas station data
  records.forEach(function (record) {
    var newRow = tableBody.insertRow(tableBody.length);

    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = record.gasstation;

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = record.gasoline;

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = record.price;
  });

  // Create a wrapper for the city table, including a heading with the city name
  var cityTableWrapper = document.createElement("div");
  cityTableWrapper.classList.add("city-table-wrapper");
  cityTableWrapper.innerHTML = `<h2>${city}</h2>`;
  cityTableWrapper.appendChild(cityTable);

  // Add the city table wrapper to the container
  cityTableContainer.appendChild(cityTableWrapper);
  cityTableContainer.style.textAlign = "center";
}

// Function to fetch gas station data and update city tables
function refreshCityTables() {
  // Fetch gas station data from the server
  fetch('http://localhost:5005/gas/all')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Extract unique city names from the data
      var cities = [...new Set(data.map(record => record.cities))];
      cities.sort(); // Sort city names alphabetically

      // Iterate through each city and update the corresponding table
      cities.forEach(city => {
        // Filter data for the current city
        var cityData = data.filter(record => record.cities === city);
        // Update the city table with the filtered data
        updateCityTable(city, cityData);
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
