import React from 'react';
import { TextField } from '@material-ui/core';

function Input(props) {
   
    const {name, label, value, onChange, multiline, placeholder, rows, maxRows, autoFocus} = props;

    return (
        <TextField
            variant="outlined"
            placeholder={placeholder}
            label={label}
            name={name}
            multiline = {multiline}
            maxRows={maxRows}  
            rows={rows}
            value={value}
            onChange={onChange}
            autoFocus={autoFocus}
        />
    )
}

export default Input;