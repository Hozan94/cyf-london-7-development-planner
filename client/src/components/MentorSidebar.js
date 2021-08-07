import React, { useState, useEffect, useRef } from 'react'
import "./aside.css";
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper'


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
    completedFeedbackTableTitle: {
        padding: theme.spacing(1.8),
        display: 'flex',
        justifyContent: 'center'
    },
    icon: {
        marginLeft: theme.spacing(1)
    },
    noFeedbackText: {
        textAlign: 'center',
        padding: theme.spacing(2)
    }
}))


function MentorSidebar({ plans }) {

    const classes = useStyles();

    const [feedbackDetails, setFeedbackDetails] = useState([]);

    const [expanded, setExpanded] = useState("");

    const [color, setColor] = useState("notRead")

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
        <Paper className="sidebar-container offset-md-1 col-md-4">
            <Typography variant="body1" className={classes.completedFeedbackTableTitle}>
                Completed Feedback <Icon className={classes.icon}>task_alt</Icon>
            </Typography>
            {plans && plans.length !== 0 ?
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
                :
                <Typography className={classes.noFeedbackText}>No feedback completed</Typography>
            }
        </Paper>
    );
}

export default MentorSidebar;
