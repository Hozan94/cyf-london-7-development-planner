import { Router } from "express";
import { Pool } from "pg";
//const authorization = require('./middleware/authorization');
//const jwtGenerator = require('./utils/jwtGenerator');
import { authorization, jwtGenerator } from "./middleware";
import { pool } from "./db";

const bcrypt = require("bcrypt");

const router = new Router();

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
        const query =

            `SELECT graduates.id, first_name, last_name, classes.class_code, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM graduates INNER JOIN classes ON graduates.class_id = classes.id WHERE first_name ILIKE '%${searchTerm}%' OR last_name ILIKE '%${searchTerm}%' OR classes.class_code ILIKE '%${searchTerm}%'`;

        pool
            .query(query)
            .then((result) => {
                if (result.rowCount) {
                    res.json(result.rows);
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
                res.json({ "success": result.rows });
            } else {
                res.status(404).json({ "status": 404, "error": "No graduate found" });
            }
        })
        .catch((error) => console.log(error));
});

//router.post("/register", async (req, res) => {

//    try {

//        // 1.destaructure req.body
//        const { firstName, lastName, email, password } = req.body;
//        const graduateClass = req.body.classCode;
//        let graduateClassId;
//        // 2. check if user exist then throw error
//        const user = await pool.query("SELECT * FROM graduates WHERE email = $1", [
//            email
//        ]);

//        if (user.rows.length !== 0) {
//            res.status(401).json("user Already Exist");
//        }


//        const userClass = await pool.query("SELECT id FROM classes WHERE class_code = $1", [graduateClass]);

//        graduateClassId = userClass.rows[0].id;

//        // 3. bcrypt user password
//        const saltRound = 10;
//        const salt = await bcrypt.genSalt(saltRound);
//        const bcryptPassword = await bcrypt.hash(password, salt)


//        // 4. enter new user inside the database
//        const newUser = await pool.query("INSERT INTO graduates (first_name,last_name,email,password,class_id) values($1,$2,$3,$4,$5) RETURNING *", [firstName, lastName, email, bcryptPassword, graduateClassId]);
//        //res.json(newUser.rows[0]);
//        // 5. generating jwttoken

//        const token = jwtGenerator(newUser.rows[0].id);

//        res.json({ token });

//    } catch (err) {
//        console.error(err.message);
//        res.status(500).send("server error");

//    }
//});
//POST a new graduate at "/graduates"
router.post("/register/graduates", (req, res) => {

    const { firstName, lastName, email, password, classCode } = req.body;
    let graduateClassId;

    //Validate all fields are filled in
    if (!firstName || !lastName || !email || !password || !classCode) {
        return res.status(400).json({ "status": 400, "error": "Please fill in all fields" });
    }

    //Validate graduate does not exist (using email and password)
    const query =

        "SELECT first_name FROM graduates WHERE email = $1";

    pool
        .query(query, [email])
        .then((result) => {
            if (result.rowCount) {
                res.status(400).json({ "status": 400, "error": "An account already exist" });
            } else {
                const query =

                    "SELECT id FROM classes WHERE class_code = $1";

                pool
                    .query(query, [classCode])
                    .then((result) => {
                        graduateClassId = result.rows[0].id;

                        // const saltRound = 10;
                        // const salt = bcrypt.genSalt(saltRound);
                        // const bcryptPassword = bcrypt.hash(password, salt);

                        const query =

                            "INSERT INTO graduates ( first_name, last_name, email, password, class_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, class_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                        pool
                            .query(query, [firstName, lastName, email, password, graduateClassId])
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
                res.status(404).json({ "status": 404, "error": "No graduate found" });
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

                const query =

                    "SELECT id FROM classes WHERE class_code = $1";

                pool
                    .query(query, [graduateClass])
                    .then((result) => {
                        graduateClassId = result.rows[0].id;

                        const query =

                            "UPDATE graduates SET first_name=$1, last_name=$2, email=$3, password=$4, class_id=$5 WHERE id=$6 RETURNING id, first_name, last_name, class_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                        pool
                            .query(query, [graduateFirstName || currentFirstName, graduateLastName || currentLastName, graduateEmail || currentEmail, graduatePassword || currentPassword, graduateClassId || currentClassId, graduateId])
                            .then((result) => res.json({ "success": "Graduate details updated", "graduate": result.rows }))
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
                res.json({ "success": "Graduate is deleted" });
            } else {
                res.status(404).json({ "status": 404, "error": "No graduate found" });
            }
        })
        .catch((e) => console.error(e));
});


//GET all "/mentors" OR get a mentor with a searchTerm included in their details "/mentors?q={searchTerm}"
router.get("/mentors", (req, res) => {
    const searchTerm = req.query.q;

    if (searchTerm) {
        //Get mentors when searchTerm is included in either last_name, first_name or city
        const query =

            `SELECT mentors.id, first_name, last_name, cities.city_id TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM mentors INNER JOIN cities ON mentors.city_id = cities.id WHERE first_name ILIKE '%${searchTerm}%' OR last_name ILIKE '%${searchTerm}%' OR cities.city_name ILIKE '%${searchTerm}%'`;

        pool
            .query(query)
            .then((result) => {
                if (result.rowCount) {
                    res.json({ "mentors": result.rows });
                } else {
                    res.status(404).json({ "status": 404, "error": "No mentors found" });
                }
            })
            .catch((error) => console.log(error));

    } else {
        //Get all mentors
        const query =

            "SELECT mentors.id, first_name, last_name, cities.city_name, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date FROM mentors INNER JOIN cities ON mentors.city_id = cities.id ORDER BY mentors.id";

        pool
            .query(query)
            .then((result) => res.json({ "graduates": result.rows }))
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
                res.status(404).json({ "status": 404, "error": "No mentors found" });
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
        return res.status(400).json({ "status": 400, "error": "Please fill in all fields" });
    }

    //Validate mentor does not exist (using email and password)
    const query =

        "SELECT first_name FROM mentors WHERE email=$1";

    pool
        .query(query, [email])
        .then((result) => {
            if (result.rowCount) {
                res.status(400).json({ "status": 400, "error": "An account already exist" });
            } else {
                const query =

                    "SELECT id FROM cities WHERE city_name = $1";

                pool
                    .query(query, [city])
                    .then((result) => {
                        mentorCityId = result.rows[0].id;

                        //async function hashIt(password) {
                        //    const salt = await bcrypt.genSalt(6);
                        //    const hashed = await bcrypt.hash(password, salt);
                        //    return hashed;
                        //}

                        //const salt = bcrypt.genSaltSync(6)
                        //const hashed = bcrypt.hashSync(password, salt)

                        const query =

                            "INSERT INTO mentors ( first_name, last_name, email, password, city_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, city_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                        pool
                            .query(query, [firstName, lastName, email, password, mentorCityId])
                            .then((result) => {
                                const token = jwtGenerator(result.rows[0].id);

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
                res.status(404).json({ "status": 404, "error": "No mentor found" });
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

                const query =
                    "SELECT id FROM cities WHERE city_name = $1";

                pool
                    .query(query, [mentorCity])
                    .then((result) => {
                        mentorCityId = result.rows[0].id;

                        const query =

                            "UPDATE mentors SET first_name=$1, last_name=$2, email=$3, password=$4, city_id=$5 WHERE id=$6 RETURNING id, first_name, last_name, city_id, TO_CHAR(sign_up_date:: DATE, 'yyyy-mm-dd') AS sign_up_date";

                        pool
                            .query(query, [mentorFirstName || currentFirstName, mentorLastName || currentLastName, mentorEmail || currentEmail, mentorPassword || currentPassword, mentorCityId || currentCityId, mentorId])
                            .then((result) => res.json({ "success": "Mentor details updated", "mentor": result.rows }))
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
                res.json({ "success": "mentor is deleted" });
            } else {
                res.status(404).json({ "status": 404, "error": "No mentor found" });
            }
        })
        .catch((e) => console.error(e));
});


//POST for users logging in at "/users/login"
router.post("/users/login", (req, res) => {
    //try {
    //    // destructure req.body
    //    const { email, password } = req.body;

    //    // check if user exist if not trw err
    //    const user = await pool.query("SELECT *  FROM graduates  where email = $1 ", [email]);

    //    if (user.rows.length === 0) {
    //        return res.status(401).json("user does not exist")
    //    }

    //    //check if password entered is same as database password

    //    //const validPassword = await bcrypt.compare(password, user.rows[0].password);
    //    // if everything ok then give them jw token
    //    if (!password) {
    //        return res.status(401).json("password or email is incorrect")
    //    }

    //    const token = jwtGenerator(user.rows[0].id)
    //    const userFirstName = user.rows[0].first_name
    //    //console.log(token, userEmail)
    //   res.json({ token, userFirstName })
    //    //res.send()
    //} catch (err) {
    //    console.error(err.message);
    //    res.status(500).send("server error");
    //}

    const userEmail = req.body.email;
    const userPassword = req.body.password;
    let userType;

    const query =

        "SELECT id FROM graduates WHERE email = $1 AND password = $2";

    pool
        .query(query, [userEmail, userPassword])
        .then((result) => {
            if (result.rowCount) {
                const token = jwtGenerator(result.rows[0].id);

                userType = "graduate";

                res.json({ token, userType })
                //res.json({ "success": "Graduate logged in" })
            } else {
                const query =

                    "SELECT id FROM mentors WHERE email = $1 AND password = $2";

                pool
                    .query(query, [userEmail, userPassword])
                    .then((result) => {
                        if (result.rowCount) {
                            const token = jwtGenerator(result.rows[0].id);

                            userType = "mentor";

                            res.json({ token, userType });
                            //res.json(res.json({ "success": "Mentor logged in" }))
                        } else {
                            res.status(404).json({ "status": 404, "error": "No matching email/passsword" });
                        }
                    })
                    .catch((e) => console.error(e));
            }
        })
        .catch((e) => console.error(e));
});


router.get("/dashboard/:role", authorization, async (req, res) => {
    const role = req.params.role

    try {
        //req.user has the payload
        const user = await pool.query(`SELECT first_name FROM ${role}s WHERE id = $1`, [req.user]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("server errors");
    }

});

//api/is-verify
router.get("/is-verify", authorization,
    async (req, res) => {
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
			const query = `SELECT * FROM plans WHERE graduate_id=$1`;

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
				// adding plans and goals post requests
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

					const query =
						"SELECT * FROM plans WHERE plan_name=$1 and graduate_id=$2";

					pool.query(query, [plan_name, graduateId]).then((result) => {
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
									goals_list.map((item) => {
										console.log(item);
										// item.goal_details
										const query_goals = `INSERT INTO goals (plan_id,goal_details,goal_status_id) VALUES($1,$2,$3)`;
										pool
											.query(query_goals, [
												result.rows[0].id,
												item.goal_details,
												1,
											])
											.then(() => {
												res.json({
													success: "All the goals are saved ",
												});
											});
									});
								})
								.catch((e) => console.error(e));
						}
					});
				});
export default router;
