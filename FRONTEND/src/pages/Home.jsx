import { Link } from "react-router-dom";
import TopNavbar from "../components/Navbar";
import '../css/pagecss/Home.css'

function Home() {
  return (
    <>
      <TopNavbar />
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome to the Academic Issue Tracking System</h1>
          <p>Track and resolve academic record-related issues with ease.</p>
          <div className="auth-buttons">
            <Link to="/signup" className="btn btn-home signup-btn">Sign Up</Link>
            <Link to="/login" className="btn btn-home login-btn">Log In</Link>
          </div>
        </div>
      </div>
    </>
  );
}


export default Home;
