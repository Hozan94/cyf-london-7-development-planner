import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useState } from "react";
import Controls from "./controls/Controls";
import { useForm, Form } from "./useForm";
import { Grid } from "@material-ui/core";
import Icon from '@material-ui/core/Icon';
import { format } from 'date-fns';
import { green } from "@material-ui/core/colors";
import ShareButton from './ShareButton'
import AsideBar from "./AsideBar";


const useStyles = makeStyles(theme => ({
    root: {
        "& > *": {
            borderBottom: "unset",
        },
    },
    plansTable: {
        width: '80%',
    },
    tableHeader: {
        fontWeight: '900',
        fontSize: '1rem'
    },
    feedbackForm: {
        '& .MuiFormControl-root': {
            width: '100%',
            marginTop: '20px',
            marginBottom: '15px'
        }
    },
    feedbackFormButton: {
        margin: '0',
        marginBottom: '20px'
    },

    shareButton: {
        backgroundColor: 'green',
    }
}));


const initialFieldValues = {
    id: 0,
    feedback: '',
}


function Row({ row, isMentor, isGraduate, mentorId }) {

    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const {
        values,
        setValues,
        handleInputChange
    } = useForm(initialFieldValues);

const   handelFeedBack = async (e) =>{
    e.preventDefault()

    try {
        const response = await fetch(
            
            `http://localhost:3000/api/mentors/${mentorId}/${row.id}/feedbacks`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({feedback_details:values.feedback}),
            }
        );

        const parseRes = await response.json();
        console.log(parseRes)
    } catch (err) {
        console.error(err.message);
    }



}


    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell >
                {isMentor &&
                    <TableCell component="th" scope="row" >
                        {row.name}
                    </TableCell>
                }
                {isMentor &&
                    < TableCell component="th">
                        {format(new Date(row.feedback_requested_date), 'MM/dd/yyyy')}
                    </TableCell>
                }
                { isGraduate && <TableCell>
                    {/*<input value={row.id} className="plan_id" disabled />*/}
                    
                    {row.id}
                </TableCell>
                }
                <TableCell component="th" >
                    {row.plan_name}
                </TableCell>
                

                {isGraduate &&
                    <TableCell>
                        <ShareButton planId={row.id}></ShareButton>
                    </TableCell>
                }

            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box className="goals-list-table" margin={1} padding={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Goals List
                            </Typography>
                            <Table size="medium" aria-label="purchases">
                                <TableHead >
                                    <TableRow>
                                        <TableCell>Goal Details</TableCell>
                                        <TableCell>Due Date</TableCell>
                                        <TableCell>Remarks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.goals_list.map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{data.goal_details}</TableCell>
                                            <TableCell>{format(new Date(data.due_date), 'MM/dd/yyyy')}</TableCell>
                                            <TableCell >{data.remarks}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                        {isMentor &&
                            <Box>
                                <Form className={classes.feedbackForm} onSubmit={handelFeedBack}>
                                    <Grid container justifyContent="center" spacing={2}>
                                        <Grid item xs={9} >
                                            <Controls.Input
                                                placeholder="Add your feedback"
                                                name="feedback"
                                                rows={8}
                                                multiline={true}
                                                value={values.feedback}
                                                autoFocus={true}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="center">
                                        <Controls.Button
                                            classes={{ root: classes.feedbackFormButton }}
                                            type="submit"
                                            text="send"
                                            endIcon={<Icon>send</Icon>} //Used from Font Icons (Google Web Fonts)
                                            
                                        />
                                    </Grid>
                                </Form>
                            </Box>}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
let test1; 
export default function PlansTable(props) {
  test1= props.mentorId;
    const classes = useStyles();

    return (
        <div className="plans-table-container">
            
            <TableContainer component={Paper} classes={{ root: classes.plansTable }}>
                <Table aria-label="collapsible table">
                    <TableHead >
                        <TableRow>
                            <TableCell />
                            {props.isMentor && <TableCell className="graduate-name-cell" classes={{ head: classes.tableHeader }} >Graduate Name</TableCell>}
                            {props.isMentor && <TableCell className="request-date-cell" classes={{ head: classes.tableHeader }}>Request Date</TableCell>}
                            {props.isGraduate && <TableCell className="plan-name-cell" classes={{ head: classes.tableHeader }}> Plan ID</TableCell>}
                            <TableCell className="plan-name-cell" classes={{ head: classes.tableHeader }}> Plan Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.plans.map((data) => {
                            return <Row key={data.id} row={data} isMentor={props.isMentor} isGraduate={props.isGraduate}  mentorId={props.mentorId}  />
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <AsideBar/> */}
        </div>
    );
}
