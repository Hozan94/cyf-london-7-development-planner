import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const dbUrl = process.env.DATABASE_URL || "postgres://localhost:5432/cyf";

console.log({dbUrl});
const pool = new Pool({
	connectionString: dbUrl,
	connectionTimeoutMillis: 5000,
	ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
	// user:'postgres',
    // host:'localhost',
    // database: "devplanner_db",
    // password:'postgres',
    // port:5432
});

export const connectDb = async () => {
	let client;
	try {
		client = await pool.connect();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
	console.log("Postgres connected to", client.database);
	client.release();
};

export const disconnectDb = () => pool.close();

export default { query: pool.query.bind(pool) };
