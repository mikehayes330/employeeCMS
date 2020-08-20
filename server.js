const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Mh4321!!",
  database: "employeedb",
});

connection.connect(function (err) {
  if (err) throw err;
  startApp();
});

// function that starts app and routes all prompts to correct functions
function startApp() {
  return inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View Employees by Department",
        "View Employees by Role",
        new inquirer.Separator(),
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        new inquirer.Separator(),
        "Update an Employee's Role",
        "Exit",
        new inquirer.Separator(),
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View Employees by Department":
          viewDept();
          break;
        case "View Employees by Role":
          viewRole();
          break;
        case "Add a Department":
          addDept();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee's Role":
          updateRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}
//show all employees roles salarays and depts on the page
function viewAllEmployees() {
  let query = `SELECT employee.first_name, employee.last_name, 
    employee.role_id, role.title, role.salary, role.id
    FROM employee 
    INNER JOIN role ON (employee.role_id = role.id)
    ORDER BY employee.role_id    
    `;
  connection.query(query, null, function (err, res) {
    console.log("________________________________________________________");
    console.table(res);
  });

  startApp();
}
function viewDept() {
  return inquirer
    .prompt({
      name: "viewDept",
      type: "input",
      message: "Which Department would you like to view?",
    })
    .then(function (answer) {
      var query = `SELECT department.name, employee.role_id, department.id,
          employee.first_name, employee.last_name, role.department_id, role.id
          FROM department
          INNER JOIN role ON (department.id = role.department_id)
          INNER JOIN employee ON (role.id = employee.role_id)
          WHERE (department.name = ?)
          ORDER BY department.id
          `;
      connection.query(query, [answer.viewDept], function (err, res) {
        console.table(res);
        startApp();
      });
    });
}
function viewRole() {
  return inquirer
    .prompt({
      name: "viewRole",
      type: "input",
      message: "Which Role would you like to view?",
    })
    .then(function (answer) {
      var query = `SELECT *
          FROM department
          INNER JOIN role ON (department.id = role.department_id)
          INNER JOIN employee ON (role.id = employee.role_id)
          WHERE (role.id = ?)
          ORDER BY department.id
          `;
      connection.query(query, [answer.viewDept], function (err, res) {
        console.table(res);
        startApp();
      });
    });
}
function addDept() {
  return inquirer
    .prompt({
      name: "addDept",
      type: "input",
      message: "What department would you like to add?",
    })
    .then(function (answer) {
      const query = `INSERT INTO department (name)
        VALUES (?);
        `;
      connection.query(query, [answer.addDept], function (err, res) {
        console.table(res);
        console.log("Its been added!");
        startApp();
      });
    });

  startApp();
}
function addRole() {
  return inquirer
    .prompt([
      {
        name: "addTitle",
        type: "input",
        message: "What is the title of the role you would you like to add?",
      },
      {
        name: "addSalary",
        type: "input",
        message: "What is the salary of the role you would you like to add?",
      },
    ])
    .then(function (answer) {
      const query = `INSERT INTO role (title, salary)
        VALUES (?, ?);
        `;
      connection.query(query, [answer.addTitle, answer.addSalary], function (
        err,
        res
      ) {
        console.table(res);
        console.log("Its been added!");
        startApp();
      });
    });

  startApp();
}
function addEmployee() {
  return inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message:
          "What is the first name of the employee you would you like to add?",
      },
      {
        name: "lastName",
        type: "input",
        message:
          "What is the Last name of the employee you would you like to add?",
      },
    ])
    .then(function (answer) {
      const query = `INSERT INTO employee (first_name, last_name, role_id)
        VALUES (?, ?, 2);
        `;
      connection.query(query, [answer.firstName, answer.lastName], function (
        err,
        res
      ) {
        console.table(res);
        console.log("Its been added!");
        startApp();
      });
    });

  startApp();
}
function updateRole() {
  var allEmployees = [];
  connection.query("SELECT * FROM employee", function (err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let employeeString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
      allEmployees.push(employeeString);
    }
    // console.log(allEmployees);
    return inquirer.prompt({
      name: "updateWho",
      type: "rawlist",
      message: "Who would you like to update?",
      choices: allEmployees,
    });
  });

  // startApp();
}
