import React,{useState,useEffect} from 'react'
import "./aside.css";
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },


  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions({graduateId}) {

    const [feedbackDetails, setFeedbackDetails] = useState([]);
  
    async function getFeedbacks() {
		try {
			const feedbacks = await fetch(
        
				`http://localhost:3000/api/graduates/${graduateId}/feedbacks`,
				{
					method: "GET",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
				}
			);
          
			const parseRes = await feedbacks.json();
           	
			setFeedbackDetails(parseRes);
			console.log(parseRes);
		} catch (err) {
			console.error(err.message);
		}
	}

    useEffect(() => {
      if(graduateId){
     	getFeedbacks();
      }

	}, [graduateId]);



  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="side" >
        <h1>New Feed Backs</h1> 
     
     {feedbackDetails.map((item, index)=>(
      
     <Accordion key={index}  square expanded={expanded === index} onChange={handleChange(index)}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" >
            <Typography   >{item.plan_name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography>
            {item.feedback_details}
            </Typography>
            </AccordionDetails>
        </Accordion>
        
     ))}
      
     
    </div>
  );
}
