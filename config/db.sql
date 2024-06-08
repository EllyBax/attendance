-- Create Students Table
CREATE TABLE IF NOT EXISTS STUDENTS 
(
  registrationnumber bigint unique primary key not null,
  name text
);

-- Create Teachers Table
CREATE TABLE IF NOT EXISTS TEACHERS 
(
  id bigint unique primary key not null,
  name text
);

-- Create Modules Table
CREATE TABLE IF NOT EXISTS MODULES 
(
  code text unique primary key not null,
  name text,
  credits integer,
  teacherId bigint references teachers(id)
);

-- Create Student Module Attendance Table
CREATE TABLE IF NOT EXISTS ($1)(
  id serial primary key not null,
  name text,
  idnumber bigint references students(registrationnumber),
  role text default 'Student',
  lesson1 boolean,
  lesson2 boolean,
  lesson3 boolean,
  lesson4 boolean,
  lesson5 boolean,
  lesson6 boolean,
  lesson7 boolean
);

-- Insert Student Data
INSERT INTO STUDENTS (registrationNumber, name) VALUES ($1, $2) RETURNING *;

-- Insert Teacher Data
INSERT INTO TEACHERS (id, name) VALUES ($1, $2);

-- Insert Modules Data
INSERT INTO MODULES (code, name, credits, teacherId) VALUES ($1, $2, $3, $4);

-- Fetch Teachers
SELECT * FROM teachers;

-- Fetch Modules
SELECT * FROM modules;

-- Fetch Students
SELECT * FROM students;