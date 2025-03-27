import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/VolunteerDetails.css"; // Import CSS for styling
import axios from 'axios';

const VolunteerDetails = () => {
  const { eventId } = useParams();
  const [volunteers, setVolunteers] = useState([]);
  const [eventName, setEventName] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/donee/volunteers/${eventId}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.volunteers)) {
          setVolunteers(data.volunteers);
          setEventName(data.eventName);
        } else {
          console.error("Invalid response format:", data);
        }
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };

    fetchVolunteers();
  }, [eventId]);
  
    const handleSearch = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        console.log("Search Query: ", searchQuery);
        const response = await fetch("http://localhost:5000/api/donee/volunteers/search", { 
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ searchQuery }) // Wrap in an object and stringify
        });
        console.log("Search Query: ", JSON.stringify({ searchQuery }));
        console.log("Response object: ", response);

        // ✅ Convert response to JSON before accessing data
        const data = await response.json();  

        console.log("Response data: ", data);

        // ✅ Ensure results exist before setting state
        if (data && data.results) {
          setResults(data.results);
      }else {
        console.error("No results found in response", data);
      }

      }catch (error) {
        console.error('Gemini search failed:', error);
        // Handle error (show toast, error message)
      } finally {
        setLoading(false);
      }
    };

  return (
    <div>
    <div className="container">
      <h1>Volunteers for {eventName}</h1>
      {volunteers.length > 0 ? (
          <table className="volunteer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Skills</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                <td>{volunteer.name}</td>
                <td>{volunteer.email}</td>
                <td>{volunteer.phone}</td>
                <td>{volunteer.skills.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
          <p>No volunteers have applied yet.</p>
        )}
    </div>
    <div style={{ marginTop: "20px" }}>
    {/* Search Feature */}
    <div className="volunteer-search-container">
      <div className="search-wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-wrapper">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe the skills you need..."
              className="search-input"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`search-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Searching...' : 'Find Volunteers'}
          </button>
        </form>

        <div className="search-results">
        {results.length > 0 ? (
          results.map(volunteer => (
            <div 
              key={volunteer._id} 
              className="volunteer-card"
            >
              <div className="volunteer-header">
                <h3>{volunteer.name}</h3>
              </div>
              
              <div className="volunteer-contact">
                <p><strong>Email:</strong> {volunteer.email}</p>
                <p><strong>Phone:</strong> {volunteer.phone}</p>
              </div>
              
              <div className="volunteer-details">
                <p><strong>Skills:</strong> {volunteer.skills.length ? volunteer.skills.join(", ") : "None"}</p>
                <p><strong>Description:</strong> {volunteer.description || "Not provided"}</p>
                <p>
                  <strong>Relevance Score:</strong> 
                  <span className="relevance-score">
                    {(volunteer.relevanceScore * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
              
              <details className="match-details">
                <summary>Match Reasoning</summary>
                <p>{volunteer.matchReason}</p>
              </details>
            </div>
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </div>
      </div>
    </div>
    </div>
  </div>
  );
};


export default VolunteerDetails;
