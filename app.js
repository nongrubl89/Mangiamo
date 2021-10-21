const express = require("express");
const app = express();
app.listen(3000);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { title: "Mangiamo || Home" });
});

app.get("/new-entry", (req, res) => {
  res.render("newentry", { title: "Mangiamo || New Entry" });
});

app.post("/", (req, res) => {
  console.log(req.body);
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
