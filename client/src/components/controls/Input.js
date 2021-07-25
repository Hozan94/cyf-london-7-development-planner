import React from 'react';
import { TextField } from '@material-ui/core';

function Input(props) {
    const {name, label, value, onChange, multiline} = props;

    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            multiline = {multiline}
            maxRows={6}
            value={value}
            onChange={onChange}
        />
    )
}

export default Input;