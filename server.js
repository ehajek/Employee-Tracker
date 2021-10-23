const db = require('./db/connection');
const inquirer = require("inquirer")
const PORT = process.env.PORT || 3001;
const cTable = require("console.table");
// Formula Variables ----------------



// Database/Server Fun -------------
console.clear();

db.connect(err => {
  if (err) throw err;
});


// Progran to make it all happen ------------
initApp();

function initApp() {

  empTrackPrg();
  startMenu();
};


function empTrackPrg() {

  console.log(" __________________________ ")
  console.log("|                          |")
  console.log("|                          |")
  console.log("|     EMPLOYEE MANAGER     |")
  console.log("|                          |")
  console.log("|__________________________|")
  console.log("                            ")

};

// Main Menu ------------------

async function startMenu() {
  await inquirer.prompt([
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
        "Update Employee's Role"
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
        addRoles();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee's Role":
        updateEmp();
        break;
    }
  })
}

// Helping Queries -------------

function viewDepartments() {
  console.clear();
  db.query("SELECT department.id AS Department_ID, department.dptname AS Department FROM department",
    function (err, response) {
      if (err) throw err;
      console.table(response);
      startMenu();
    })
}

function viewRoles() {
  console.clear();
  db.query(
    "SELECT id AS Role_ID, title as Title, CONCAT(' $', format(roles.salary, 2)) as Salary FROM roles ",
    function (err, response) {
      if (err) throw err;
      console.table(response);
      startMenu();
    })
}

function viewEmployees() {
  console.clear();
  db.query(
    "SELECT employee.first_name as First_Name, employee.last_name as Last_Name, roles.title as Role, CONCAT(' $', format(roles.salary, 2)) as Salary, department.dptname as Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN roles on roles.id = employee.role_id INNER JOIN department on department.id = roles.department_id left join employee e on employee.manager_id = e.id",
    function (err, response) {
      if (err) throw err;
      console.table(response);
      startMenu();
    })
}

// Selecting Functions ----------------

async function selectRole() {
  let taskChosen = [];
  db.query("SELECT * FROM roles",
    function (err, response) {
      if (err) throw err;
      for (var i = 0; i < response.length; i++) {
        taskChosen.push(`${response[i].id} ${response[i].title}`);
      };
    });
  return taskChosen;
};

async function selectManager() {
  let taskChosen = [];
  db.query("SELECT * FROM employee WHERE manager_id IS NULL",
    function (err, response) {
      if (err) throw err;
      for (var i = 0; i < response.length; i++) {
        taskChosen.push(`${response[i].id} ${response[i].first_name}`);
      };
    });
  return taskChosen;
};

async function selectEmp() {
  let taskChosen = [];
  db.query("SELECT * FROM employee",
    function (err, response) {
      if (err) throw err;
      for (var i = 0; i < response.length; i++) {
        //console.log(`${response[i].id} ${response[i].first_name} ${response[i].last_name} ${response[i].role_id}`);
        taskChosen.push(`${response[i].id} ${response[i].first_name} ${response[i].last_name}`);
      };
      //  console.log(taskChosen);
    });
  return taskChosen;
};

// Functions that do stuff -----------
function addDepartment() {
  console.clear();
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "New department name?"
    }
  ]).then(function (response) {
    db.query(
      "INSERT INTO department SET ? ",
      { dptname: response.name },
      function (err) {
        if (err) throw err;
        // console.table(response);
        console.clear();
        startMenu();
      }
    );
  });
};


async function addEmployee() {
  console.clear();
  const roles = await selectRole();
  const managers = await selectManager();
  inquirer.prompt([
    {
      name: 'firstname',
      type: "input",
      message: 'Enter First name: ',
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
      name: 'lastname',
      type: 'input',
      message: 'Enter Last name: ',
      validate: usageInput => {
        if (usageInput) {
          return true;
        } else {
          console.log('Please Enter Last Name!');
          return false;
        };
      }
    },
    {
      name: "roles",
      type: "list",
      message: "Choose role: ",
      choices: roles
    },
    {
      name: "manager",
      type: "list",
      message: "Select Manager:",
      choices: managers
    }
  ]).then(function (response) {
    let roleId = response.roles;
    let mgrId = response.manager;
    let ro = parseInt(roleId.charAt(0));
    let mn = parseInt(mgrId.charAt(0));
    db.query("INSERT INTO employee SET ?",
      {
        first_name: response.firstname,
        last_name: response.lastname,
        manager_id: mn,
        role_id: ro

      }, function (err) {
        if (err) throw err
        // console.table(response)
        console.clear();
        startMenu();
      });
  });
};


function addRoles() {
  console.clear();
  inquirer.prompt([
    {
      name: "newRoleTitle",
      type: "input",
      message: "New Title of Role: "
    },
    {
      name: "newRoleSalary",
      type: "input",
      message: "Salary of Role: "
    }
  ]).then(function (response) {
    db.query(
      "INSERT INTO roles SET ?",
      {
        title: response.newRoleTitle,
        salary: response.newRoleSalary,
      },
      function (err) {
        if (err) throw err;
        console.clear();
        startMenu();
      }
    );
  });
};

async function updateEmp() {

  function selectRoleEmp() {
    let taskChosen = [];
    db.query("SELECT * FROM roles",
      function (err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
          taskChosen.push(`${response[i].id} ${response[i].title}`);
        };
      });
    return taskChosen;
  };

  function selectEmpEmp() {
    let taskChosen = [];
    db.query("SELECT * FROM employee",
      function (err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
          //console.log(`${response[i].id} ${response[i].first_name} ${response[i].last_name} ${response[i].role_id}`);
          taskChosen.push(`${response[i].id} ${response[i].first_name} ${response[i].last_name}`);
        };
      });
    return taskChosen;
  };

    let roles = await selectRoleEmp();
    let employees = await selectEmpEmp();
    console.clear();
    await inquirer.prompt([
      {
        name: 'empId',
        type: 'list',
        message: 'Select employee to update role: ',
        choices: employees
      },
      {
        name: "role",
        type: "list",
        message: "Choose new role:  ",
        choices: roles
      }
    ]).then(function (data) {
      let changeRoleId = data.roles;
      let ro = parseInt(changeRoleId.charAt(0));
      var roleId = ro
      connection.query("Update Employee Role SET WHERE ?",
        {
          id: data.id

        },
        {
          role_id: changeRoleId

        },
        function (err) {
          if (err) throw err
          console.table(val)
          startPrompt()
        })

    });
  };
