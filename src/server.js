import express from "express";
import dotenv from "dotenv";
import router from "../api/router/index.js"; // Adjust the path as per your project structure

dotenv.config({
  path: ".env.development.local",
});

const port = process.env.PORT;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the router
app.use("/", router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
