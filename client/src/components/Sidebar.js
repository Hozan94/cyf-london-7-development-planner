import React, { useState, useEffect, useRef } from 'react'
import "./aside.css";
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { Icon, makeStyles, Paper } from '@material-ui/core';


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
    feedbackTableTitle: {
        padding: theme.spacing(1.8),
    },
    readByGrad: {
        backgroundColor: 'rgb(248, 247, 245)',
    },

    heading: {
        flexBasis: '45.33%',
        flexShrink: 0,
    },
    headingText: {
        fontWeight: '900'
    },
    accordionHeading: {
        fontSize: '0.875rem'
    },
    accordionSummaryHeading: {
        fontWeight: '400',
        paddingBottom: '20px'
    },
    paperContainer: {
        border: 'none',
        display: 'flex',
        padding: theme.spacing(2),
    },
    noFeedbackText:{
        textAlign: 'center',
        padding: theme.spacing(2)
    }
}))


function Sidebar({ graduateId }) {

    const classes = useStyles();

    const [feedbackDetails, setFeedbackDetails] = useState([]);

    //const [expanded, setExpanded] = useState("");

    const [color, setColor] = useState("notRead")

    const getFeedbacks = async () => {
        console.log("11111")
        try {
            const feedbacks = await fetch(
                `http://localhost:3000/api/graduates/${graduateId}/feedbacks`,
                {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const parseRes = await feedbacks.json();
            setFeedbackDetails(parseRes);

        } catch (err) {
            console.error(err.message);
        }
    }

    const updateFeedbacks = async (planId, read) => {
        console.log(read)
        if (!read) {
            try {
                const feedbacks = await fetch(
                    `http://localhost:3000/api/graduates/${graduateId}/${planId}/feedbacks`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },

                        body: JSON.stringify({ read_by_grad: true }),
                    }
                );

                const parseRes = await feedbacks.json();

            } catch (err) {
                console.error(err.message);
            }
        }
    }

    const handleChange = (planId, read) => (event) => {
        //setExpanded(newExpanded ? planId : false);
        setColor(planId);
        updateFeedbacks(planId, read)
    };

    useEffect(() => {

        if (graduateId) {
            getFeedbacks();
            //handleChange();  // find out what happens if we don't invoke this callback function
        }

    }, [graduateId, color]);

    return (
        <Paper className="sidebar-container offset-md-1 col-md-4">
            <Typography variant="body1" className={classes.feedbackTableTitle}>
                Received feedback <Icon>feedback</Icon>
            </Typography>
            <Paper square elevation={2} className={classes.paperContainer} >
                <Typography className={`${classes.heading} ${classes.headingText}`} >
                    Mentor
                </Typography>
                <Typography className={classes.headingText}>
                    Plan
                </Typography>
            </Paper>
            {
                feedbackDetails.length !== 0 ?
                    feedbackDetails.map((item, index) => (
                        <Accordion key={index} id={index} square onChange={handleChange(`${item.plan_id}`, item.read_by_grad)}>
                            <AccordionSummary aria-controls={`panel${item.plan_id}-content`} id={item.plan_id} className={item.read_by_grad ? classes.readByGrad : null} >
                                <Typography className={`${classes.heading} ${classes.accordionHeading}`}>
                                    {item.name}
                                </Typography>
                                <Typography className={classes.accordionHeading}>
                                    {item.plan_name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className={classes.accordionSummaryHeading}>
                                    Feedback Details:
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {item.feedback_details}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))
                    :
                    <Typography className={classes.noFeedbackText}>No feedback</Typography>
            }
        </Paper>
    );
}

export default Sidebar;
