import React from 'react';
import { TextField } from '@material-ui/core';

function Input(props) {
    const {name, label, value, onChange, multiline, placeholder, rows, maxRows} = props;

    return (
        <TextField
            variant="outlined"
            placeholder={placeholder}
            label={label}
            name={name}
            multiline = {multiline}
            maxRows={maxRows}  //previously was maxRows={6} added it other inputs
            rows={rows}
            value={value}
            onChange={onChange}
        />
    )
}

export default Input;