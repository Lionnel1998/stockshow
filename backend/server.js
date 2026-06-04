const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "stockshow"
});

db.connect((err) => {
  if (err) {
    console.log("Erreur connexion MySQL");
  } else {
    console.log("MySQL connecté");
  }
});

app.get("/", (req, res) => {
  res.send("Backend StockShow fonctionne");
});

app.listen(5000, () => {
  console.log("Serveur lancé sur le port 5000");
});