const express = require('express');
const mysql = require('mysql');
/*const {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUsers,
} = require('./controller');*/

const router = express();
// MySQL
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'users'
});
   
// Get all users
router.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from users', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
        })
    })
});

// Get a user
router.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM users WHERE _id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from users table are: \n', rows)
        })
    })
});

// Delete a user
router.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM users WHERE _id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Users with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from users table are: \n', rows)
        })
    })
});

// Add user
router.post('/create', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        const params = req.body;
        connection.query('INSERT INTO users SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`User with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from user table are: \n', rows)

        })
    })
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, rows) => {
            connection.release();
            if (!err) {
                if (rows.length > 0) {
                    res.status(200).json({ message: 'Login successful' });
                } else {
                    res.status(401).json({ message: 'Invalid email or password' });
                }
            } else {
                console.log(err);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    });
});

router.put('/update/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const id = req.params.id;
        const {fullName, email, adminId, password } = req.body;
        connection.query('UPDATE users SET fullName = ?, email = ?, adminId = ?, password = ? WHERE _id = ?', [fullName, email, adminId, password, id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`Users with the name: ${fullName} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    });
});

module.exports = router;