import express from "express";
import process from "process";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/combine.js", (req, res) => {
  res.sendFile(process.cwd() + "/node_modules/@proxtx/combine/combine.js");
});

app.listen(80);
