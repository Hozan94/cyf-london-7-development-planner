import React from 'react';
import { FormControl, InputLabel, MenuItem, Select as MuiSelect, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '50%',
        marginTop: theme.spacing(3)
    },
}));

function Select(props) {
    
    const classes = useStyles();
    const { name, label, value, onChange, options } = props;

    return (
        <FormControl variant="outlined" className={classes.root}>

            <InputLabel>{label}</InputLabel>
            <MuiSelect
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                
            >
                <MenuItem value=""><em>None</em></MenuItem>
                {
                    options.map((item) => <MenuItem key={item.mentor_id} value={item.mentor_id}>{item.mentor_name}</MenuItem>)
                }
            </MuiSelect>

        </FormControl>
    )
}

export default Select;
