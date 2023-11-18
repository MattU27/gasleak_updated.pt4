document.addEventListener("DOMContentLoaded", function () {
  // Initial table refresh on page load
  refreshTable();

  // Variable to keep track of the selected row for editing
  var selectedRow = null;

  // Event listener for form submission
  document.getElementById("GasForm").addEventListener("submit", function (event) {
    event.preventDefault();
    onFormSubmit();
  });

  // Function to handle form submission
  function onFormSubmit() {
    // Validate form data before processing
    if (validate()) {
      var formData = readFormData();
      // Check if a row is selected for editing
      if (selectedRow === null) {
        // If no row is selected, create a new record
        createRecord(formData);
      } else {
        // If a row is selected, update the existing record
        updateRecord(formData);
      }
      // Reset the form after submission
      resetForm();
    }
  }

  // Function to read form data and return as an object
  function readFormData() {
    return {
      cities: document.getElementById("cities").value,
      gasstation: document.getElementById("gasstation").value,
      gasoline: document.getElementById("gasoline").value,
      price: document.getElementById("price").value
    };
  }

  // Function to create a new record
  function createRecord(data) {
    // Fetch API call to send data to the server and update UI
    fetch('http://localhost:5001/gas/create', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Server Response:', data);
        // Refresh the table after creating a new record
        refreshTable();
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  // Function to reset the form and selectedRow variable
  function resetForm() {
    document.getElementById("GasForm").reset();
    selectedRow = null;
  }

  // Function to populate form fields for editing
  function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("cities").value = selectedRow.cells[0].innerHTML;
    document.getElementById("gasstation").value = selectedRow.cells[1].innerHTML;
    document.getElementById("gasoline").value = selectedRow.cells[2].innerHTML;
    document.getElementById("price").value = selectedRow.cells[3].innerHTML;
  }

  // Function to update an existing record
  function updateRecord(formData) {
    // Get the record ID from the selected row
    var recordId = selectedRow.cells[4].getAttribute("data-id");

    // Fetch API call to update the record on the server and refresh the table
    fetch(`http://localhost:5001/gas/update/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Refresh the table after updating the record
        refreshTable();
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Function to handle record deletion
  function onDelete(td) {
    // Confirm deletion with the user
    if (confirm('Are you sure to delete this record?')) {
      // Get the record ID from the selected row
      var recordId = td.parentElement.parentElement.cells[4].getAttribute("data-id");

      // Fetch API call to delete the record on the server and refresh the table
      fetch(`http://localhost:5001/gas/delete/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          refreshTable();
        })
        .catch(error => {
          console.log(error);
        });

      // Reset the form after deletion
      resetForm();
    }
  }

  // Function to validate form data
  function validate() {
    var cities = document.getElementById("cities").value;
    if (cities === "") {
      // Show validation error if the "Cities" field is empty
      document.getElementById("citiesValidationError").classList.remove("hide");
      return false;
    } else {
      // Hide validation error if the "Cities" field is not empty
      document.getElementById("citiesValidationError").classList.add("hide");
      return true;
    }
  }

  // Function to update the UI with records from the server
  function updateUIWithRecords(records) {
    var tableBody = document.getElementById("GasTableBody");
    tableBody.innerHTML = '';

    records.forEach(function (record) {
      var newRow = tableBody.insertRow(tableBody.length);

      // Insert record data into table cells
      for (let i = 0; i < 4; i++) {
        var cell = newRow.insertCell(i);
        cell.innerHTML = record[Object.keys(record)[i]];
      }

      // Add "Edit" and "Delete" links with data-id attribute
      var cell5 = newRow.insertCell(4);
      cell5.innerHTML = `<a href="#" onclick="onEdit(this)">Edit</a>
                         <a href="#" onclick="onDelete(this)">Delete</a>`;
      cell5.setAttribute("data-id", record.id);
    });
  }

  // Function to refresh the table with data from the server
  function refreshTable() {
    fetch('http://localhost:5001/gas/all')
      .then(response => response.json())
      .then(data => {
        // Update the UI with records from the server
        updateUIWithRecords(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
});
