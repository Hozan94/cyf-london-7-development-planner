import React, { useState, forwardRef } from 'react';
import GoalsForm from './GoalsForm';
import GoalsTable from './GoalsTable';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import {
    Paper, TextField, Grid, Tooltip, Icon, Button,
    Dialog, AppBar, Toolbar, IconButton, Typography, Slide
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    createButton: {
        textTransform: 'none',
        fontSize: '20px',
        fontWeight: '500',
        padding: theme.spacing(2)
    },
    appBar: {
        position: 'relative'
    },
    title: {
        textAlign: 'center',
        flex: 1,
    },
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    planTitle: {
        width: '50%',
        margin: theme.spacing(5),
    }
}));


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CreatePlan(props) {

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [planTitle, setPlanTitle] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const ourPlans = {
        plan_name: planTitle,
        goals_list: data
    }

    async function handleSubmit() {
        props.submitted(ourPlans)
        setOpen(false);
        setData([]);

        try {
            const response = await fetch(`/api/graduates/${props.graduateId}/plans/goals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ourPlans),
            });

            const parseRes = await response.json();
            console.log(parseRes);
        } catch (err) {
            console.log(err);
        }

    }

    function handleInputChange(e) {
        setPlanTitle(e.target.value);
    }

    function smartGoals() {
        return (
            <p>use <a style={{ color: 'white', textDecoration: 'underline' }} target="_blank" href="https://www.indeed.com/career-advice/career-development/smart-goals">SMART</a> method when creating your goals</p>
        )
    }

    return (
        <div className="create-plan-button">
            <Tooltip title={smartGoals()} placement="right" interactive >
                <Button className={classes.createButton} endIcon={<Icon style={{ fontSize: '30px' }}>add_circle</Icon>}
                    onClick={handleClickOpen}>
                    Add a new plan
                </Button>
            </Tooltip>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar color="transparent" className={classes.appBar}>
                    <Toolbar >
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Create you plan
                        </Typography>
                        <Button disabled={!planTitle} autoFocus color="inherit" type="submit" onClick={handleSubmit}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <Grid container justifyContent="center">
                    <TextField
                        classes={{ root: classes.planTitle }}
                        variant="filled"
                        name="planTitle"
                        label="Plan Title"
                        value={planTitle}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Paper className={classes.pageContent}>
                    <GoalsForm goals={setData} />
                </Paper>
                <GoalsTable goals={data} />
            </Dialog>
        </div>
    )
}

export default CreatePlan;