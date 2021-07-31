import { Router } from "express";
const router = new Router();
// GET requests for plans and goals
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
				res
					.status(404)
					.json({
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
					res
						.status(404)
						.json({
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
				res
					.status(404)
					.json({
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
		return res
			.status(400)
			.json({
				status: 400,
				error: "This api endpoint requires plan name and graduate id",
			});
	}

	const query = "SELECT * FROM plans WHERE plan_name=$1 and graduate_id=$2";

	pool.query(query, [plan_name, graduateId]).then((result) => {
		if (result.rowCount) {
			res
				.status(400)
				.json({
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
							.query(query_goals, [result.rows[0].id, item.goal_details, 1])
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
