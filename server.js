const db = require('./db/connection');
const inquirer = require("inquirer")
const PORT = process.env.PORT || 3001;
const cTable = require("console.table");
// Formula Variables ----------------
const taskChosen = []


// Database/Server Fun -------------

db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
});


// Progran to make it all happen ------------
initApp(); 

function initApp() {
  empTrackPrg();
  startMenu();
};


function empTrackPrg() {
  console.log("                            ")
  console.log(" __________________________ ")
  console.log("|                          |")
  console.log("|                          |")
  console.log("|     EMPLOYEE MANAGER     |")
  console.log("|                          |")
  console.log("|__________________________|")
  console.log("                            ")

};


function startMenu() {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "View Departments",
        "View Roles",
        "View Employees",
        "Add Departments",
        "Add Roles",
        "Add Employee",
        "Update Employee Role"
      ]
    }
  ]).then(function (val) {
    switch (val.choice) {
      case "View Departments":
        viewDepartments();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "View Employees":
        viewEmployees();
        break;
      case "Add Departments":
        addDepartment();
        break;
      case "Add Roles":
        addRoles()
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployee();
        break;
    }
  })
}

function viewDepartments() {
  db.query("SELECT department.dptname AS Department, department.id AS Department_ID FROM department",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startMenu()
    })
}

function viewRoles() {
  db.query(
    "SELECT employee.first_name as First_Name, employee.last_name as Last_Name, roles.title AS Role, CONCAT(' $', format(roles.salary, 2)) as Salary, roles.id AS Role_ID FROM employee  JOIN roles ON employee.role_id = roles.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startMenu()
    })
}

function viewEmployees() {
  db.query(
    "SELECT employee.first_name as First_Name, employee.last_name as Last_Name, roles.title as Role, CONCAT(' $', format(roles.salary, 2)) as Salary, department.dptname as Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN roles on roles.id = employee.role_id INNER JOIN department on department.id = roles.department_id left join employee e on employee.manager_id = e.id",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startMenu()
    })
}



