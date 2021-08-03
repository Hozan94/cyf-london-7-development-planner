import React, { useState, useEffect } from "react";
import "./Dashboards.css";
import CreatePlan from "../components/CreatePlan";
//import PlansTable from '../components/PlansTable';
import Controls from "../components/controls/Controls";
import Test from "../components/Test";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import MentorDropDown from "../components/MentorDropDown";
function GraduateBoard() {
	const history = useHistory();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [graduate, setGraduate] = useState("");
	let graduate_id;
	async function getName() {
		try {
			const response = await fetch(
				"http://localhost:3000/api/dashboard/graduate",
				{
					method: "GET",
					headers: { token: localStorage.token },
				}
			);
          
            const parseRes = await response.json();
            graduate_id=parseRes.id;
			setGraduate(parseRes);
		} catch (err) {
			console.error(err.message);
		}

		try {
			const plans = await fetch(
				`http://localhost:3000/api/graduates/${graduate_id}/plans/goals`
				
			);

			const plansParse= await plans.json();
            setPlans(plansParse);
		} catch (err) {
			console.error(err.message);
		}
	}

	const logout = (e) => {
		e.preventDefault();
		// localStorage.removeItem("token");
		localStorage.clear();
		history.push(`/login`);
		toast.success("Logged out successfully");
	};

	useEffect(() => {
		getName();
	}, []);

	return (
		<div>
			<header className="header-container">
				<h1>Graduate Dashboard {graduate.id}</h1>
				<Controls.Button
					color="secondary"
					type="submit"
					text="Log Out"
					onClick={logout}
				/>
			</header>
			<main>
				<div className="plan-container">
					<div className="drop-down">
						<MentorDropDown />
					</div>

					<div className="c-1">
						<CreatePlan
							plan={setPlans}
							plansList={plans}
							graduateId={graduate.id}
						/>
						{/*<PlansTable plan={plans} />*/}
						<Test plans={plans} isMentor={false} />
					</div>
				</div>
			</main>
		</div>
	);
}

export default GraduateBoard;
