import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.development.local",
});

const port = process.env.PORT;
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index", {
    title: "HOMEPAGE",
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
