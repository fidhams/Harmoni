import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "./components/ui/provider";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"; // Import the CSS file



import Home from "./pages/Home";
import Donations from "./pages/Donations";


import DonorLogin from "./pages/donorlogin";
import DoneeLogin from "./pages/doneelogin";
import DonorSignup from "./pages/donorsignup";
import DoneeSignup from "./pages/doneesignup";


import DonorDashboard from "./pages/DonorDashboard";
import EditProfile from "./pages/EditProfile";
import PostDonation from "./pages/PostDonation";


import DoneeDashboard from "./pages/DoneeDashboard";
import DoneeEdit from "./pages/DoneeEdit";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import { AddNeed, EditNeed } from "./pages/AddNeed";
import { AddImpactStory, EditImpactStory } from "./pages/AddImpactStories";
import CheckDonations from "./pages/CheckDonations";
import VolunteerDetails from "./pages/VolunteerDetails";


import Volunteer from "./pages/Volunteer";
import ImpactStories from "./pages/ImpactStories";
import Contactus from "./pages/Contactus";
import NotFound from "./pages/NotFound";
import ItemsRequest from "./pages/itemsreq";

import UserDonateForm from "./pages/userdonate";
import VolunteerEventsPage from "./pages/uservolunteer";
import VolunteerRequestForm from "./pages/volunteerreq";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Provider>
      <Router>
      <div className="app-container">
        <Navbar /> {/* Navbar placed before Routes */}
        <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/volunteer" element={<VolunteerEventsPage />} />



          {/* Admin Routes */}
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Donor and Donee Authentication */}
          <Route path="/donorlogin" element={<DonorLogin />} />
          <Route path="/doneelogin" element={<DoneeLogin />} />
          <Route path="/donorsignup" element={<DonorSignup />} />
          <Route path="/doneesignup" element={<DoneeSignup />} />

          {/*Donor Dashboard Routes */}
          <Route path="/donordashboard" element={<DonorDashboard />} />
          <Route path="/donor/edit-profile" element={<EditProfile />} />
          <Route path="/post-donation" element={<PostDonation />} />
          
          {/* Donee Dashboard */}
          <Route path="/doneedashboard" element={<DoneeDashboard />} />
          <Route path="/donee/edit-profile" element={<DoneeEdit />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/edit-event/:eventId" element={<EditEvent />} />
          <Route path="/add-need" element={<AddNeed />} />
          <Route path="/edit-need/:needId" element={<EditNeed />} />
          <Route path="/add-impact-story" element={<AddImpactStory />} />
          <Route path="/edit-impact-story/:storyId" element={<EditImpactStory />} />
          <Route path="/check-donations" element={<CheckDonations />} />
          <Route path="/volunteers/:eventId" element={<VolunteerDetails />} />


          {/* Other Pages */}
          <Route path="/volunteering" element={<Volunteer />} />
          <Route path="/impact-stories" element={<ImpactStories />} />
          <Route path="/contact" element={<Contactus />} />

          {/* Donation and Volunteering */}
          <Route path="/itemreq" element={<ItemsRequest />} />
          <Route path="/donate" element={<UserDonateForm />} />
          <Route path="/vreq" element={<VolunteerRequestForm />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
        <Footer />
      </div>
      </Router>
    </Provider>
  );
}

export default App;







// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
