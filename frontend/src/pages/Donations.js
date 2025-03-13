import React, { useEffect, useState } from 'react';
import API from '../api/axios'; // Import Axios instance
import '../styles/Donation.css';

const Donation = () => {
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await API.get('/api/donations'); // Use Axios instance
                setDonations(response.data);
            } catch (error) {
                console.error('Error fetching donations:', error);
            }
        };
        fetchDonations();
    }, []);

    return (
        <div className="donation-container">
            <h1>Donations</h1>
            <ul className="donation-list">
                {donations.map((donation) => (
                    <li key={donation._id} className="donation-item">
                        <h2>{donation.title}</h2>
                        <p>{donation.description}</p>
                        <p><strong>Donated by:</strong> {donation.donorName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Donation;
