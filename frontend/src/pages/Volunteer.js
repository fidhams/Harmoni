import React, { useEffect, useState } from 'react';
import API from '../api/axios'; // Import Axios instance
import '../styles/Volunteer.css';

const Volunteer = () => {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await API.get('/api/volunteers'); // Use Axios instance
                setVolunteers(response.data);
            } catch (error) {
                console.error('Error fetching volunteers:', error);
            }
        };
        fetchVolunteers();
    }, []);

    return (
        <div className="volunteer-container">
            <h1>Volunteer Opportunities</h1>
            <ul className="volunteer-list">
                {volunteers.map((volunteer) => (
                    <li key={volunteer._id} className="volunteer-item">
                        <h2>{volunteer.title}</h2>
                        <p>{volunteer.description}</p>
                        <button className="apply-button">Apply</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Volunteer;
