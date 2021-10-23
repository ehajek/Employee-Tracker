const db = require('./db/connection');
const inquirer = require("inquirer")
const PORT = process.env.PORT || 3001;
const cTable = require("console.table");
// Formula Variables ----------------



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

// Main Menu ------------------

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

// Main Queries -------------

function viewDepartments() {
  db.query("SELECT department.dptname AS Department, department.id AS Department_ID FROM department",
    function (err, response) {
      if (err) throw err
      console.table(response)
      startMenu()
    })
}

function viewRoles() {
  db.query(
    "SELECT employee.first_name as First_Name, employee.last_name as Last_Name, roles.title AS Role, CONCAT(' $', format(roles.salary, 2)) as Salary, roles.id AS Role_ID FROM employee  JOIN roles ON employee.role_id = roles.id;",
    function (err, response) {
      if (err) throw err
      console.table(response)
      startMenu()
    })
}

function viewEmployees() {
  db.query(
    "SELECT employee.first_name as First_Name, employee.last_name as Last_Name, roles.title as Role, CONCAT(' $', format(roles.salary, 2)) as Salary, department.dptname as Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN roles on roles.id = employee.role_id INNER JOIN department on department.id = roles.department_id left join employee e on employee.manager_id = e.id",
    function (err, response) {
      if (err) throw err
      console.table(response)
      startMenu()
    })
}
// Functions that do stuff -----------
function addDepartment() {
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "New department name?"
    }
  ]).then(function (response) {
    var query = db.query(
      "INSERT INTO department SET ? ",
      { dptname: response.name },
      function (err) {
        if (err) throw err
        console.table(response);
        viewDepartments();
        startMenu();
      }
    )
  })
}


// Selecting Functions ----------------

function selectRole() {
  let taskChosen = []
  db.query("SELECT * FROM roles",
    function (err, response) {
      if (err) throw err
      for (var i = 0; i < response.length; i++) {
        taskChosen.push(response[i].title);
      }

    })

  return taskChosen;
}

function selectManager() {
  let taskChosen = []
  db.query("SELECT * FROM employee WHERE manager_id IS NULL",
    function (err, response) {
      if (err) throw err
      for (var i = 0; i < response.length; i++) {
        taskChosen.push(response[i].first_name);
      }
    })
    console.log (taskChosen);
  return taskChosen;
}


function addEmployee() {
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "Enter First name: ",
      validate: usageInput => {
        if (usageInput) {
          return true;
        } else {
          console.log('Please Enter First Name!');
          return false;
        }
      }
    },
    {
      name: "lastname",
      type: "input",
      message: "Enter Last name:",
      validate: usageInput => {
        if (usageInput) {
          return true;
        } else {
          console.log('Please Enter Last Name!');
          return false;
        }
      }
    },
    {
      name: "roles",
      type: "list",
      message: "Choose role: ",
      choices: selectRole()
    },
    {
      name: "manager",
      type: "rawlist",
      message: "Select Manager:",
      choices: selectManager()
    }
  ]).then(function (response) {
    var roleId = selectRole().indexOf(response.role) + 1
    var mgrId = selectManager().indexOf(response.choice) + 1

    console.log("Testing ROLE ID " + roleId);
    db.query("INSERT INTO employee SET ?",
      {
        first_name: response.firstName,
        last_name: response.lastName,
        manager_id: mgrId,
        role_id: roleId

      }, function (err) {
        if (err) throw err
        console.table(response)
        viewEmployees();
        startMenu();
      })

  })
}
