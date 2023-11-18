const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  
  database: 'gasleak',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║              MySQL Connection Error:                      ║');
    console.log(`║              ${err}              ║`);
    console.log('╚════════════════════════════════════════════════════════╝');
  } else {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                 GasLeakAdminDashBoard                  ║');
    console.log('║              Connected to MySQL database               ║');
    console.log('╚════════════════════════════════════════════════════════╝');
  }
});


// Create table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS gas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cities VARCHAR(255) NOT NULL,
    gasstation VARCHAR(255) NOT NULL,
    gasoline VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL
  )
`;

// Execute MySQL query to create a table
db.query(createTableQuery, (err, result) => {
  if (err) {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                Error creating table:                    ║');
    console.log(`║                ${err}                         ║`);
    console.log('╚════════════════════════════════════════════════════════╝');
  } else {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║              GasLeakAdminDashboard/Table               ║');
    console.log('║            Table created or already exists             ║');
    console.log('╚════════════════════════════════════════════════════════╝');
  }
});

// API endpoints
app.get('/gas/all', (req, res) => {
  const selectAllQuery = 'SELECT * FROM gas';

  db.query(selectAllQuery, (err, result) => {
    if (err) {
      console.log('Error fetching data:', err);
      res.status(500).send({ error: 'Error fetching data' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Create endpoint
app.post('/gas/create', (req, res) => {
  const { cities, gasstation, gasoline, price } = req.body;
  const insertQuery = 'INSERT INTO gas (cities, gasstation, gasoline, price) VALUES (?, ?, ?, ?)';
  const values = [cities, gasstation, gasoline, price];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║                 Error inserting data:                   ║');
      console.log(`║                 ${err}                ║`);
      console.log('╚════════════════════════════════════════════════════════╝\n');
      res.status(500).send({ error: 'Error inserting data' });
    } else {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║            Record added successfully                   ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      res.status(201).send('Record added successfully');
    }
  });
});

// Update endpoint
app.put('/gas/update/:id', (req, res) => {
  const recordId = req.params.id;
  const { cities, gasstation, gasoline, price } = req.body;
  const updateQuery = 'UPDATE gas SET cities=?, gasstation=?, gasoline=?, price=? WHERE id=?';
  const values = [cities, gasstation, gasoline, price, recordId];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║               Error updating record:                   ║');
      console.log(`║               ${err}                ║`);
      console.log('╚════════════════════════════════════════════════════════╝\n');
      res.status(500).send({ error: 'Error updating record' });
    } else {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║           Record updated successfully                   ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      res.status(200).send('Record updated successfully');
    }
  });
});

// Delete endpoint
app.delete('/gas/delete/:id', (req, res) => {
  const recordId = req.params.id;
  const deleteQuery = 'DELETE FROM gas WHERE id=?';

  db.query(deleteQuery, [recordId], (err, result) => {
    if (err) {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║               Error deleting record:                   ║');
      console.log(`║               ${err}                ║`);
      console.log('╚════════════════════════════════════════════════════════╝\n');
      res.status(500).send({ error: 'Error deleting record' });
    } else {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║          Record deleted successfully                     ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      res.status(200).send('Record deleted successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`\n\n╔══════════════════════════╗`);
  console.log(`║  GasLeakAdminDashboard   ║`);
  console.log(`║  Listening on port ${port}  ║`);
  console.log(`╚══════════════════════════╝`);
});
