import React from "react";
import { Button as MuiButton, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        marginRight: "5%",
    },
}));

function Button(props) {
    const { text, size, color, variant, onClick, ...other } = props;

    const classes = useStyles();

    return (
        <MuiButton
            variant={variant || "contained"}
            size={size || "large"}
            color={color || "primary"}
            onClick={onClick}
            {...other}
            className={classes.root}
        >
            {text}
        </MuiButton>
    );
}

export default Button;
