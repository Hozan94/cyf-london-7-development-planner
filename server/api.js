import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import { Pool } from "pg";
//const authorization = require('./middleware/authorization');
//const jwtGenerator = require('./utils/jwtGenerator');
import { authorization, jwtGenerator } from "./middleware";
import { pool } from "./db";
import { array } from "prop-types";

const bcrypt = require("bcrypt");

const router = new Router();

var format = require('pg-format');

router.get("/", (_, res) => {
    res.json({ message: "Hello, world!" });
});

//const dbUrl = process.env.DATABASE_URL || "postgres://localhost:5432/cyf";

//const pool = new Pool({
//    connectionString: dbUrl,
//});

//GET all "/graduates" OR get a graduate with a searchTerm included in their details "/graduates?q={searchTerm}"
router.get("/graduates", (req, res) => {
    const searchTerm = req.query.q;

    if (searchTerm) {
        //Get graduates when searchTerm is included in either last_name, first_name or class
        const query = `SELECT graduates.id, first_name, last_name, classes.class_code, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM graduates INNER JOIN classes ON graduates.class_id = classes.id WHERE first_name ILIKE '%${searchTerm}%' OR last_name ILIKE '%${searchTerm}%' OR classes.class_code ILIKE '%${searchTerm}%'`;

        pool
            .query(query)
            .then((result) => {
                if (result.rowCount) {
                    res.json(result.rows);
                } else {
                    res.status(404).json({ status: 404, error: "No graduates found" });
                }
            })
            .catch((error) => console.log(error));
    } else {
        //Get all graduates
        const query =
            "SELECT graduates.id, first_name, last_name, classes.class_code, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM graduates INNER JOIN classes ON graduates.class_id = classes.id ORDER BY graduates.id";

        pool
            .query(query)
            .then((result) => res.json({ graduates: result.rows }))
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
                res.json({ success: result.rows });
            } else {
                res.status(404).json({ status: 404, error: "No graduate found" });
            }
        })
        .catch((error) => console.log(error));
});

router.post("/register/graduates", (req, res) => {
    const { firstName, lastName, email, password, classCode } = req.body;
    let graduateClassId;

    //Validate all fields are filled in
    if (!firstName || !lastName || !email || !password || !classCode) {
        return res
            .status(400)
            .json({ status: 400, error: "Please fill in all fields" });
    }

    //Validate graduate does not exist (using email and password)
    const query = "SELECT first_name FROM graduates WHERE email = $1";

    pool
        .query(query, [email])
        .then((result) => {
            if (result.rowCount) {
                res
                    .status(400)
                    .json({ status: 400, error: "An account already exist" });
            } else {
                const query = "SELECT id FROM classes WHERE class_code = $1";

                pool
                    .query(query, [classCode])

                    .then(async (result) => {
                        const saltRound = 10;
                        const salt = await bcrypt.genSalt(saltRound);
                        const bcryptPassword = await bcrypt.hash(password, salt);
                        graduateClassId = result.rows[0].id;

                        const query =
                            "INSERT INTO graduates ( first_name, last_name, email, password, class_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, class_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                        pool
                            .query(query, [
                                firstName,
                                lastName,
                                email,
                                bcryptPassword,
                                graduateClassId,
                            ])
                            .then((result) => {
                                const token = jwtGenerator(result.rows[0].id);

                                res.json({ token });
                                //res.json({ "success": "New graduate is created", "graduate": result.rows })
                            })
                            .catch((e) => console.error(e));
                    })
                    .catch((e) => console.error(e));
            }
        })
        .catch((e) => console.error(e));
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
                res.status(404).json({ status: 404, error: "No graduate found" });
            } else {
                const graduateFirstName = req.body.firstName;
                const graduateLastName = req.body.lastName;
                const graduateEmail = req.body.email;
                const graduatePassword = req.body.password;
                const graduateClass = req.body.class;

                let graduateClassId;

                let currentFirstName = result.rows[0].first_name;
                let currentLastName = result.rows[0].last_name;
                let currentEmail = result.rows[0].email;
                let currentPassword = result.rows[0].password;
                let currentClassId = result.rows[0].class_id;

                const query = "SELECT id FROM classes WHERE class_code = $1";

                pool
                    .query(query, [graduateClass])
                    .then((result) => {
                        graduateClassId = result.rows[0].id;

                        const query =
                            "UPDATE graduates SET first_name=$1, last_name=$2, email=$3, password=$4, class_id=$5 WHERE id=$6 RETURNING id, first_name, last_name, class_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                        pool
                            .query(query, [
                                graduateFirstName || currentFirstName,
                                graduateLastName || currentLastName,
                                graduateEmail || currentEmail,
                                graduatePassword || currentPassword,
                                graduateClassId || currentClassId,
                                graduateId,
                            ])
                            .then((result) =>
                                res.json({
                                    success: "Graduate details updated",
                                    graduate: result.rows,
                                })
                            )
                            .catch((e) => console.error(e));
                    })
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
                res.json({ success: "Graduate is deleted" });
            } else {
                res.status(404).json({ status: 404, error: "No graduate found" });
            }
        })
        .catch((e) => console.error(e));
});

//GET all "/mentors" OR get a mentor with a searchTerm included in their details "/mentors?q={searchTerm}"
router.get("/mentors", (req, res) => {
    const searchTerm = req.query.q;

    if (searchTerm) {
        //Get mentors when searchTerm is included in either last_name, first_name or city
        const query = `SELECT mentors.id, first_name, last_name, cities.city_id TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM mentors INNER JOIN cities ON mentors.city_id = cities.id WHERE first_name ILIKE '%${searchTerm}%' OR last_name ILIKE '%${searchTerm}%' OR cities.city_name ILIKE '%${searchTerm}%'`;

        pool
            .query(query)
            .then((result) => {
                if (result.rowCount) {
                    res.json({ mentors: result.rows });
                } else {
                    res.status(404).json({ status: 404, error: "No mentors found" });
                }
            })
            .catch((error) => console.log(error));
    } else {
        //Get all mentors
        const query =
            "SELECT mentors.id, first_name, last_name, cities.city_name, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM mentors INNER JOIN cities ON mentors.city_id = cities.id ORDER BY mentors.id";

        pool
            .query(query)
            .then((result) => res.json({ mentors: result.rows }))
            .catch((error) => console.log(error));
    }
});

//GET a mentor with a specified ID at "/mentors/:id"
router.get("/mentors/:id", (req, res) => {
    const mentorId = req.params.id;

    const query =
        "SELECT mentors.id, first_name, last_name, cities.city_name, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM mentors INNER JOIN cities ON mentors.city_id = cities.id WHERE mentors.id = $1";

    pool
        .query(query, [mentorId])
        .then((result) => {
            if (result.rowCount) {
                res.json(result.rows);
            } else {
                res.status(404).json({ status: 404, error: "No mentors found" });
            }
        })
        .catch((error) => console.log(error));
});

//POST a new mentor at "/mentors"
router.post("/register/mentors", (req, res) => {
    const { firstName, lastName, email, password, city } = req.body;
    let mentorCityId;

    //Validate all fields are filled in
    if (!firstName || !lastName || !email || !password || !city) {
        return res
            .status(400)
            .json({ status: 400, error: "Please fill in all fields" });
    }

    //Validate mentor does not exist (using email and password)
    const query = "SELECT first_name FROM mentors WHERE email=$1";

    pool
        .query(query, [email])
        .then((result) => {
            if (result.rowCount) {
                res
                    .status(400)
                    .json({ status: 400, error: "An account already exist" });
            } else {
                const query = "SELECT id FROM cities WHERE city_name = $1";

                pool
                    .query(query, [city])
                    .then(async (result) => {
                        const saltRound = 10;
                        const salt = await bcrypt.genSalt(saltRound);
                        const bcryptPassword = await bcrypt.hash(password, salt);
                        mentorCityId = result.rows[0].id;

                        const query =
                            "INSERT INTO mentors ( first_name, last_name, email, password, city_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, city_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                        pool
                            .query(query, [
                                firstName,
                                lastName,
                                email,
                                bcryptPassword,
                                mentorCityId,
                            ])
                            .then((result) => {
                                const token = jwtGenerator(result.rows[0].id);

                                //const userType =
                                res.json({ token });
                            })
                            .catch((e) => console.error(e));
                    })
                    .catch((e) => console.error(e));
            }
        })
        .catch((e) => console.error(e));
});

//UPDATE a mentor detail with a specified Id at "/mentors/:id"
router.put("/mentors/:id", (req, res) => {
    const mentorId = req.params.id;

    const query =
        "SELECT id, first_name, last_name, email, password, city_id FROM mentors WHERE id = $1";

    pool
        .query(query, [mentorId])
        .then((result) => {
            if (result.rowCount === 0) {
                res.status(404).json({ status: 404, error: "No mentor found" });
            } else {
                const mentorFirstName = req.body.firstName;
                const mentorLastName = req.body.lastName;
                const mentorEmail = req.body.email;
                const mentorPassword = req.body.password;
                const mentorCity = req.body.city;

                let mentorCityId;

                let currentFirstName = result.rows[0].first_name;
                let currentLastName = result.rows[0].last_name;
                let currentEmail = result.rows[0].email;
                let currentPassword = result.rows[0].password;
                let currentCityId = result.rows[0].city_id;

                const query = "SELECT id FROM cities WHERE city_name = $1";

                pool
                    .query(query, [mentorCity])
                    .then((result) => {
                        mentorCityId = result.rows[0].id;

                        const query =
                            "UPDATE mentors SET first_name=$1, last_name=$2, email=$3, password=$4, city_id=$5 WHERE id=$6 RETURNING id, first_name, last_name, city_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                        pool
                            .query(query, [
                                mentorFirstName || currentFirstName,
                                mentorLastName || currentLastName,
                                mentorEmail || currentEmail,
                                mentorPassword || currentPassword,
                                mentorCityId || currentCityId,
                                mentorId,
                            ])
                            .then((result) =>
                                res.json({
                                    success: "Mentor details updated",
                                    mentor: result.rows,
                                })
                            )
                            .catch((e) => console.error(e));
                    })
                    .catch((e) => console.error(e));
            }
        })
        .catch((e) => console.error(e));
});

//DELETE a mentor with a specified Id at "/mentors/:id"
router.delete("/mentors/:id", (req, res) => {
    const mentorId = req.params.id;

    const query =
        "DELETE FROM mentors WHERE id=$1 RETURNING first_name , last_name";

    pool
        .query(query, [mentorId])
        .then((result) => {
            if (result.rowCount) {
                res.json({ success: "mentor is deleted" });
            } else {
                res.status(404).json({ status: 404, error: "No mentor found" });
            }
        })
        .catch((e) => console.error(e));
});

//POST for users logging in at "/users/login"
router.post("/users/login", (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    let userType;

    const query = "SELECT * FROM graduates WHERE email = $1 ";

    pool
        .query(query, [userEmail])
        .then(async (result) => {
            if (result.rowCount) {
                if (await bcrypt.compare(userPassword, result.rows[0].password)) {
                    const token = jwtGenerator(result.rows[0].id);
                    userType = "graduate";
                    res.json({ token, userType });
                } else {
                    res
                        .status(404)
                        .json({ status: 404, error: "Incorrect email/passsword" });
                }
            } else {
                const query = "SELECT * FROM mentors WHERE email = $1 ";

                pool
                    .query(query, [userEmail])
                    .then(async (result) => {
                        if (result.rowCount) {
                            if (await bcrypt.compare(userPassword, result.rows[0].password)) {
                                const token = jwtGenerator(result.rows[0].id);
                                userType = "mentor";
                                res.json({ token, userType });
                            } else {
                                res
                                    .status(404)
                                    .json({ status: 404, error: "Incorrect email/passsword" });
                            }
                        } else {
                            res
                                .status(404)
                                .json({ status: 404, error: "No matching email/passsword" });
                        }
                    })
                    .catch((e) => console.error(e));
            }
        })
        .catch((e) => console.error(e));
});

router.get("/dashboard/:role", authorization, async (req, res) => {
    const role = req.params.role;

    try {
        //req.user has the payload
        const user = await pool.query(
            `SELECT id, first_name, last_name, email FROM ${role}s WHERE id = $1`,
            [req.user]
        );
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("server errors");
    }
});

//api/is-verify
router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

// ************************************ plans and goals ****************
router.get("/graduates/:graduate_id/plans", (req, res) => {
    const graduateId = req.params.graduate_id;
    // /graduates/:graduate_id/plans/:plan_id/goals
    const query = "SELECT * FROM plans WHERE graduate_id=$1";

    pool
        .query(query, [graduateId])
        .then((result) => {
            if (result.rowCount) {
                // res.json({ success: "Graduate's plans are found " });
                res.json(result.rows);
            } else {
                res.status(404).json({ status: 404, error: "No graduate found" });
            }
        })
        .catch((e) => console.error(e));
});
router.get("/graduates/:graduate_id/:plan_id([0:9])", (req, res) => {
    const graduateId = req.params.graduate_id;
    const planId = req.params.plan_id;
    const query = "SELECT * FROM plans WHERE graduate_id=$1 and id=$2";

    pool
        .query(query, [graduateId, planId])
        .then((result) => {
            console.log(result);
            if (result.rowCount) {
                // res.json({ success: "Graduate's plans are found " });
                res.json(result.rows);
            } else {
                res.status(404).json({
                    status: 404,
                    error: "This graduate doesn't have such a plan id",
                });
            }
        })
        .catch((e) => console.error(e));
});

router.get(
    "/graduates/:graduate_id/plans/:plan_id([0:9])/goals",
    (req, res) => {
        const graduateId = req.params.graduate_id;
        const planId = req.params.plan_id;
        const query = `select goals.id,goals.goal_details,goals.due_date
                    from goals inner join plans on plans.id=goals.plan_id
                    where plans.graduate_id=$1 and goals.plan_id=$2;`;

        pool
            .query(query, [graduateId, planId])
            .then((result) => {
                if (result.rowCount) {
                    // res.json({ success: "Graduate's plans are found " });
                    res.json(result.rows);
                } else {
                    res.status(404).json({
                        status: 404,
                        error: "Make sure this graduate id has this plan id",
                    });
                }
            })
            .catch((e) => console.error(e));
    }
);
router.get("/graduates/:graduate_id/goals", (req, res) => {
    const graduateId = req.params.graduate_id;
    // const planId = req.params.plan_id;
    // /graduates/:graduate_id/plans/:plan_id/goals
    const query = `select plans.id,plans.graduate_id, plans.plan_name,array_agg(goals.goal_details) goals_list
                    from goals inner join plans on plans.id=goals.plan_id
                    where plans.graduate_id=$1 group by plans.id,plans.graduate_id, plans.plan_name`;

    pool
        .query(query, [graduateId])
        .then((result) => {
            if (result.rowCount) {
                // res.json({ success: "Graduate's goals are found " });
                res.json(result.rows);
            } else {
                res.status(404).json({
                    status: 404,
                    error: "This graduate doesn't have any goals.",
                });
            }
        })
        .catch((e) => console.error(e));
});

router.post("/graduates/:graduate_id/plans/goals", (req, res) => {
    const { plan_name, goals_list } = req.body; // this is found in the fetch body
    const graduateId = req.params.graduate_id; // this is found in the fetch url
    // const goals_list=[{goal_details:"text1"},{goal_details:"text2"}]
    //Validate all fields are filled in
    if (!plan_name || !graduateId) {
        return res.status(400).json({
            status: 400,
            error: "This api endpoint requires plan name and graduate id",
        });
    }

    const query = "SELECT * FROM plans WHERE plan_name=$1 and graduate_id=$2";

    pool
        .query(query, [plan_name, graduateId])
        .then((result) => {
            if (result.rowCount) {
                res.status(400).json({
                    status: 400,
                    error:
                        "Please change the plan name, this graduate has already got a plan with the same name",
                });
            } else {
                const query_plan =
                    "INSERT INTO plans (plan_name,graduate_id) VALUES ($1,$2) RETURNING id";

                pool
                    .query(query_plan, [plan_name, graduateId])
                    .then((result) => {
                        for (let i=0; i<goals_list.length; i++){
                            const query_goals =
                                "INSERT INTO goals (plan_id,goal_details,due_date,remarks,goal_status_id) VALUES($1,$2,$3,$4,$5)";
                            pool
                                .query(query_goals, [
                                    result.rows[0].id,
                                    item.goal_details,
                                    item.due_date,
                                    item.remarks,
                                    1,
                                ], (error, results) => {
                                    if (error) {
                                        throw error
                                    } else {
                                        console.log("Rows " + JSON.stringify(results.rows));
                                    }
                                })
                        }
                        //goals_list.forEach((item) => {
                        //    console.log(item);
                        //    // item.goal_details
                        //    console.log(`API: ${item.due_date}`)
                        //    const query_goals =
                        //        "INSERT INTO goals (plan_id,goal_details,due_date,remarks,goal_status_id) VALUES($1,$2,$3,$4,$5)";
                        //    pool
                        //        .query(query_goals, [
                        //            result.rows[0].id,
                        //            item.goal_details,
                        //            item.due_date,
                        //            item.remarks,
                        //            1,
                        //        ])
                        //        .catch((e) => console.error(e));
                        //});

                    })
                    .catch((e) => console.error(e));
            }
        })
        .catch((e) => console.error(e));
});

router.get("/graduates/:graduate_id/plans/goals", async (req, res) => {
    try {
        const graduate_plans = await pool.query(
            `select plans.id,plans.plan_name ,
                    json_agg(json_build_object('goal_details',goals.goal_details,'due_date',goals.due_date,'remarks',goals.remarks))
                     goals_list from goals inner join plans on plans.id=goals.plan_id where graduate_id=$1 group by 1,2 ;`,
            [req.params.graduate_id]
        );
        res.json(graduate_plans.rows);
    } catch (err) {
        res.status(500).send("server error");
    }
});

/******************feedbacks endpoints */

router.get("/mentors/:mentor_id/feedbacks", async (req, res) => {
    try {
        // no need to check if mentor id is valid as mentors are already signed in
        // const feedback_requests = await pool.query("select * from feedbacks where mentor_id=$1", [req.params.mentor_id]);
        // res.json(feedback_requests.rows);
        const feedback_requests = await pool.query(
            `select plans.id,concat(graduates.first_name,' ',graduates.last_name) as name,feedbacks.feedback_requested_date,feedbacks.mentor_id,plans.plan_name,
                       feedbacks.feedback_details,json_agg(json_build_object('goal_details',goals.goal_details,'due_date',goals.due_date, 'remarks', goals.remarks)) as goals_list
                        from goals 
                        inner join plans on plans.id=goals.plan_id 
                        inner join graduates on graduates.id=plans.graduate_id 
                        inner join feedbacks on feedbacks.plan_id=goals.plan_id
                        where feedbacks.mentor_id=$1
                        group by plans.id,plans.graduate_id, plans.plan_name,feedbacks.feedback_details,
                        graduates.first_name,graduates.last_name,
                        feedbacks.feedback_requested_date,feedbacks.mentor_id;`,
            [req.params.mentor_id]
        );
        res.json(feedback_requests.rows);
    } catch (err) {
        res.status(500).send("server error");
    }
    //{user,feedback_requests}
});

router.post("/mentors/:mentor_id/feedbacks", async (req, res) => {
    const { id } = req.body;
    const mentor_id = req.params.mentor_id;

    try {
        console.log(mentor_id, id);
        await pool.query(
            "INSERT INTO feedbacks(plan_id, mentor_id) VALUES ($1,$2)",
            [id, mentor_id]
        );

        res.json("feedback send successfully");
    } catch (err) {
        res.status(500).send(err, "server error");
    }
});

// send feedback from mentor dashboard

router.put("/mentors/:mentor_id/:plan_id/feedbacks", async (req, res) => {
    const { feedback_details } = req.body;
    const { plan_id, mentor_id } = req.params;

    try {
        await pool.query(
            "UPDATE feedbacks SET feedback_details=$1 WHERE plan_id=$2 AND mentor_id=$3",
            [feedback_details, plan_id, mentor_id]
        );

        res.json("feedback send successfully");
    } catch (err) {
        res.status(500).send(err, "server error");
    }
});

// for graduates to see the feedbacks
router.get("/graduates/:graduate_id/feedbacks", async (req, res) => {
    try {
        const feedbacks = await pool.query(
            `select f.feedback_details,f.plan_id,f.feedback_date,f.read_by_grad,plans.plan_name  , 
			concat(mentors.first_name,' ',mentors.last_name) as name  from feedbacks f  inner join 
			plans on plans.id=f.plan_id inner join mentors on mentors.id=f.mentor_id  
			where graduate_id=$1 and f. feedback_details is not NULL;`,
            [req.params.graduate_id]
        );
        res.json(feedbacks.rows);
        // res.json("feedbacks retrieved from feedbacks table")
    } catch (err) {
        res.status(500).send(err, "server error");
    }
});

router.put("/graduates/:graduate_id/:plan_id/feedbacks", async (req, res) => {
    const { read_by_grad } = req.body;
    const { plan_id } = req.params;

    try {
        const result = await pool.query(
            "UPDATE feedbacks SET read_by_grad=$1 WHERE plan_id=$2 RETURNING *",
            [read_by_grad, plan_id]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err, "server error");
    }
});

//Delete a graduate plan with specified IDs

router.delete("/graduates/:graduate_id/:plan_id", async (req, res) => {
    const { graduate_id, plan_id } = req.params;

    if (!graduate_id || !plan_id) {
        res.status(404).json({ "status": 404, "error": "No graduate/plan found" });
    }

    try {

        const deleteGoals = await pool.query(
            "DELETE FROM goals WHERE plan_id=$1", [plan_id]
        )

        const deleteFeedbacks = await pool.query(
            "DELETE FROM feedbacks WHERE plan_id=$1", [plan_id]
        )

        const result = await pool.query(
            "DELETE FROM plans WHERE plans.id=$1 AND graduate_id=$2", [plan_id, graduate_id]
        );

        res.json({ "Success": "Plan is deleted" });
    } catch (err) {
        res.status(500).send("server error")
    }
})



// ********** cities endpoint ********///
router.get("/cities", async (req, res) => {
    try {
        const cities_list = await pool.query(` select * from cities `);
        res.json(cities_list.rows);
    } catch (err) {
        res.status(500).send(err, "server error");
    }
});

// ********** classes endpoint ********///

router.get("/classes", async (req, res) => {
    try {
        const classes_list = await pool.query(` select * from classes `);
        res.json(classes_list.rows);
    } catch (err) {
        res.status(500).send(err, "server error");
    }
});
export default router;
