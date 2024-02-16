const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express(); // Runs the server
const port = 3000;
const mysql = require('mysql2'); // Connects to the database
const { filter } = require('rxjs');
const { log } = require('@angular-devkit/build-angular/src/builders/ssr-dev-server');
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'git clone https://github.com/WDCAP2-EmployeeProfiling/employee-profiling-hub',
    user: 'root',
    password: '',
    database: 'profiling',
});

db.connect((err) => { // Function that connects to the database
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Read
app.post('/read', (req, res) => {

    const emp_ID = req.body.emp_ID;
    const page = req.body.page;
    // expects_Array means if the request expects many values that will be looped in the front end.
    expects_Array = false;

    var sql = 'SELECT * FROM ';
    // Check which page to display; grabs option from front end then selects respective table
    switch (page) {
        case 'employeeinfo':
            sql += `tbl_info`; //DONE
            break;
        case 'certification':
            sql += `tbl_certification`; //DONE
            expects_Array = true;
            break;
        case 'dependencies':
            sql += `tbl_dependencies`; //WIP
            expects_Array = true;
            break;
        case 'organizations':
            sql += `tbl_org`;
            expects_Array = true;
            break;
        case 'accountingdetails':
            sql += `tbl_accounting_details`; //DONE
            break;
        case 'education':
            sql += `tbl_education`; //DONE
            break;
        case 'teachingloads':
            sql += `tbl_teaching_loads`;
            expects_Array = true;
            break;
        case 'workexperience':
            sql += `tbl_experience`;
            expects_Array = true;
            break;
        case 'employeedetails': //DONE
            sql += `tbl_details`;
            break;
        case 'skills':
            sql += `tbl_skills`;
            expects_Array = true;
            break;
        // Contact
        case 'personalcontact': //DONE
            sql += `tbl_personal_contact`;
            break;
        case 'provincialcontact':
            sql += `tbl_provincial_contact`;
            expects_Array = true;
            break;
        case 'emergency': //DONE
            sql += `tbl_emergency`;
            break;
        default:
            console.log('Unknown Error');
    }
    sql += ` WHERE emp_ID = ${emp_ID}`

    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error:", error);
            res.status(500).send("Internal Server Error");
        } else {
            if (expects_Array == false) {
                // if the display only needs one entry
                res.send(result[0]);
            }
            else if (expects_Array == true) {
                // if the display needs multiple entries, loopable
                res.send(result);
            }
        }
    });
});

// Read Item ID
// This code is used for accessing an individual item of an array aka loopable component
app.post('/readItem', (req, res) => {

    const item_ID = req.body.item_ID;
    const table_primary_key = req.body.table_primary_key;
    const page = req.body.page;
    // expects_Array means if the request expects many values that will be looped in the front end.

    var sql = 'SELECT * FROM ';
    // Check which page to display; grabs option from front end then selects respective table
    switch (page) {
        case 'dependencies':
            sql += `tbl_dependencies`;
            break;
        case 'certification':
            sql += `tbl_certification`;
            break;
        case 'organizations':
            sql += `tbl_org`;
            break;
        case 'teachingloads':
            sql += `tbl_teaching_loads`;
            break;
        case 'workexperience':
            sql += `tbl_experience`;
            break;
        case 'skills':
            sql += `tbl_skills`;
            break;
        // Contact
        case 'provincialcontact':
            sql += `tbl_provincial_contact`;
            break;
        default:
            console.log('Unknown Error');
    }
    sql += ` WHERE ${table_primary_key} = ${item_ID}`


    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error:", error);
            res.status(500).send("Internal Server Error");
        } else {
            res.send(result[0]);
        }
    });
});

// Get All Employees, relevant for Admins
app.get('/getAllEmployees/:department', (req, res) => {
    const department = req.params.department;
    departmentCheck = '' // Used for sql query

    switch (department) {
        case 'SBA':
            departmentCheck = 'School of Business and Accountancy'
            break;
        case 'SEA':
            departmentCheck = 'School of Engineering and Architecture'
            break;
        case 'SAS':
            departmentCheck = 'School of Arts and Sciences'
            break;
        case 'SOE':
            departmentCheck = 'School of Education'
            break;
        case 'SHTM':
            departmentCheck = 'School of Hospitality and Tourism Management'
            break;
        case 'SNAMS':
            departmentCheck = 'School of Nursing and Allied Medical Sciences'
            break;
        case 'SOC':
            departmentCheck = 'School of Computing'
            break;
        case 'CCJF':
            departmentCheck = 'College of Criminal Justice Education and Forsenics'
            break;
        default:
            console.log('Unknown Error');
    }



    var sql = `
        SELECT *
        FROM tbl_login
        WHERE emp_ID IN (
            SELECT emp_ID
            FROM tbl_details `;

    if (department != "HRADMIN")
        sql += `WHERE department='${departmentCheck}'`;
    sql += `)`;

    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error:", error);
            res.status(500).send("Internal Server Error");
        } else {
            res.send(result);
        }
    });
});

// Login
app.post('/login', (req, res) => {

    const emp_ID = req.body.emp_ID;
    const password = req.body.password;

    var sql = `SELECT * FROM tbl_login WHERE emp_ID = '${emp_ID}' AND password = '${password}'`;

    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error:", error);
            // Handle database errors
            res.status(500).send("Database error");
        } else {
            // Check if user is found
            if (result.length > 0) {
                res.json({ message: "User Found" });
            } else {
                // Handle case where user is not found
                res.status(404).send("User not found");
            }
        }
    });
});

// Update or Add Values
app.put('/update', (req, res) => {
    const updateBody = req.body;

    // Code relevant to commas in sql query
    let keyCount = Object.keys(updateBody).length;
    let currentKeyIndex = 0;

    // updateBody.tbl will declare which table ot edit
    var sql = `
    UPDATE ${updateBody.tbl} SET `
    for (let key in updateBody) {
        // Loop through all items of a given table
        if (updateBody.hasOwnProperty(key)) {
            currentKeyIndex++;
            // Skips the table declaration
            if (key === 'tbl') {
                continue;
            }
            // Skips the emp_ID declaration
            if (key === 'emp_ID') {
                continue;
            }
            const value = updateBody[key];
            sql += `${key} = `

            if (typeof value === 'string') {
                sql += `'${value}'`
            } else if (typeof value === 'number' && Number.isInteger(value)) {
                sql += `${value}`
            }
            // Code to check if its the last value, if it is, then no comma
            if (currentKeyIndex < keyCount) {
                sql += ', ';
            }
        }
    }

    sql += ` WHERE emp_ID = ${req.body.emp_ID}`;

    console.log(sql)

    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error:", error);
            // Handle database errors
            res.status(500).send("Error Updating");
        } else {
            console.log(`Updating of ${updateBody.tbl} Success`);
            res.json({ message: `Updating of ${updateBody.tbl} Success` });

        }
    });

})

// Update or Add Values, this one is relevant for one-to-many
app.put('/updateItem', (req, res) => {
    const updateBody = req.body;
    const table_primary_key = req.body.table_primary_key;

    
    // Code relevant to commas in sql query
    let keyCount = Object.keys(updateBody).length;
    let currentKeyIndex = 0;

    if (req.body.mode === 'edit') {
        // updateBody.tbl will declare which table to edit
        var sql = `UPDATE ${updateBody.tbl} SET `
        for (let key in updateBody) {
            // Loop through all items of a given table
            if (updateBody.hasOwnProperty(key)) {
                currentKeyIndex++;
                // Skips the declarations
                if (key === 'tbl' || key === 'item_ID' || key === 'mode' || key === 'table_primary_key') {
                    continue;
                }

                const value = updateBody[key];
                sql += `${key} = `

                if (typeof value === 'string') {
                    sql += `'${value}'`
                } else if (typeof value === 'number' && Number.isInteger(value)) {
                    sql += `${value}`
                }
                // Code to check if its the last value, if it is, then no comma
                if (currentKeyIndex < keyCount) {
                    sql += ', ';
                }
            }
        }
        sql += ` WHERE ${table_primary_key} = ${req.body.item_ID}`;
    }
    else if (req.body.mode === 'add') {
        var sql = `INSERT INTO ${updateBody.tbl} (`
        for (let key in updateBody) {
            currentKeyIndex++;
            // Skips declarations
            if (key === 'tbl' || key === 'item_ID' || key === 'table_primary_key' || key === 'mode') {
                continue;
            }
            sql += `${key}`
            if (currentKeyIndex < keyCount) {
                sql += ', ';
            }
        }
        currentKeyIndex = 0;
        sql += ') VALUES (';
        for (let key in updateBody) {
            currentKeyIndex++;
            // Skips declarations
            if (key === 'tbl' || key === 'item_ID' || key === 'table_primary_key' || key === 'mode') {
                continue;
            }
            const value = updateBody[key];
            sql += `'${value}'`
            if (currentKeyIndex < keyCount) {
                sql += ', ';
            }
        }
        sql += `)`
    }

    console.log(sql)

    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error:", error);
            // Handle database errors
            res.status(500).send("Error Updating");
        } else {
            console.log(`Updating of ${updateBody.tbl} Success`);
            res.json({ message: `Updating of ${updateBody.tbl} Success` });
        }
    });

})

// Delete Values
app.put('/delete', (req, res) => {
    const updateBody = req.body;

    // Code relevant to commas in sql query
    let keyCount = Object.keys(updateBody).length;
    let currentKeyIndex = 0;

    // updateBody.tbl will declare which table ot edit
    var sql = `
    UPDATE ${updateBody.tbl} SET `
    for (let key in updateBody) {
        // Loop through all items of a given table
        if (updateBody.hasOwnProperty(key)) {
            currentKeyIndex++;
            // Skips the table declaration
            if (key === 'tbl') {
                continue;
            }
            // Skips the emp_ID declaration
            if (key === 'emp_ID') {
                continue;
            }
            const value = updateBody[key];
            sql += `${key} = NULL`
            // Code to check if its the last value, if it is, then no comma
            if (currentKeyIndex < keyCount) {
                sql += ', ';
            }

        }
    }

    sql += ` WHERE emp_ID = ${req.body.emp_ID}`;

    console.log(sql)

    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error:", error);
            // Handle database errors
            res.status(500).send("Error Deleting");
        } else {
            console.log(`Deleting of ${updateBody.tbl} Success`);
            res.json({ message: `Deleting of ${updateBody.tbl} Success` });

        }
    });

})

// Delete Item
// This code is used for deleting an individual item of an array aka loopable component
app.post('/deleteItem', (req, res) => {
    const item_ID = req.body.item_ID;
    const table_primary_key = req.body.table_primary_key;
    const updateBody = req.body;

    sql = `DELETE FROM ${updateBody.tbl}
    WHERE ${table_primary_key} = ${item_ID}`;

    console.log(sql)

    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error:", error);
            // Handle database errors
            res.status(500).send("Error Deleting");
        } else {
            console.log(`Deleting of ${updateBody.tbl} Success`);
            res.json({ message: `Deleting of ${updateBody.tbl} Success` });

        }
    });
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});