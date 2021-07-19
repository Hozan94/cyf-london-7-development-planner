import { Router } from "express";
import { Pool } from "pg";

const router = new Router();

router.get("/", (_, res) => {
	res.json({ message: "Hello, world!" });
});

const dbUrl = process.env.DATABASE_URL || "postgres://localhost:5432/cyf";

const pool = new Pool({
    connectionString: dbUrl,
});

//GET all "/graduates" OR get a graduate with a searchTerm included in their details "/graduates?q={searchTerm}"
router.get("/graduates", (req, res) => {
    const searchTerm = req.query.q;

    if (searchTerm) {
        //Get graduates when searchTerm is included in either last_name, first_name or class
        const query =

            `SELECT graduates.id, first_name, last_name, classes.class_code, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM graduates INNER JOIN classes ON graduates.class_id = classes.id WHERE first_name ILIKE '%${searchTerm}%' OR last_name ILIKE '%${searchTerm}%' OR classes.class_code ILIKE '%${searchTerm}%'`;

        pool
            .query(query)
            .then((result) => {
                if (result.rowCount) {
                    res.json({ "graduates": result.rows });
                } else {
                    res.status(404).json({ "status": 404, "error": "No graduates found" });
                }
            })
            .catch((error) => console.log(error));

    } else {
        //Get all graduates
        const query =

            "SELECT graduates.id, first_name, last_name, classes.class_code, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM graduates INNER JOIN classes ON graduates.class_id = classes.id ORDER BY graduates.id";

        pool
            .query(query)
            .then((result) => res.json({ "graduates": result.rows }))
            .catch((error) => console.log(error));
    }
});


//GET a graduate with a specified ID at "/graduates/:id"
router.get("/graduates/:id", (req, res) => {
    const graduateId = req.params.id;

    const query =

        "SELECT graduates.id, first_name, last_name, classes.class_code, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM graduates INNER JOIN classes ON graduates.class_id = classes.id WHERE graduates.id = $1";

    pool
        .query(query, [graduateId])
        .then((result) => {
            if (result.rowCount) {
                res.json(result.rows);
            } else {
                res.status(404).json({ "status": 404, "error": "No graduate found" });
            }
        })
        .catch((error) => console.log(error));
});


//POST a new graduate at "/graduates"
router.post("/graduates", (req, res) => {
    const graduateFirstName = req.body.firstName;
    const graduateLastName = req.body.lastName;
    const graduateEmail = req.body.email;
    const graduatePassword = req.body.password;
    const graduateClass = req.body.class;
    let graduateClassId;

    graduateClass === "LDN06" ? graduateClassId = 1 : graduateClass === "WMS01" ? graduateClassId = 2 :
    graduateClass === "LDN07" ? graduateClassId = 3 : graduateClass === "WMS02" ? graduateClassId = 4 : null;

    //Validate all fields are filled in
    if (!graduateFirstName || !graduateLastName || !graduateEmail || !graduatePassword || !graduateClassId) {
        return res.status(400).json({ "status": 400, "error": "Please fill in all fields" });
    }

    //Validate graduate does not exist (using email and password)
    const query =

        "SELECT first_name FROM graduates WHERE email=$1";

    pool
        .query(query, [graduateEmail])
        .then((result) => {
            if (result.rowCount) {
                res.status(400).json({ "status": 400, "error": "An account already exist" });
            } else {
                const query =

                    "INSERT INTO graduates ( first_name, last_name, email, password, class_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, class_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                pool
                    .query(query, [graduateFirstName, graduateLastName, graduateEmail, graduatePassword, graduateClassId])
                    .then((result) => res.json({ "success": "New graduate is created", "graduate": result.rows }))
                    .catch((e) => console.error(e));
            }
        });
});


//UPDATE a graduate detail with a specified Id
router.put("/graduates/:id", (req, res) => {
    const graduateId = req.params.id;

    const query =

        "SELECT id, first_name, last_name, email, password, class_id FROM graduates WHERE id = $1";

    pool
        .query(query, [graduateId])
        .then((result) => {
            if (result.rowCount === 0) {
                res.status(404).json({ "status": 404, "error": "No graduate found" });
            } else {
                const graduateFirstName = req.body.firstName;
                const graduateLastName = req.body.lastName;
                const graduateEmail = req.body.email;
                const graduatePassword = req.body.password;
                const graduateClass = req.body.class;

                let graduateClassId;

                graduateClass === "LDN06" ? graduateClassId = 1 : graduateClass === "WMS01" ? graduateClassId = 2 :
                graduateClass === "LDN07" ? graduateClassId = 3 : graduateClass === "WMS02" ? graduateClassId = 4 : null;

                let currentFirstName = result.rows[0].first_name;
                let currentLastName = result.rows[0].last_name;
                let currentEmail = result.rows[0].email;
                let currentPassword = result.rows[0].password;
                let currentClassId = result.rows[0].class_id;

                const query =

                    "UPDATE graduates SET first_name=$1, last_name=$2, email=$3, password=$4, class_id=$5 WHERE id=$6 RETURNING id, first_name, last_name, class_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                pool
                    .query(query, [graduateFirstName || currentFirstName, graduateLastName || currentLastName, graduateEmail || currentEmail, graduatePassword || currentPassword, graduateClassId || currentClassId, graduateId])
                    .then((result) => res.json({ "success": "Graduate details updated", "graduate": result.rows }))
                    .catch((e) => console.error(e));
            }
        })
        .catch((e) => console.error(e));
});


//DELETE a graduate with a specified Id at "/graduates/:id"
router.delete("/graduates/:id", (req, res) => {
    const graduateId = req.params.id;

    const query =

        "DELETE FROM graduates WHERE id=$1 RETURNING first_name , last_name";

    pool
        .query(query, [graduateId])
        .then((result) => {
            if (result.rowCount) {
                res.json({ "success": "Graduate is deleted" });
            } else {
                res.status(404).json({ "status" : 404, "error" : "No graduate found" });       
            } 
        })
        .catch((e) => console.error(e));
});


export default router;
