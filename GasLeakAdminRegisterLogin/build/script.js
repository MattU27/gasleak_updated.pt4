document.addEventListener("DOMContentLoaded", function () {
    refreshTable();
});

var selectedRow = null;
var selectedID = null;

//Handle the submit button for submitting
function onFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        if (selectedRow == null)
            insertNewRecord(formData);
        else
            updateRecord(formData, selectedID);
        resetForm();
    }
}

//Read the data from UI
function readFormData() {
    var formData = {};
    formData["fullName"] = document.getElementById("fullName").value;
    formData["email"] = document.getElementById("email").value;
    formData["adminId"] = document.getElementById("adminId").value;
    formData["password"] = document.getElementById("password").value;
    return formData;
}

//Insert new data to the database
function insertNewRecord(data) {
    fetch('http://localhost:5000/user/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        refreshTable();
    }).catch(error => {
        console.log(error);
    });
}

//Reset the form upon submitting or editting
function resetForm() {
    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("adminId").value = "";
    document.getElementById("password").value = "";
    selectedRow = null;
    selectedID = null;
}

//Edit the data
function onEdit(td, _id) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("fullName").value = selectedRow.cells[0].innerHTML;
    document.getElementById("email").value = selectedRow.cells[1].innerHTML;
    document.getElementById("adminId").value = selectedRow.cells[2].innerHTML;
    document.getElementById("password").value = selectedRow.cells[3].innerHTML;
    selectedID = _id;
}

//Handles the update function to the database
function updateRecord(formData, userID) {
    fetch('http://localhost:5000/user/update/' + userID, {
        method: 'PUT',
        body: JSON.stringify(formData),
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

//Handles the delete function to the database
function onDelete(userID) {
    if (confirm('Are you sure to delete this record ?')) {
        fetch('http://localhost:5000/user/' + userID, {
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

//Handles validation of inputs
function validate() {
    isValid = true;
    if (document.getElementById("fullName").value == "") {
        isValid = false;
        document.getElementById("fullNameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
            document.getElementById("fullNameValidationError").classList.add("hide");
    }
    return isValid;
}

// Function to update the UI with existing records (e.g., after a GET request)
function updateUIWithRecords(records) {
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear existing rows
    
    records.forEach(function(record) {
        var newRow = table.insertRow(table.length);

        var cell1 = newRow.insertCell(0);
        cell1.innerHTML = record.fullName;

        var cell2 = newRow.insertCell(1);
        cell2.innerHTML = record.email;

        var cell3 = newRow.insertCell(2);
        cell3.innerHTML = record.adminId;

        var cell4 = newRow.insertCell(3);
        cell4.innerHTML = record.password;

        var cell5 = newRow.insertCell(4);
        cell5.innerHTML = `<a class="edit-link" onClick="onEdit(this, '${record._id}')">Edit</a>
                           <a class="delete-link" onClick="onDelete('${record._id}')">Delete</a>`;

    });
}

//Refresh the table upon inputting, updating and deleting
function refreshTable() {
    // Clear the existing table rows
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    // Fetch the latest data from the backend (GET request)
    fetch('http://localhost:5000/user/')
        .then(response => response.json())
        .then(data => {
            // Update the UI with the retrieved records
            updateUIWithRecords(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}