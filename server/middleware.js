import helmet from "helmet";
import path from "path";

const jwt = require("jsonwebtoken");
require("dotenv").config();

export const authorization = (req, res, next) => {
    // Get token from header  
    const jwtToken = req.header("token");

    if (!jwtToken) {
        return res.status(403).json("Not Authorized")
    }
    try {

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user;
        next();

    } catch (err) {
        console.error(err.message);
        return res.status(403).json("You are not Authorized");

    }


}

export const jwtGenerator = (user_id) => {
    const payload = {
        user: user_id
    }

    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" })
}

export const configuredHelmet = () =>
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				objectSrc: ["'none'"],
				scriptSrc: ["'self'", "unpkg.com", "polyfill.io"],
				styleSrc: ["'self'", "https: 'unsafe-inline'"],
				upgradeInsecureRequests: [],
			},
		},
	});

export const httpsOnly = () => (req, res, next) => {
	if (!req.secure) {
		return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
	}
	next();
};

export const logErrors = () => (err, _, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	console.error(err);
	res.sendStatus(500);
};

export const pushStateRouting = (apiRoot, staticDir) => (req, res, next) => {
	if (req.method === "GET" && !req.url.startsWith(apiRoot)) {
		return res.sendFile(path.join(staticDir, "index.html"));
	}
	next();
};
