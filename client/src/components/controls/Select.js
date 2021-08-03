import React from 'react';
import { FormControl, InputLabel, MenuItem, Select as MuiSelect } from '@material-ui/core';

function Select(props) {
    const { name, label, value, onChange, options } = props;

    return (
        <FormControl variant="outlined">

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
