import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/VolunteerDetails.css"; // Import CSS for styling

const VolunteerDetails = () => {
  const { eventId } = useParams();
  const [volunteers, setVolunteers] = useState([]);
  const [eventName, setEventName] = useState("");

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

  return (
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
  );
};

export default VolunteerDetails;
