import express from "express";
import StudentCtrl from "../controllers/students.js";
import TeachersCtrl from "../controllers/teachers.js";
import ClassCtrl from "../controllers/classes.js";
import DeptCtrl from "../controllers/departments.js";
import CourseCtrl from "../controllers/courses.js";
import ModuleCtrl from "../controllers/modules.js";
import session from "express-session";
import flash from "connect-flash";

const router = express.Router();

// Configure session middleware
router.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Set secure to true in production with HTTPS
  })
);

router.use(flash());

router.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

function requireLogin(req, res, next) {
  if (req.session.sessionId) {
    next();
  } else {
    req.flash("error", "Please login");
    res.redirect("/login"); // Redirect to a login page
  }
}

router.use(express.static("public"));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const navlinks = {
  teachers: ["home", "students", "classes", "modules"],
  students: ["home", "teachers", "classes", "modules"],
  departments: ["home", "teachers", "classes", "modules"],
  modules: ["home", "teachers", "students", "classes"],
  classes: ["home", "teachers", "students", "modules"],
};

// Define your routes here
router.get("/", (req, res) => {
  return res.render("pages/index", {
    title: "homepage",
  });
});

router.get("/home", (req, res) => {
  return res.redirect("/");
});

router.get("/hod-index", (req, res) => {
  return res.render("pages/hod-index", {
    title: "HOD homepage",
  });
});

router.get("/hod-login", (req, res) => {
  return res.render("pages/hod-login", {
    title: "Login",
  });
});

router.post("/hod-login", async (req, res) => {
  const hodData = req.body;
  console.log(hodData);
  return res.redirect("/hod-index");
});

router.get("/teacher-login", (req, res) => {
  return res.render("pages/teacher-login", {
    title: "Login",
  });
});

router.post("/teacher-login", async (req, res) => {
  const teacherData = req.body;
  console.log(teacherData);
  return res.redirect("/modules");
});

router.get("/students", requireLogin, async (req, res) => {
  const students = await StudentCtrl.fetchStudents();
  return res.render("pages/students", {
    title: "students page",
    navlinks: navlinks.students,
    students,
  });
});

router.get("/departments", async (req, res) => {
  const departments = await DeptCtrl.fetchDepartments();
  return res.render("pages/departments", {
    title: "Departments",
    navlinks: navlinks.departments,
    departments,
  });
});

router.get("/new-department", async (req, res) => {
  return res.render("pages/new-department", {
    title: "Register Department",
    navlinks: navlinks.departments,
  });
});

router.post("/department-registration", async (req, res) => {
  const departmentData = req.body;
  const department = await DeptCtrl.newDepartment(departmentData);
  console.log(department);
  return res.render("pages/new-hod", {
    title: `HOD for ${departmentData.name}`,
    navlinks: navlinks.departments,
  });
});

router.post("/hod-registration", async (req, res) => {
  const hodData = req.body;
  console.log(hodData);
  return res.redirect("/");
});

router.get("/courses", async (req, res) => {
  const courses = await CourseCtrl.fetchCourses();
  return res.render("pages/courses", {
    title: "courses",
    navlinks: navlinks.classes,
    courses,
  });
});

router.get("/new-student", async (req, res) => {
  // Add your logic to fetch classes
  const classes = await ClassCtrl.fetchClasses();
  return res.render("pages/new-student", {
    title: "new student page",
    navlinks: navlinks.students,
    classes,
  });
});

router.get("/teachers", async (req, res) => {
  const currentUrl = req.originalUrl;
  const teachers = await TeachersCtrl.fetchTeachers();
  return res.render("pages/teachers", {
    title: "teachers page",
    navlinks: navlinks.teachers,
    teachers,
    currentUrl,
  });
});

router.get("/teachers/:id", async (req, res) => {
  let teacherId = req.params.id;
  const teacher = await getTeacherById(teacherId);
  const modules = await getTeachersModules(teacherId);
  return res.render("pages/teacher-details", {
    title: "Teacher details page",
    navlinks: navlinks.teachers,
    teacher,
    modules,
  });
});

router.get("/new-teacher", async (req, res) => {
  return res.render("pages/new-teacher", {
    title: "new teacher page",
    navlinks: navlinks.teachers,
  });
});

router.get("/classes", async (req, res) => {
  const classes = await ClassCtrl.fetchClasses();
  return res.render("pages/classes", {
    title: "Classes page",
    currentUrl: req.originalUrl,
    navlinks: navlinks.classes,
    classes,
  });
});

router.get("/classes/:name", async (req, res) => {
  let _class = req.params.name;
  return res.render("pages/class-details", {
    title: "Attendance for ",
    _class,
    navlinks: navlinks.classes,
  });
});

router.get("/modules", async (req, res) => {
  const modules = await ModuleCtrl.fetchModules();
  return res.render("pages/modules", {
    title: "Modules page",
    currentUrl: req.originalUrl,
    modules,
    navlinks: navlinks.modules,
  });
});

router.get("/modules/:name", async (req, res) => {
  let name = req.params.name;
  const _module = await getModuleByName(name);
  console.log(_module.name);
  return res.render("pages/module-details", {
    title: "Attendance for ",
    _module,
    navlinks: navlinks.modules,
  });
});

router.post("/student-registration", async (req, res) => {
  const { registrationNumber, name, _class } = req.body;
  try {
    const student = await pool.query(insertStudentData, [
      registrationNumber,
      name,
      _class,
    ]);
    console.log("Student inserted successfully!\n", student.rows);
    return res.redirect("/students");
  } catch (err) {
    console.error("Error inserting student:", err);
    return res.redirect("/new-student");
  }
});

router.post("/teacher-registration", async (req, res) => {
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

router.get("/record-attendance/:name", async (req, res) => {
  const { name } = req.params;
  return res.render("pages/record-attendance", {
    title: "Record attendance",
    navlinks: navlinks.teachers,
    name,
  });
});

router.post("/attendance-record", async (req, res) => {
  const { lesson, registrationNumber } = req.body;
  const student = await getStudentByRegistrationNumber(registrationNumber);
  const name = student.name;

  const pathSegments = req.path.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  console.log(lastSegment);
  return res.send("Data received");
});

export default router;
