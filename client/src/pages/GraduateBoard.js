import React, { useState, useEffect } from "react";
import "./Dashboards.css";
import CreatePlan from "../components/CreatePlan";
import Controls from "../components/controls/Controls";
import Test from "../components/Test";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import Sidebar from "../components/Sidebar";
import { Paper } from "@material-ui/core";

function GraduateBoard() {
    const history = useHistory();

    const [plans, setPlans] = useState([]);
    const [graduate, setGraduate] = useState("");
    const [submitted, setSubmitted] = useState("");
    
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
            graduate_id = parseRes.id;
            setGraduate(parseRes);
        } catch (err) {
            console.error(err.message);
        }

        try {
            const plans = await fetch(
                `http://localhost:3000/api/graduates/${graduate_id}/plans/goals`

            );

            const plansParse = await plans.json();
            setPlans(plansParse);
        } catch (err) {
            console.error(err.message);
        }
    }

    const logout = (e) => {
        e.preventDefault();
        localStorage.clear();
        history.push(`/login`);
        toast.success("Logged out successfully");
    };

    useEffect(() => {
        getName();
    }, [submitted]);

    return (
        <div>
            <header className="header-container">
                <div className="header-title-container">
                    <h1>Graduate Dashboard {graduate.id}</h1>
                    <Controls.Button
                        color="secondary"
                        type="submit"
                        text="Log Out"
                        onClick={logout}
                    />
                </div>
            </header>
            <main className="wrapper">
                <Sidebar graduateId={graduate.id} />
                <Paper className="plan-container ">
                    <CreatePlan
                        submitted={setSubmitted}
                        plansList={plans}
                        graduateId={graduate.id}
                    />
                    <Test graduateId={graduate.id} plans={plans} isMentor={false} isGraduate={true}/>
                </Paper>
            </main>
        </div>
    );
}

export default GraduateBoard;
