const db = require('./db/connection');
const inquirer = require("inquirer")
const PORT = process.env.PORT || 3001;
const cTable = require("console.table");

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

// Main Queries -------------

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

function selectRole() {
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

function selectManager() {
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

function selectEmp() {
  return new Promise(function (resolve, reject) {
    db.query('SELECT * FROM employee', (err, results) => {
      if (err) {
        return reject(err);
      }
      const choseEmp = results.map(employee => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        };
      })
      resolve(choseEmp);
    })
  })
}

function selectRole2() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT * FROM roles", (err, results) => {
      if (err) {
        return reject(err);
      }
      const choseRole = results.map(role => {
        return {
          name: `${role.id} ${role.title}`,
          value: role.id
        };
      })
      resolve(choseRole);
    })
  })
}

function selectDpt() {
  return new Promise(function (resolve, reject) {
    db.query("SELECT department.id, department.dptname FROM department", (err, results) => {
      if (err) {
        return reject(err);
      }
      const choseDept = results.map(dept => {
        return {
          name: `${dept.id} ${dept.dptname}`,
          value: dept.id
        };
      })
      resolve(choseDept);
    })
  })
}


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

function addEmployee() {
  console.clear();
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
      message: "Select role: ",
      choices: selectRole()
    },
    {
      name: "manager",
      type: "list",
      message: "Select Manager:",
      choices: selectManager()
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


async function addRoles() {
  console.clear();

  await selectDpt().then((deptChoice) => {
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
      },
      {
        name: "newDeptId",
        type: "list",
        choices: deptChoice
      }
    ]).then(function (data) {
      db.query(
        "INSERT INTO roles SET ?",
        {
          title: data.newRoleTitle,
          salary: data.newRoleSalary,
          department_id: data.newDeptId
        },
        function (err) {
          if (err) throw err;
          console.clear();
          startMenu();
        }
      )
    })
  })
};

async function updateEmp() {
  console.clear();
  let employee;
  let role;

  await selectEmp().then((empChoice) => {
    inquirer.prompt([
      {
        name: 'upEmp',
        type: 'list',
        message: 'Select employee to update',
        choices: empChoice
      }
    ]).then((reponse) => {
      employee = reponse.upEmp;
      selectRole2().then((roleChoice) => {
        inquirer.prompt([
          {
            name: 'roleUpdated',
            type: 'list',
            message: 'Select New role: ',
            choices: roleChoice
          }
        ]).then((data) => {
          role = data.roleUpdated;
          db.query('UPDATE employee SET ? WHERE ?', [{ role_id: role }, { id: employee }], (err, res) => {
            if (err) {
              throw err
            }
            startMenu();
          })
        })
      })
    })
  })
};