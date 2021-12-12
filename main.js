import express from "express";
import process from "process";
import { router, addModule } from "@proxtx/combine/serveRoute.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/api", router);

app.get("/combine.js", (req, res) => {
  res.sendFile(process.cwd() + "/node_modules/@proxtx/combine/combine.js");
});

addModule("game.js");

app.listen(80);
