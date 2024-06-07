import express from "express";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({
  path: ".env.development.local",
});

const port = process.env.PORT;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const navlinks = {
  teachers: ["home", "students", "classes", "modules"],
  students: ["home", "teachers", "classes", "modules"],
  modules: ["home", "teachers", "students", "classes"],
  classes: ["home", "teachers", "students", "modules"],
};

const modules = [
  {
    name: "Entrepreneurship",
    code: "GSU 08211",
    credits: 6,
    teacherId: "12012023045",
  },
  {
    name: "Project",
    code: "ETU 08221",
    credits: 12,
    teacherId: "12012023046",
  },
  {
    name: "Radar",
    code: "ETU 08222",
    credits: 9,
    teacherId: "12012023047",
  },
  {
    name: "Broadcasting",
    code: "ETU 08223",
    credits: 9,
    teacherId: "12012023048",
  },
  {
    name: "Satellite",
    code: "ETU 08224",
    credits: 9,
    teacherId: "12012023049",
  },
  {
    name: "Robotics",
    code: "COU 08202",
    credits: 9,
    teacherId: "12012023050",
  },
];

const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  database: "attendance",
  password: process.env.DB_PASSWORD,
  port: 5432,
  user: "postgres",
  connectionTimeoutMillis: 3500,
});

const insertStudentData = `INSERT INTO STUDENTS (registrationNumber, name) VALUES ($1, $2) RETURNING *`;

const insertTeacherData = `INSERT INTO TEACHERS (id, name) VALUES ($1, $2)`;

const insertModulesData = `INSERT INTO MODULES (code, name, credits, teacherId) VALUES ($1, $2, $3, $4)`;

async function insertModules() {
  try {
    // Loop through the modules array
    for (const _module of modules) {
      const { code, name, credits, teacherId } = _module;

      // Execute the query for each module
      await pool.query(insertModulesData, [code, name, credits, teacherId]);
    }

    console.log("Modules inserted successfully!");
    return { success: true };
  } catch (err) {
    console.error("Error inserting modules:", err);
    return { success: false };
  } finally {
    // Release the client back to the pool
    pool.end();
  }
}

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

const createModuleAttendanceTable = `
  CREATE TABLE IF NOT EXISTS ($1)(
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

app.get("/", async (req, res) => {
  return res.render("pages/index", {
    title: "homepage",
  });
});

app.get("/home", (req, res) => {
  return res.redirect("/");
});

app.get("/students", async (req, res) => {
  const students = await pool.query(fetchStudents);
  console.log(students.rows);
  return res.render("pages/students", {
    title: "students page",
    navlinks: navlinks.students,
    students: students.rows,
  });
});

app.get("/new-student", async (req, res) => {
  return res.render("pages/new-student", {
    title: "new student page",
    navlinks: navlinks.students,
  });
});

app.get("/teachers", async (req, res) => {
  const teachers = await pool.query(fetchTeachers);
  console.log(teachers.rows);
  return res.render("pages/teachers", {
    title: "teachers page",
    navlinks: navlinks.teachers,
    teachers: teachers.rows,
  });
});

app.get("/new-teacher", async (req, res) => {
  return res.render("pages/new-teacher", {
    title: "new teacher page",
    navlinks: navlinks.teachers,
  });
});

app.get("/classes", async (req, res) => {
  return res.render("pages/classes", {
    title: "Classes page",
    currentUrl: req.originalUrl,
    navlinks: navlinks.classes,
  });
});

app.get("/classes/:name", async (req, res) => {
  let _class = req.params.name;
  return res.render("pages/class-details", {
    title: "Attendance for ",
    _class,
    navlinks: navlinks.classes,
  });
});

app.get("/modules", async (req, res) => {
  return res.render("pages/modules", {
    title: "Modules page",
    currentUrl: req.originalUrl,
    modules,
    navlinks: navlinks.modules,
  });
});

app.get("/modules/:code", async (req, res) => {
  let _module = req.params.code;
  return res.render("pages/module-details", {
    title: "Attendance for ",
    _module,
    navlinks: navlinks.modules,
  });
});

app.post("/student-registration", async (req, res) => {
  const { registrationNumber, name } = req.body;
  try {
    const student = await pool.query(insertStudentData, [
      registrationNumber,
      name,
    ]);
    console.log("Student inserted successfully!\n", student.rows);
    return res.redirect("/students");
  } catch (err) {
    console.error("Error inserting student:", err);
    return res.redirect("/new-student");
  }
});

app.post("/teacher-registration", async (req, res) => {
  const { identificationNumber, name } = req.body;
  try {
    const teacher = await pool.query(insertTeacherData, [
      identificationNumber,
      name,
    ]);
    console.log("Teacher inserted successfully!\n", teacher.rows);
    return res.redirect("/teachers");
  } catch (err) {
    console.error("Error inserting student:", err);
    return res.redirect("/new-teacher");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
