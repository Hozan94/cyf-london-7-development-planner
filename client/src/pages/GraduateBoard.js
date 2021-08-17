import React, { useState, useEffect } from "react";
import "./Dashboards.css";
import CreatePlan from "../components/CreatePlan";
import PlansTable from "../components/PlansTable";
import GraduateSideboard from "../components/GraduateSideboard";
import { Paper, Typography, Grid } from "@material-ui/core";

function GraduateBoard() {

    const [plans, setPlans] = useState([]);
    const [graduate, setGraduate] = useState([]);
    const [submitted, setSubmitted] = useState("");

    let graduate_id;

    async function getName() {
        try {
            const response = await fetch(
                "/api/dashboard/graduate",
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
                `/api/graduates/${graduate_id}/plans/goals`

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
            <header>
                <div className="header-title-container">
                    <Typography variant="h5" component="h1" >
                        Graduate:
                    </Typography>
                    <Typography variant="body2" >
                        {graduate.email}
                    </Typography>
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
                            <PlansTable graduateId={graduate.id} plans={plans} isMentor={false} isGraduate={true} />
                        </Paper>
                    </Grid>
                    <Grid item xs={8} md={3}>
                        <GraduateSideboard graduateId={graduate.id} />
                    </Grid>
                </Grid>
            </main>
        </div>
    );
}

export default GraduateBoard;
