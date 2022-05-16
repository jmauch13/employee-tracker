// load dependencies
const express = require('express')
const mysql = require('mysql2');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express()
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const cTable = require('console.table');

// creates connection to sql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BrodyRudyChaseBella13!',
    database: 'employee_tracker'
});

connection.connect(function(err) {
  if (err) throw err
  console.log("Connected as Id" + connection.threadId)
  options();
});

// Inquirer Prompts
function options() {
  inquirer
      .prompt({
          name: 'action',
          type: 'list',
          message: 'Welcome to our employee database! What would you like to do?',
          choices: [
                  'View all employees',
                  'View all departments',
                  'View all roles',
                  'Add an employee',
                  'Add a department',
                  'Add a role',
                  'Update employee role',
                  'Delete an employee',
                  'EXIT'
                  ]
          }).then(function (answer) {
              switch (answer.action) {
                  case 'View all employees':
                      viewEmployees();
                      break;
                  case 'View all departments':
                      viewDepartments();
                      break;
                  case 'View all roles':
                      viewRoles();
                      break;
                  case 'Add an employee':
                      addEmployee();
                      break;
                  case 'Add a department':
                      addDepartment();
                      break;
                  case 'Add a role':
                      addRole();
                      break;
                  case 'Update employee role':
                      updateRole();
                      break;
                  case 'Delete an employee':
                      deleteEmployee();
                      break;
                  case 'EXIT': 
                      exitApp();
                      break;
                  default:
                      break;
              }
      })
};

function viewEmployees() {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.department_name AS department, role.salary, employee.manager_id FROM employee
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    JOIN role ON role.id = employee.role_id
    JOIN department ON role.department_id = department.id
    ORDER BY department_id`
    , function (err, res) {
        if (err) return console.log(err);
        console.table(res);
        options();
    });
};


// view all departments in the database
function viewDepartments() {
  connection.query(`SELECT * FROM department`, function (err, res) {
    if (err) return console.log(err);
    console.table(res);
    options();
});
};

// view all roles in the database
function viewRoles() {
  connection.query(`SELECT * FROM role`, function (err, res) {
    if (err) return console.log(err);
    console.table(res);
    options();
});
};

// add an employee to the database
function addEmployee() {
  connection.query(`SELECT * FROM role`, function (err, results) {                       
    if (err) return console.log(err);

    inquirer
      .prompt([
        {
          name: 'f_Name',
          type: 'input',
          message: 'What is the employee\s first name?',
        },
        {
          name: 'l_Name',
          type: 'input',
          message: 'What is the employee\s last name?',
        },
        {
          name: 'jobTitle',
          type: 'list',
          message: 'What is the employee\s job title?',
          choices: ['Office Personel', 'Client Liason', 'Stenographer', 'Executive']
        },
      ])
      .then((response) => {
        // console.log(response);
        let newEmployee = {};
        for (let i = 0; i < results.length; i++) {
          if (results[i].title === response.jobTitle) {
            newEmployee = results[i];
          }
        }
        const { f_Name, l_Name } = response;
        connection.query(
          'INSERT INTO employee SET ? ',
          {
            first_name: f_Name,
            last_name: l_Name,
            role_id: newEmployee.id,
          },
          function (error) {
            if (error) throw error;
            console.log('Employee Added!');
            options();
          }
        );
      });
  });
}


// add a department to the database
function addDepartment() {
  connection.query(`SELECT * FROM department`, function (err, departments) {
    if (err) return console.log(err);
  
  inquirer.prompt([
    {
        type: 'input',
        name: 'newDepartment',
        message: 'Please provide the name of the new department.'
    }
]).then(function (data) {
    connection.query(`INSERT INTO department (department_name) VALUES (?)`, data.newDepartment, function (err, res) {
        if (err) return console.log(err);
      console.log('Department Added!');
      options();
    })
})
})
}


// add a role to the database
function addRole() {
  connection.query(`SELECT * FROM department`, function (err, departments) {
    if (err) return console.log(err);

    inquirer.prompt([
        {
            type: 'input',
            name: 'newRole',
            message: 'Please provide new role\'s title.'
        },
        {
            type: 'input',
            name: 'newSalary',
            message: 'Please provide the salary for this role.'
        },
        {
            type: 'list',
            name: 'deptId',
            message: 'Please choose the department in which to add the new role.',
            choices: departments.map(department =>
            ({
                name: department.name,
                value: department.id
            })
            )
        }
    ]).then(function (data) {
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [data.newRole, data.newSalary, data.deptId], function (err, res) {
            if (err) return console.log(err);
            console.log('Role Added!');
            console.table(res);
            options();
        })
    })
});
}

function updateRole() {
  connection.query(`SELECT * FROM employee`, function (err, name) {
      if (err) return console.log(err);

      inquirer.prompt([
          {
              type: 'list',
              name: 'empName',
              message: 'Please choose the name of the employee you would like to change.',
              choices: name.map(nRole =>
              ({
                  name: nRole.first_name + " " + nRole.last_name,
                  value: nRole.id
              }))
          },
          {
              type: 'input',
              name: 'empId',
              message: 'Please enter the ID that corresponds with the new role',
          }
      ]).then(function (data) {
          connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [data.empId, data.empName], function (err) {
              if (err) return console.log(err);
              options();
          })
      })
  })
}

//  delete an employee
function deleteEmployee() {
  connection.query(`SELECT * FROM employee`, function (err, res) {
    if (err) return console.log(err);

    inquirer.prompt([
      {
        type: 'list',
        name: 'delete',
        message: 'Choose an employee by last name to delete from database',
        choices: ['Smith', 'Johnson', 'Manning', 'Rogers', 'Qurshi', 'Mauch', 'White', 'Moran']
    }
    
    ]).then(function (data) {
    connection.query(`DELETE FROM  employee WHERE last_name = ?)`, [data.delete, function (err, res) {
        if (err) return console.log(err);
        console.log('Employee deleted!');
        console.table(res);
        options();
    }])
  })
})
}

// exit the app
function exitApp() {
  connection.end();
};