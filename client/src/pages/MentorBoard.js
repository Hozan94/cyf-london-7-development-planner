import React, { useState, useEffect } from 'react';
import './Dashboards.css';
import Test from '../components/Test'
import Controls from '../components/controls/Controls';
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import MentorSidebar from "../components/MentorSidebar";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    requestedFeedbackTableTitle: {
        padding: theme.spacing(1.8),
    },
    feedbackCount: {
        fontWeight: '900'
    }
}))


function MentorBoard() {

    const classes = useStyles()

    const history = useHistory();

    const [outstandingFeedbacks, setOutstandingFeedbacks] = useState([]);
    const [completedFeedbacks, setCompletedFeedbacks] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [mentor, setMentor] = useState();
    let mentor_id;

    async function getFeedbacksRequests() {
        try {
            const response = await fetch("http://localhost:3000/api/dashboard/mentor", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            mentor_id = parseRes.id;

            setMentor(parseRes);

        } catch (err) {
            console.error(err.message)
        }

        try {
            const feedback = await fetch(`http://localhost:3000/api/mentors/${mentor_id}/feedbacks`);

            const feedbackRes = await feedback.json();
            let outstandingFeedbacks = feedbackRes.filter(
                (plan) => plan.feedback_details === null
            );
            let completedFeedbacks = feedbackRes.filter(
                (plan) => plan.feedback_details !== null
            );
            setOutstandingFeedbacks(outstandingFeedbacks);
            setCompletedFeedbacks(completedFeedbacks);
            setLoading(false);

        } catch (err) {
            console.error(err.message)
        }
    }
    
    useEffect(() => {
        getFeedbacksRequests();
    }, []);

    return (
        <div>
            <header className="header-container">
                <div className="header-title-container">
                    <h1>Mentor Dashboard <span className="email">{mentor ? mentor.email : null}</span></h1>
                </div>
            </header>
            <main className="wrapper">
                <MentorSidebar plans={completedFeedbacks} />
                <Paper className="plan-container ">
                    <Typography variant="body1" className={classes.requestedFeedbackTableTitle}>
                        Number of feedback requested: <span className={classes.feedbackCount}>{outstandingFeedbacks.length}</span>
                    </Typography>
                    {loading ?
                        <h5>Loading.....</h5>
                        :
                        <Test
                            plans={outstandingFeedbacks}
                            isMentor={true}
                            isGraduate={false}
                            mentorId={mentor.id}
                        />
                    }
                </Paper>
            </main>
        </div>
    );
};

export default MentorBoard;
