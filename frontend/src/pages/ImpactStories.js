import React, { useEffect, useState } from 'react';
import API from '../api/axios'; // Axios instance for backend calls
import '../styles/ImpactStories.css'; // CSS file for styling

const ImpactStories = () => {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchImpactStories = async () => {
            try {
                const response = await API.get('/api/impact-stories');
                setStories(response.data);
            } catch (error) {
                console.error('Error fetching impact stories:', error);
            }
        };
        fetchImpactStories();
    }, []);

    return (
        <div className="impact-container">
            <h1>Impact Stories</h1>
            <div className="stories-grid">
                {stories.map((story) => (
                    <div key={story._id} className="story-card">
                        <img src={story.image} alt={story.title} className="story-image" />
                        <h2>{story.title}</h2>
                        <p>{story.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImpactStories;
