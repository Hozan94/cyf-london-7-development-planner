import { makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

    root: {
        width: '80%',
    },
    table: {
        minWidth: 650,

    },
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    tableCells: {
        fontSize: '1rem',
        fontWeight: '900',
    }
}));

function GoalsTable(props) {

    const classes = useStyles();

    return (
        <div className="goals-table-container">
            <TableContainer component={Paper} className={classes.root}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell classes={{ head: classes.tableCells }}>Goal Name</TableCell>
                            <TableCell classes={{ head: classes.tableCells }} align="center">Due Date</TableCell>
                            <TableCell classes={{ head: classes.tableCells }} align="right">Remarks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.goals.map((goal, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {goal.goal_details}
                                </TableCell>
                                <TableCell align="right">{goal.due_date}</TableCell>
                                <TableCell align="right">{goal.remarks}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default GoalsTable;