DROP DATABASE emptrack;
CREATE DATABASE emptrack;
USE emptrack;

CREATE TABLE department (
  id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
  dptname VARCHAR(30) NOT NULL
);
CREATE TABLE roles (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary INTEGER,
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INTEGER,
  role_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT fk_manager
	  FOREIGN KEY (manager_id)
	  REFERENCES employee(id)
	  ON DELETE SET NULL
);
