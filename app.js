//TO DO:

//KEEP BUILDING FORWARD ALL / CAPTION ALL

import express from "express";
import CONFIG from "./config/config.js";
import routes from "./routes/router.js";

const { port } = CONFIG;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//routes
app.use(routes);

// app.listen(1801);
app.listen(port);
