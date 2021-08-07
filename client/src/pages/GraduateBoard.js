import React, { useState, useEffect } from "react";
import "./Dashboards.css";
import CreatePlan from "../components/CreatePlan";
import Controls from "../components/controls/Controls";
import Test from "../components/Test";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import Sidebar from "../components/Sidebar";
import { Paper } from "@material-ui/core";
import Grid from '@material-ui/core/Grid'

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

    useEffect(() => {
        getName();
    }, [submitted]);

    return (
        <div>
            <header className="header-container">
                <div className="header-title-container">
                    <h1>Graduate Dashboard {graduate.id}</h1>
                </div>
            </header>
            <main className="wrapper">
                <Grid container className="grid-container">
                    <Grid item xs={11} md={8}>
                        <Paper className="gridItem">
                            <CreatePlan
                                submitted={setSubmitted}
                                plansList={plans}
                                graduateId={graduate.id}
                            />
                            <Test graduateId={graduate.id} plans={plans} isMentor={false} isGraduate={true} />
                        </Paper>
                    </Grid>
                    <Grid item xs={8} md={3}>
                        <Sidebar graduateId={graduate.id} />
                    </Grid>
                </Grid>

                {/*</Grid>*/}

            </main>
        </div>
    );
}

export default GraduateBoard;
