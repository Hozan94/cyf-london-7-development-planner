import { FormControl, Checkbox as MuiCheckbox, FormControlLabel } from "@material-ui/core";
import React from "react";

function CheckBox(props) {
    
    const { name, label, value, onChange } = props;

    return (
        <FormControl>
            <FormControlLabel
                control={<MuiCheckbox
                    name={name}
                    color="primary"
                    checked={value}
                    onChange={onChange}
                />}
                label={label}
            />
        </FormControl>
    );
}

export default CheckBox;