import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useState } from "react";

const useStyles = makeStyles({
    root: {
        "& > *": {
            borderBottom: "unset"
        }
    },
    plansTable: {
        width: '80%'
    }
});

function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.plan}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Goals List
                            </Typography>
                            <Table size="medium" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Goal Details</TableCell>
                                        <TableCell>Due Date</TableCell>
                                        <TableCell align="right">Remarks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.goalsList.map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {data.goal}
                                            </TableCell>
                                            <TableCell>{data.dueDate}</TableCell>
                                            <TableCell align="right">{data.remarks}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function PlansTable(props) {
    const classes = useStyles();

    return (
        <div className="plans-table-container">
            <TableContainer component={Paper} classes={{ root: classes.plansTable }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Exisiting Plans</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.plan.map((data) => (
                            <Row key={data.plan} row={data} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
}
