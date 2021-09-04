import express from "express";
import morgan from "morgan";
import path from "path";

import router from "./api";
// import router from "./plansapi";
import {
	configuredHelmet,
	httpsOnly,
	logErrors,
	pushStateRouting,
} from "./middleware";

const apiRoot = "/api";
const staticDir = path.join(__dirname, "static");

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(configuredHelmet());
app.use(morgan("dev"));

if (app.get("env") === "production") {
	app.enable("trust proxy");
	app.use(httpsOnly());
}

app.use(apiRoot, router);
// Dashboard Route
//app.use("/", require('./routes/dashboard'));


// register and login routes
//app.use("/auth", require("./routes/jwtAuth"));
app.use(express.static(staticDir));
app.use(pushStateRouting(apiRoot, staticDir));
//api
//app.use("/", require("./routes/jwtAuth"));

app.use(logErrors());

export default app;
