document.addEventListener("DOMContentLoaded", function () {
  refreshTable();
});

var selectedRow = null;

// Handle the form submission
document.getElementById("GasForm").addEventListener("submit", function (event) {
  event.preventDefault();
  onFormSubmit();
});

// Handle form submission for creating and updating records
function onFormSubmit() {
  console.log("Form submitted!");
  if (validate()) {
      var formData = readFormData();
      if (selectedRow === null) {
          insertNewRecord(formData);
      } else {
          updateRecord(formData);
      }
      resetForm();
  }
}

// Read form data
function readFormData() {
  var formData = {};
  formData["cities"] = document.getElementById("cities").value;
  formData["gasstation"] = document.getElementById("gasstation").value;
  formData["gasoline"] = document.getElementById("gasoline").value;
  formData["price"] = document.getElementById("price").value;
  return formData;
}

// Insert new record
function insertNewRecord(data) {
  fetch('http://localhost:5001/gas/create', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log('Raw Response:', response); // Log the entire response
      return response.text(); // Change to response.text()
    })
    .then(data => {
      console.log('Server Response:', data); // Log the parsed text response
      refreshTable(); // Refresh the table after successful insertion
    })
    .catch(error => {
      console.log('Error:', error);
    });
}


// Reset the form
function resetForm() {
  document.getElementById("GasForm").reset();
  selectedRow = null;
}

// Edit the record
function onEdit(td) {
  selectedRow = td.parentElement.parentElement;
  document.getElementById("cities").value = selectedRow.cells[0].innerHTML;
  document.getElementById("gasstation").value = selectedRow.cells[1].innerHTML;
  document.getElementById("gasoline").value = selectedRow.cells[2].innerHTML;
  document.getElementById("price").value = selectedRow.cells[3].innerHTML;
}

function updateRecord(formData) {
  var recordId = selectedRow.cells[4].getAttribute("data-id");

  fetch(`http://localhost:5001/gas/update/${recordId}`, {
    method: 'PUT',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.text()) // Change to response.text()
    .then(data => {
      console.log(data); // Log the entire response
      refreshTable();
    })
    .catch(error => {
      console.log(error);
    });
}

// Delete the record
function onDelete(td) {
  if (confirm('Are you sure to delete this record?')) {
      // Assuming you have a unique identifier for each record, replace 'your_id' with the actual ID
      var recordId = td.parentElement.parentElement.cells[4].getAttribute("data-id");

      fetch(`http://localhost:5001/gas/delete/${recordId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      }).then(response => {
          refreshTable();
      }).catch(error => {
          console.log(error);
      });

      resetForm();
  }
}

// Function to validate form inputs
function validate() {
  var isValid = true;
  var cities = document.getElementById("cities").value;
  var citiesField = document.getElementById("cities");

  if (cities === "") {
    isValid = false;
    document.getElementById("citiesValidationError").classList.remove("hide");
    citiesField.classList.add("error-input");
  } else {
    document.getElementById("citiesValidationError").classList.add("hide");
    citiesField.classList.remove("error-input");
  }

  return isValid;
}


// Function to update the table with existing records
function updateUIWithRecords(records) {
  var tableBody = document.getElementById("GasTableBody");

  records.forEach(function (record) {
    var newRow = tableBody.insertRow(tableBody.length);

    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = record.cities;

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = record.gasstation;

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = record.gasoline;

    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = record.price;

    var cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<a href="#" onclick="onEdit(this)">Edit</a>
                       <a href="#" onclick="onDelete(this)">Delete</a>`;
    cell5.setAttribute("data-id", record.id);
  });
}

// Function to refresh the table with the latest data
function refreshTable() {
  fetch('http://localhost:5001/gas/all')
    .then(response => response.json())
    .then(data => {
      var tableBody = document.getElementById("GasTableBody");
      tableBody.innerHTML = ''; // Clear existing rows

      updateUIWithRecords(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
