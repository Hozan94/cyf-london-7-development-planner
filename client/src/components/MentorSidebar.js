import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails } from './Accordion';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Icon, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    accordionSummary: {
        backgroundColor: 'rgb(248, 247, 245)',
    },
    completedFeedbackTableTitle: {
        padding: theme.spacing(1.8),
        display: 'flex',
        justifyContent: 'center'
    },
    icon: {
        marginLeft: theme.spacing(1)
    },
    heading: {
        flexBasis: '45.33%',
        flexShrink: 0,
    },
    headingText: {
        fontWeight: '900'
    },
    paperContainer: {
        border: 'none',
        display: 'flex',
        padding: theme.spacing(2),
    },
    accordionHeading: {
        fontSize: '0.875rem'
    },
    accordionDetailsHeading: {
        fontWeight: '400',
        paddingBottom: '20px'
    },
    noFeedbackText: {
        textAlign: 'center',
        padding: theme.spacing(2)
    },
}))


function MentorSidebar({ plans }) {

    const classes = useStyles();

    //These were inside the accordion
    //const [expanded, setExpanded] = useState("");
    //expanded={expanded === `${item.id}`} onChange={handleChange(`${item.id}`)}
    //const handleChange = (planId) => async (event, newExpanded) => {
    //    setExpanded(newExpanded ? planId : false);
    //};

    return (
        <Paper>
            <Typography variant="body1" className={classes.completedFeedbackTableTitle}>
                Completed Feedback <Icon className={classes.icon}>task_alt</Icon>
            </Typography>
            <Paper square elevation={2} className={classes.paperContainer} >
                <Typography className={`${classes.heading} ${classes.headingText}`} >
                    Student
                </Typography>
                <Typography className={classes.headingText}>
                    Plan
                </Typography>
            </Paper>
            {
                plans && plans.length !== 0 ?
                    plans.map((item, index) => (
                        <Accordion key={index} id={index} square >
                            <AccordionSummary className={classes.accordionSummary} aria-controls="panel1d-content" id={item.id}>
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
                    <Typography className={classes.noFeedbackText}>No feedback completed</Typography>
            }
        </Paper>
    );
}

export default MentorSidebar;
