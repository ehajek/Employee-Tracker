
INSERT INTO department 
(dptname)
VALUE 
("Legal"),
("Sales"),
("Egnineering"),
("Finance");

INSERT INTO roles 
(title, salary, department_id)
VALUE 
("Sales Lead", 100000, 2),
("Salesperson", 80000, 2),
("Lead Engineer", 150000, 3),
("Software Engineer", 120000, 3),
("Accountant", 125000, 4),
("Legal Team Lead", 250000, 1),
("Lawyer", 190000, 1);

INSERT INTO employee 
(first_name, last_name, manager_id, role_id)
VALUES
("Malia", "Brown", NULL, 5),
("Sarah", "Lourd", NULL, 6),
("John", "Doe", 3, 1),
("Mike", "Chan", 1, 2),
("Ashley", "Rodriquez", NULL, 3),
("Kevin", "Tupik", 4, 3),
("Tom", "Allen", 6, 7);
