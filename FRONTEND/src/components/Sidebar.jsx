import { Link, useNavigate } from "react-router-dom";
import "../css/componentcss/Sidebar.css";
import { useRole } from "../contexts/RoleContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faGlobe,
  // faCogs,
  // faMapMarker,
  // faInfo,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth

const Sidebar = () => {
  const { role } = useRole();
  let navigate = useNavigate();
  const { logout, user } = useAuth(); // Get user details

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("You are successfully logged out!");
  };

  return (
    <div className="area">
      <nav className="main-menu">
        {/* Display User's Full Name */}
        <div className="user-info">
          <span className="user-name">
            {user.first_name}
          </span>
        </div>

        <ul>
        <li>
            <Link to={`/dashboards/${role}/profile`}>
              <FontAwesomeIcon icon={faHome} className="fa-2x" />
              <span className="nav-text">Profile</span>
            </Link>
          </li>
          <li>
            <Link to={`/dashboards/${role}/${role}-dashboard`}>
              <FontAwesomeIcon icon={faHome} className="fa-2x" />
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>
          <li className="has-subnav">
            <Link to={`/dashboards/${role}/issues`}>
              <FontAwesomeIcon icon={faGlobe} className="fa-2x" />
              <span className="nav-text">Issues</span>
            </Link>
          </li>
          {/* <li>
            <Link to={`/dashboards/${role}/notifications`}>
              <FontAwesomeIcon icon={faMapMarker} className="fa-2x" />
              <span className="nav-text">Notifications</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <FontAwesomeIcon icon={faCogs} className="fa-2x" />
              <span className="nav-text">Help</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <FontAwesomeIcon icon={faInfo} className="fa-2x" />
              <span className="nav-text">Documentation</span>
            </Link>
          </li> */}
        </ul>

        <ul className="logout">
          <li>
            <button onClick={handleLogout} className="logout-button">
              <FontAwesomeIcon icon={faPowerOff} className="fa-2x" />
              <span className="nav-text">LOG OUT</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
