import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails } from './Accordion'
import { Icon, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    feedbackTableTitle: {
        padding: theme.spacing(1.8),
        display: 'flex',
        justifyContent: 'center'
    },
    icon: {
        marginLeft: theme.spacing(1)
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
    accordionDetailsHeading: {
        fontWeight: '400',
        paddingBottom: '20px'
    },
    paperContainer: {
        border: 'none',
        display: 'flex',
        padding: theme.spacing(2),
    },
    noFeedbackText: {
        textAlign: 'center',
        padding: theme.spacing(2)
    }
}))


function GraduateSidebar({ graduateId }) {

    const classes = useStyles();

    const [feedbackDetails, setFeedbackDetails] = useState([]);

    const [color, setColor] = useState("notRead")

    const getFeedbacks = async () => {
        console.log("11111")
        try {
            const feedbacks = await fetch(
                `/api/graduates/${graduateId}/feedbacks`,
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
                    `/api/graduates/${graduateId}/${planId}/feedbacks`,
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

    const handleChange = (planId, read) => (event, newExpanded) => {
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
        <Paper>
            <Typography variant="body1" className={classes.feedbackTableTitle}>
                Received feedback <Icon className={classes.icon}>feedback</Icon>
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
                                <Typography className={classes.accordionDetailsHeading}>
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

export default GraduateSidebar;
