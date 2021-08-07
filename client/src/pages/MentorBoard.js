import React, { useState, useEffect } from 'react';
import './Dashboards.css';
import Test from '../components/Test'
import Controls from '../components/controls/Controls';
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import MentorSidebar from "../components/MentorSidebar";

function MentorBoard() {
    const history = useHistory();

    const [plans, setPlans] = useState();
    const [completedPlans, setCompletedPlans] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [mentor, setMentor] = useState();
    let mentor_id;

    async function getName() {
        try {
            const response = await fetch("http://localhost:3000/api/dashboard/mentor", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            mentor_id = parseRes.id;
           // console.log(parseRes);

            setMentor(parseRes);

        } catch (err) {
            console.error(err.message)
        }

        try {
            const feedback = await fetch(`http://localhost:3000/api/mentors/${mentor_id}/feedbacks`);

            const feedbackRes = await feedback.json();
            let outstanding_plans = feedbackRes.filter(
							(plan) =>plan.feedback_details === null
            );
            let completed_plans = feedbackRes.filter(
							(plan) => plan.feedback_details !== null
						);
            setPlans(outstanding_plans);
            setCompletedPlans(completed_plans);
            // setPlans(feedbackRes);
            setLoading(false);
           // console.log(feedbackRes);

        } catch (err) {
            console.error(err.message)
        }
    }

    const logout = (e) => {
        e.preventDefault();
        // localStorage.removeItem("token");
        localStorage.clear();
        history.push(`/login`);
        toast.success("Logged out successfully");
    }
    // console.log(plans);
    // function filterPlans() {
    //     if(plans){
    //     let filtered_plans = plans.filter(
	// 				(plan) => plan.feedback_details.length !== 0
    //     );
    //         return filtered_plans;
    // }
        
    // }
    
   
    useEffect(() => {
        getName();
        // filterPlans();
         
    }, []);
    //  useEffect(() => {
	// 			getName();
	// 		}, [handleSubmit---feedback_details]);


    return (
			<div>
				<header className="header-container">
					<h1>
						Mentor Dashboard
						<span className="email">{mentor ? mentor.email : null}</span>
					</h1>
					{/* <Controls.Button
						color="secondary"
						type="submit"
						text="Log Out"
						onClick={logout}
					/> */}
				</header>
				<main className="wrapper">
					{/*<CreatePlan plan={setPlans} plansList={plans} />*/}
					<MentorSidebar plans={completedPlans} />
					<div className="plan-container">
						{loading ? (
							<h2>Loading.....</h2>
						) : (
							<h3 className="feedback-count">{`Number of feedbacks requested ${plans.length}`}</h3>
						)}
						{loading ? (
							<h2>Loading.....</h2>
						) : (
							<Test
								plans={plans}
								isMentor={true}
								isGraduate={false}
								mentorId={mentor.id}
							/>
						)}
						{/*{plans.error ? <h1>{plans.error}</h1> : <Test plan={plans} isMentor={true} />}*/}
						{/*<Test plan={plans} isMentor={true} />*/}
					</div>
				</main>
			</div>
		);
};

export default MentorBoard;
