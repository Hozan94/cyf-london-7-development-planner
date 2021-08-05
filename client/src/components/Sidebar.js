import React, { useState, useEffect, useRef } from 'react'
import "./aside.css";
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Controls from './controls/Controls';
import { makeStyles } from '@material-ui/core';
import { useForm } from './useForm';

const initialFieldValues = {
    isRead: false
}

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
        backgroundColor: 'rgb(232, 244, 253)',
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
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
        content: {
            '&$expanded': {
                margin: '12px 0',
            },
        },
        expanded: {},
    }

}))


function Sidebar({ graduateId }) {
    console.log(graduateId)

    const classes = useStyles();

    const [feedbackDetails, setFeedbackDetails] = useState([]);

    const [expanded, setExpanded] = useState("");

    const [checked, setChecked] = useState(false)

    const color = useRef("");

    const [selectedRow, setSelectedRow] = useState(-1)

    //const handleInputChange = async (e) => {
    //    //console.log(e.target.value)
    //    console.log(e.target.checked)
    //    setChecked(e.target.checked)

    //    try {
    //        const feedbacks = await fetch(
    //            `http://localhost:3000/api/graduates/${graduateId}/${e.target.name}/feedbacks`,
    //            {
    //                method: "PUT",
    //                headers: { "Content-Type": "application/json" },

    //                body: JSON.stringify({ read_by_grad: e.target.checked }),
    //            }
    //        );

    //        const parseRes = await feedbacks.json();

    //        console.log(parseRes);
    //    } catch (err) {
    //        console.error(err.message);
    //    }

    //}


    const handleChange = (planId, read) => async (event, newExpanded) => {
        console.log(newExpanded)
        setExpanded(newExpanded ? planId : false);
        console.log(expanded)
        console.log(event.currentTarget.className)



        //console.log(`${color} ${selectedRow}`)
        //setColor("")
        //setSelectedRow(event.currentTarget.id)
        //if(event.currentTarget.id === planId){
        //   setColor( event.currentTarget.className = classes.readByGrad)
        //}


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

                console.log(parseRes);
            } catch (err) {
                console.error(err.message);
            }
        }

        //item.read_by_grad ? true : checked
    };

    async function getFeedbacks() {
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
            console.log(parseRes);
        } catch (err) {
            console.error(err.message);
        }
    }
console.log(color)
    useEffect(() => {

        if (graduateId) {
            getFeedbacks();
        }

    }, [graduateId, color]);

    console.log(checked)

    return (
        <div className="sidebar-container">
            <Typography variant="h4" gutterBottom>
                Received Feedback
            </Typography>
            {
                feedbackDetails.length !== 0 ?
                    feedbackDetails.map((item, index) => (
                        <Accordion key={index} id={index} square expanded={expanded === `${item.plan_id}`} onChange={handleChange(`${item.plan_id}`, item.read_by_grad)}>
                            <AccordionSummary aria-controls="panel1d-content" id={item.plan_id} className={item.read_by_grad ? color.current : null} >
                                <Typography>
                                    {item.plan_name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="h6" gutterBottom>
                                    Feedback Details:
                                </Typography>
                                <Typography gutterBottom>
                                    {item.feedback_details}
                                </Typography>
                                <div>
                                    {/*<Controls.CheckBox
                                        name={`${item.plan_id}`}
                                        label="Read"
                                        value={item.read_by_grad ? true : checked}
                                        //value={checked}
                                        onChange={handleInputChange}
                                    />*/}

                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))
                    :
                    <p>No feedback</p>
            }
        </div>
    );
}

export default Sidebar;
