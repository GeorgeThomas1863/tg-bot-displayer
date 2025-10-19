//CURRENT STEP: //REDO ALL THE FRONTEND JS

//TO DO:
//KEEP BUILDING FORWARD ALL / CAPTION ALL

import express from "express";
import session from "express-session";
import routes from "./routes/router.js";

import CONFIG from "./config/config.js";

const { port } = CONFIG;

const app = express();

app.use(session(CONFIG.buildSessionConfig()));

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use(routes);

// app.listen(1801);
app.listen(port);
