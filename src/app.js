import express from "express";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({
  path: ".env.development.local",
});

const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  database: "attendance",
  password: process.env.DB_PASSWORD,
  port: 5432,
  user: "postgres",
  connectionTimeoutMillis: 3500,
});

const createStudentsTable = `CREATE TABLE IF NOT EXISTS STUDENTS 
  (
  registrationNumber bigint unique primary key not null,
  name text
  )`;

const createTeachersTable = `CREATE TABLE IF NOT EXISTS TEACHERS 
  (
  id bigint unique primary key not null,
  name text
  )`;

const createModulesTable = `CREATE TABLE IF NOT EXISTS MODULES 
  (
  code text unique primary key not null,
  name text,
  credits integer,
  teacherId bigint
  )`;

let _module;
const createModuleAttendanceTable = `
  CREATE TABLE IF NOT EXISTS ${_module}Attendance(
  id serial primary key not null,
  name text,
  role text,
  lesson1 boolean,
  lesson2 boolean,
  lesson3 boolean,
  lesson4 boolean,
  lesson5 boolean,
  lesson6 boolean,
  lesson7 boolean
  )
  `;

const fetchTeachers = `
  SELECT * FROM teachers
`;
const fetchModules = `SELECT * FROM modules`;

const fetchStudents = `SELECT * FROM students`;

async function main() {
  try {
    console.log("Running " + createStudentsTable + "\n");
    await pool.query(createStudentsTable);
    console.log("Done with " + createStudentsTable + "\n");

    console.log("Running " + createTeachersTable + "\n");
    await pool.query(createTeachersTable);
    console.log("Done with " + createTeachersTable + "\n");

    console.log("Running " + createModulesTable + "\n");
    await pool.query(createModulesTable);
    console.log("Done with " + createModulesTable + "\n");

    console.log("All queries executed succesfully\n");
    return 0;
  } catch (error) {
    console.log(error);
    return 1;
  }
}

const port = process.env.PORT;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  return res.render("pages/index", {
    title: "homepage",
  });
});

app.get("/students", async (req, res) => {
  return res.render("pages/students", {
    title: "students page",
  });
});

app.get("/new-student", async (req, res) => {
  return res.render("pages/new-student", {
    title: "new student page",
  });
});

app.get("/teachers", async (req, res) => {
  return res.render("pages/teachers", {
    title: "teachers page",
  });
});

app.get("/new-teacher", async (req, res) => {
  return res.render("pages/new-teacher", {
    title: "new teacher page",
  });
});

app.get("/classes", async (req, res) => {
  return res.render("pages/classes", {
    title: "Classes page",
    currentUrl: req.originalUrl,
  });
});

app.get("/classes/:name", async (req, res) => {
  let _class = req.params.name;
  return res.render("pages/class-details", {
    title: "Attendance for ",
    _class,
  });
});

let modules = [
  { name: "Entrepreneurship", code: "GSU 08211", credits: 6, teacherId: "" },
  { name: "Project", code: "ETU 08221", credits: 12, teacherId: "" },
  { name: "Radar", code: "ETU 08222", credits: 9, teacherId: "" },
  { name: "Broadcasting", code: "ETU 08223", credits: 9, teacherId: "" },
  { name: "Satellite", code: "ETU 08224", credits: 9, teacherId: "" },
  { name: "Industrial Robotics", code: "COU 08202", credits: 9, teacherId: "" },
];

app.get("/modules", async (req, res) => {
  return res.render("pages/modules", {
    title: "Modules page",
    currentUrl: req.originalUrl,
    modules,
  });
});

app.get("/modules/:code", async (req, res) => {
  let _module = req.params.code;
  return res.render("pages/module-details", {
    title: "Attendance for ",
    _module,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
