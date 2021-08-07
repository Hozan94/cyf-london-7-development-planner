import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Controls from './controls/Controls';
import { makeStyles} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

const useStyles = makeStyles(theme => ({

    dialogText: {
        display: 'flex',
        flexDirection: 'column',
    },
    deleteButton:{
        padding: '0'
    }
}));

export default function DeleteButton({ graduateId, planId }) {

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [mentorId, setMentorId] = useState("");
    const [deletedPlans, setDeletedPlans] = useState("");

    const handleClick = (e) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async (e) => {
        try {
            const response = await fetch(`/api/graduates/${graduateId}/${planId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const parseRes = await response.json();
            setDeletedPlans(parseRes);
            console.log(parseRes);
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        }

        setOpen(false);

    }

    return (
        <div>
            <IconButton aria-label="delete" color="inherit" className={classes.deleteButton} onClick={handleClick}>
                <DeleteIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.dialogText}>
                        Delete this plan?
                    </DialogContentText>
                    <DialogContentText variant="caption">
                        Once a plan is deleted you wont be able to retrieve.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Controls.Button text="Cancel" variant="text" autoFocus onClick={handleClose} />

                    <Controls.Button text="Delete" variant="text" onClick={handleDelete} />

                </DialogActions>
            </Dialog>
        </div>
    );
}