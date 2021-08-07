import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Controls from './controls/Controls';
import { IconButton, makeStyles } from '@material-ui/core';
import MentorsList from './MentorsList';
import ShareIcon from '@material-ui/icons/Share';


function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

const useStyles = makeStyles(theme => ({
    shareButton: {
        padding: '0'
    }
}));

export default function ShareButton({ planId }) {

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [mentorId, setMentorId] = useState("");

    const handleClick = (e) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleShare = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/mentors/${mentorId}/feedbacks`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: planId }),
                }
            );

            const parseRes = await response.json();
            console.log(parseRes)
        } catch (err) {
            console.error(err.message);
        }

        setOpen(false);
    };

    return (
        <div>
            <IconButton aria-label="share" color="inherit" className={classes.shareButton} onClick={handleClick}>
                <ShareIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Share
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To share your plan with a mentor, please select the mentor from the list below.
                    </DialogContentText>
                    <MentorsList setMentorId={setMentorId} mentorId={mentorId} />
                </DialogContent>
                <DialogActions>
                    <Controls.Button text="Cancel" variant="text" autoFocus onClick={handleClose} />

                    <Controls.Button text="Share" variant="text" onClick={handleShare} />

                </DialogActions>
            </Dialog>
        </div>
    );
}