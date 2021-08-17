import React, { useState, useEffect } from 'react';
import Controls from './controls/Controls';

function MentorDropDown({ setMentorId, mentorId }) {
    
    const [mentorName, setMentorName] = useState([]);

    async function getMentors() {
        const mentors = await fetch('/api/mentors');
        const parse = await mentors.json()
        setMentorName(parse.mentors.map((mentor) => {
            return {
                mentor_name: `${mentor.first_name}  ${mentor.last_name} `,
                mentor_id: mentor.id
            }
        }));

    }

    useEffect(() => {
        getMentors();
    }, [])


    const handelChange = (e) => {
        setMentorId(e.target.value);
        console.log(e.target.value)
    }
    return (
            <Controls.Select
                name="mentorsList"
                label="Mentors List"
                value={mentorId}
                options={mentorName}
                onChange={handelChange}
            />
    );
}

export default MentorDropDown
