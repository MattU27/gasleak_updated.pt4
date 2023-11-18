// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

// Create an instance of Express
const app = express();

// Define the port number for the server to listen on
const port = 5005;

// Middleware setup for handling CORS and parsing JSON data
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database Connection Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  
  database: 'gasleak',
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    // Log an error message if there's an issue with the database connection
    console.log('\n╔═══════════════════════════╗');
    console.log('║ MySQL connection error:  ║', err);
    console.log('╚═══════════════════════════╝\n');
  } else {
    // Log a success message if the database connection is successful
    console.log('\n╔════════════════════════════════╗');
    console.log(`║       GasLeakNormal/Home       ║`);
    console.log('║   Connected to MySQL database  ║'); 
    console.log('╚════════════════════════════════╝\n');
  }
});

// Define an endpoint to retrieve all gas data
app.get('/gas/all', (req, res) => {
  const selectAllQuery = 'SELECT * FROM gas';

  // Execute the SQL query to fetch all data from the 'gas' table
  db.query(selectAllQuery, (err, result) => {
    if (err) {
      // Log an error if there's an issue fetching data from the database
      console.log('Error fetching data:', err);
      res.status(500).send({ error: 'Error fetching data' });
    } else {
      // Send the fetched data as a JSON response if successful
      res.status(200).json(result);
    }
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log('\n╔══════════════════════════════╗');
  console.log(`║      GasLeakNormal/Home      ║`);
  console.log(`║    Listening on port ${port}    ║`);
  console.log('╚══════════════════════════════╝\n');
});
