
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';



export function useForm(initialFieldValues) {

    const [values, setValues] = useState(initialFieldValues);

    function handleInputChange(e) {

        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        
    }

    return {
        values,
        setValues,
        handleInputChange
    }
};

const useStyle = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(2)
        }
    }
}))

export function Form(props) {

    const classes = useStyle();
    const { children, ...other } = props;

    return (
        <form className={classes.root} {...other}>
            {props.children}
        </form>
    )
}





