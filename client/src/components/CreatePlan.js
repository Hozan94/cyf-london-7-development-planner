import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import GoalsForm from "./GoalsForm";
import GoalsTable from "./GoalsTable";
import { Paper, TextField, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "relative",
    },
    title: {
        textAlign: "center",
        flex: 1,
    },
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
    },
    planTitle: {
        width: "50%",
        margin: theme.spacing(5),
    },
}));


const Transition = React.forwardRef(function Transition(props, ref) {
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
        plan: planTitle,
        goalsList: data,
    };

    function handleSubmit() {
        props.plan(props.plansList.concat(ourPlans));
        setOpen(false);
        setData([]);
    }
    function handleInputChange(e) {
        setPlanTitle(e.target.value);
    }

    return (
        <div className="create-plan-button">
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Create a new plan
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Create you plan
                        </Typography>
                        <Button autoFocus color="inherit" type="submit" onClick={handleSubmit}>
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
    );
}

export default CreatePlan;