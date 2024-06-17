import argon from "argon2";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  password: "postgres",
  user: "postgres",
  port: 5432,
  database: "attendance",
});

const password = await argon.hash("ETE1234");
// console.log(password);

const insertModules = `
INSERT INTO "Module" (name, code, "classId", "teacherId") VALUES
  ('Entrepreneurship', 'GSU 08211', 1, 12012023045),
  ('Project', 'ETU 08221', 1, 12012023046),
  ('Radar', 'ETU 08222', 1, 12012023047),
  ('Broadcasting', 'ETU 08223', 1, 12012023048),
  ('Satellite', 'ETU 08224', 1, 12012023049),
  ('Robotics', 'COU 08202', 1, 12012023050);
`;

const insertTeachers = `
INSERT INTO "Teacher" (id, name, "departmentCode", password)
VALUES
  (12012023045, 'Majogoro', 'ETE', '${password}'),
  (12012023047, 'J. Ally', 'ETE', '${password}'),
  (12012023046, 'Kajange', 'ETE', '${password}'),
  (12012023048, 'Nzowa', 'ETE', '${password}'),
  (12012023049, 'Justina', 'ETE', '${password}'),
  (12012023050, 'Dr. Simbeye', 'ETE', '${password}')

`;

const result = await pool.query(insertModules)

console.log(result);
