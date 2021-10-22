const db = require('./db/connection');
const inquirer = require("inquirer")
const PORT = process.env.PORT || 3001;
const app = express();
const cTable = require("console.table");

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

empTrackPrg = () => {
  console.log(" __________________________ ")
  console.log("|                          |")
  console.log("|                          |")
  console.log("|     EMPLOYEE MANAGER     |")
  console.log("|                          |")
  console.log("|__________________________|")

};

//========== Connection ID ==========================//
connection.connect(function (err) {
  if (err) throw err
  console.log("Connected as Id" + connection.threadId)
  startPrompt();
});
//================== Initial Prompt =======================//
function startPrompt() {
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
        viewRole();
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
//============= View Employees ==========================//
function viewEmployees() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
}
//============= View All Roles ==========================//
function viewAllRoles() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
}
//============= View Employees By Departments ==========================//
function viewAllDepartments() {
  connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
}

//================= Select Role Quieries Role Title for Add Employee Prompt ===========//
var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}
//================= Select Role Quieries The Managers for Add Employee Prompt ===========//
var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}
//============= Add Employee ==========================//
function addEmployee() {
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "Enter their first name "
    },
    {
      name: "lastname",
      type: "input",
      message: "Enter their last name "
    },
    {
      name: "role",
      type: "list",
      message: "What is their role? ",
      choices: selectRole()
    },
    {
      name: "choice",
      type: "rawlist",
      message: "Whats their managers name?",
      choices: selectManager()
    }
  ]).then(function (val) {
    var roleId = selectRole().indexOf(val.role) + 1
    var managerId = selectManager().indexOf(val.choice) + 1
    connection.query("INSERT INTO employee SET ?",
      {
        first_name: val.firstName,
        last_name: val.lastName,
        manager_id: managerId,
        role_id: roleId

      }, function (err) {
        if (err) throw err
        console.table(val)
        startPrompt()
      })

  })
}
//============= Update Employee Role ==========================//
function updateEmployee() {
  connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function (err, res) {
    // console.log(res)
    if (err) throw err
    console.log(res)
    inquirer.prompt([
      {
        name: "lastName",
        type: "rawlist",
        choices: function () {
          var lastName = [];
          for (var i = 0; i < res.length; i++) {
            lastName.push(res[i].last_name);
          }
          return lastName;
        },
        message: "What is the Employee's last name? ",
      },
      {
        name: "role",
        type: "rawlist",
        message: "What is the Employees new title? ",
        choices: selectRole()
      },
    ]).then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1
      connection.query("Update Employee Role SET WHERE ?",
        {
          last_name: val.lastName

        },
        {
          role_id: roleId

        },
        function (err) {
          if (err) throw err
          console.table(val)
          startPrompt()
        })

    });
  });

}
//============= Add Employee Role ==========================//
function addRole() {
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function (err, res) {
    inquirer.prompt([
      {
        name: "Title",
        type: "input",
        message: "What is the roles Title?"
      },
      {
        name: "Salary",
        type: "input",
        message: "What is the Salary?"

      }
    ]).then(function (res) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: res.Title,
          salary: res.Salary,
        },
        function (err) {
          if (err) throw err
          console.table(res);
          startPrompt();
        }
      )

    });
  });
}
//============= Add Department ==========================//
function addDepartment() {

  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What Department would you like to add?"
    }
  ]).then(function (res) {
    var query = connection.query(
      "INSERT INTO department SET ? ",
      {
        name: res.name

      },
      function (err) {
        if (err) throw err
        console.table(res);
        startPrompt();
      }
    )
  })
}
