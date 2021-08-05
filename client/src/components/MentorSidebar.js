import React, { useState, useEffect, useRef } from 'react'
import "./aside.css";
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';


const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgb(205 234 255)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme) => ({
    readByGrad: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
    },
}))


function MentorSidebar({plans}) {

    const classes = useStyles();

    const [feedbackDetails, setFeedbackDetails] = useState([]);

    const [expanded, setExpanded] = useState("");

    const [color, setColor] = useState("notRead")

    // const getFeedbacks = async () => {
    //     try {
    //         const feedbacks = await fetch(
    //             `http://localhost:3000/api/graduates/${graduateId}/feedbacks`,
    //             {
    //                 method: "GET",
    //                 headers: { 'Content-Type': 'application/json' }
    //             }
    //         );

    //         const parseRes = await feedbacks.json();
    //         setFeedbackDetails(parseRes);

    //     } catch (err) {
    //         console.error(err.message);
    //     }
    // }

    // const updateFeedbacks = async (planId, read) => {
    //     if (!read) {
    //         try {
    //             const feedbacks = await fetch(
    //                 `http://localhost:3000/api/graduates/${graduateId}/${planId}/feedbacks`,
    //                 {
    //                     method: "PUT",
    //                     headers: { "Content-Type": "application/json" },

    //                     body: JSON.stringify({ read_by_grad: true }),
    //                 }
    //             );

    //             const parseRes = await feedbacks.json();

    //         } catch (err) {
    //             console.error(err.message);
    //         }
    //     }
    // }

    const handleChange = (planId) => async (event, newExpanded) => {
        setExpanded(newExpanded ? planId : false);
   
    };

    // useEffect(() => {

    //     if (graduateId) {
    //         getFeedbacks();
    //         handleChange();  // find out what happens if we don't invoke this callback function
    //     }

    // }, [graduateId, color]);

    return (
			<div className="sidebar-container">
				<Typography variant="h4" gutterBottom>
					Completed Feedbacks
				</Typography>
				{plans && plans.length !== 0 ? (
					plans.map((item, index) => (
						<Accordion
							key={index}
							id={index}
							square
							expanded={expanded === `${item.id}`}
							onChange={handleChange(`${item.id}`)}
						>
							<AccordionSummary
								aria-controls="panel1d-content"
								id={item.id}
								// className={item.read_by_grad ? classes.readByGrad : null}
							>
								<Typography>{item.plan_name}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography variant="h6" gutterBottom>
									Feedback Details:
								</Typography>
								<Typography gutterBottom>{item.feedback_details}</Typography>
							</AccordionDetails>
						</Accordion>
					))
				) : (
					<p>No completed feedback</p>
				)}
			</div>
		);
}

export default MentorSidebar;
