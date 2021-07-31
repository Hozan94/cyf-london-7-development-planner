
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { useForm, Form } from './useForm';
import Controls from './controls/Controls';
import { format } from 'date-fns';


const initialFieldValues = {
    id: 0,
    goalDetails: '',
    dueDate: new Date(),
    remarks: '',
    isCompleted: false
}

function GoalsForm(props) {

    const {
        values,
        setValues,
        handleInputChange
    } = useForm(initialFieldValues);

    const [data, setData] = useState([])

    const goal = {
        goalDetails: values.goalDetails,
        dueDate: format(values.dueDate, 'MM/dd/yyyy'),
        remarks: values.remarks
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        setData(data.concat(goal))
        props.goals(data.concat(goal))

    };

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container justifyContent="center" spacing={2}>
                <Grid item xs={5} >
                    <Controls.Input
                        name="goalDetails"
                        label="Goal"
                        multiline={true}
                        value={values.goalDetails}
                        onChange={handleInputChange}
                    />
                </Grid>

                <Grid item xs={5} >
                    <Controls.Input
                        name="remarks"
                        label="Remarks"
                        multiline={true}
                        value={values.remark}
                        onChange={handleInputChange}
                    />
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Grid item xs={5} >
                    <Controls.DatePicker
                        name="dueDate"
                        label="Due Date"
                        value={values.dueDate}
                        onChange={handleInputChange}
                    />

                </Grid>
            </Grid>
            <Grid container justifyContent="center">

                    <Controls.Button
                        type="submit"
                        text="Add Goal"
                    />

            </Grid>
        </Form>
    );
};

export default GoalsForm;
