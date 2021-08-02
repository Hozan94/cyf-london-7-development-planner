import React, { useState, useEffect } from 'react';
import './Dashboards.css';
import Test from '../components/Test'
import Controls from '../components/controls/Controls';
import { toast } from "react-toastify";



function MentorBoard({ setAuth }) {

    //const fakeData = [
    //    {
    //        name: "Hozan Ali",
    //        feedback_requested_date: "20/05/2021",
    //        plan_name: "Make a website about your products and add the option of purchase",
    //        goals_list: [
    //            {
    //                goal_details: "Create the Front End",
    //                due_date: "24/05/2021",
    //                remarks: "Use Express.js to build it and bcrypt to store passwords",
    //            }, {
    //                goal_details: "Create the Back End",
    //                due_date: "28/05/2021",
    //                remarks: "Use React and React Hooks alongside Bootstrap",
    //            },
    //            {
    //                goal_details: "Create the Data Base",
    //                due_date: "22/05/2021",
    //                remarks: "Use Postgress and Postgress Node",
    //            }
    //        ]
    //    },
    //    {
    //        name: "Hozan Ali",
    //        feedback_requested_date: "20/05/2021",
    //        plan_name: "Make a website about your products and add the option of purchase",
    //        goals_list: [
    //            {
    //                goal_details: "Create the Front End",
    //                due_date: "24/05/2021",
    //                remarks: "Use Express.js to build it and bcrypt to store passwords",
    //            }, {
    //                goal_details: "Create the Back End",
    //                due_date: "28/05/2021",
    //                remarks: "Use React and React Hooks alongside Bootstrap",
    //            },
    //            {
    //                goal_details: "Create the Data Base",
    //                due_date: "22/05/2021",
    //                remarks: "Use Postgress and Postgress Node",
    //            }
    //        ]
    //    }

    //]

    const [plans, setPlans] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [mentor, setMentor] = useState();
    let id;

    async function getName() {
        try {
            const response = await fetch("http://localhost:3000/api/dashboard/mentor", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            id = parseRes.id;
            console.log(parseRes);

            setMentor(parseRes);

        } catch (err) {
            console.error(err.message)
        }

        try {
            const feedback = await fetch(`http://localhost:3000/api/mentors/${id}/feedbacks`);

            const feedbackRes = await feedback.json();
            setPlans(feedbackRes);
            setLoading(false);
            console.log(feedbackRes);

        } catch (err) {
            console.error(err.message)
        }
    }
console.log(mentor)
    const logout = (e) => {
        e.preventDefault()
        localStorage.clear();
        setAuth(false);
        toast.success("Logged out successfully");
    }

    useEffect(() => {
        getName();
    }, []);

    return (
        <div>
            <header className="header-container">
                <h1>Mentor Dashboard <span className="email">{mentor ? mentor.email : null}</span></h1>
                <Controls.Button
                    color="secondary"
                    type="submit"
                    text="Log Out"
                    onClick={logout}
                />
            </header>
            <main>
                {/*<CreatePlan plan={setPlans} plansList={plans} />*/}
                {loading ? <h2>Loading.....</h2> : <h3 className="feedback-count">{`Number of feedback requested ${plans.length}`}</h3>}
                {loading ? <h2>Loading.....</h2> : <Test plans={plans} isMentor={true} />}
                {/*{plans.error ? <h1>{plans.error}</h1> : <Test plan={plans} isMentor={true} />}*/}
                {/*<Test plan={plans} isMentor={true} />*/}
            </main>
        </div >
    )
};

export default MentorBoard;
