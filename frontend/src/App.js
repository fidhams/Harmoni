import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "./components/ui/provider";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

import DonorLogin from "./pages/donorlogin";
import DoneeLogin from "./pages/doneelogin";
import DonorSignup from "./pages/donorsignup";
import DoneeSignup from "./pages/doneesignup";

import DonorDashboard from "./pages/DonorDashboard";
import DoneeDashboard from "./pages/DoneeDashboard";
import EditProfile from "./pages/EditProfile";
import PostDonation from "./pages/PostDonation";


import Donations from "./pages/Donations";
import Volunteer from "./pages/Volunteer";
import ImpactStories from "./pages/ImpactStories";
import Contactus from "./pages/Contactus";
import NotFound from "./pages/NotFound";
import ItemsRequest from "./pages/itemsreq";

import UserDonateForm from "./pages/userdonate";
import UserVolunteerForm from "./pages/uservolunteer";
import DonationsPage from "./pages/viewd";
import VolunteerRequestForm from "./pages/volunteerreq";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDonor from "./pages/AdminDonor";
import AdminDonee from "./pages/AdminDonee";

function App() {
  return (
    <Provider>
      <Router>
        <Navbar /> {/* Navbar placed before Routes */}
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/donors" element={<AdminDonor />} />
          <Route path="/admin/donees" element={<AdminDonee />} />

          {/* Donor and Donee Authentication */}
          <Route path="/donorlogin" element={<DonorLogin />} />
          <Route path="/doneelogin" element={<DoneeLogin />} />
          <Route path="/donorsignup" element={<DonorSignup />} />
          <Route path="/doneesignup" element={<DoneeSignup />} />

          {/* Dashboard Routes */}
          <Route path="/donordashboard" element={<DonorDashboard />} />
          <Route path="/doneedashboard" element={<DoneeDashboard />} />
          <Route path="/donor/edit-profile" element={<EditProfile />} />
          <Route path="/post-donation" element={<PostDonation />} />


          {/* Other Pages */}
          <Route path="/donations" element={<Donations />} />
          <Route path="/volunteering" element={<Volunteer />} />
          <Route path="/impact-stories" element={<ImpactStories />} />
          <Route path="/contact" element={<Contactus />} />

          {/* Donation and Volunteering */}
          <Route path="/itemreq" element={<ItemsRequest />} />
          <Route path="/donate" element={<UserDonateForm />} />
          <Route path="/volunteer" element={<UserVolunteerForm />} />
          <Route path="/view" element={<DonationsPage />} />
          <Route path="/vreq" element={<VolunteerRequestForm />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
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
