import "./Navbar.css";
import { Link } from "react-router";
function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">
        <div className="navbar-title">
          <img
            style={{ width: "50px" }}
            src="src/assets/logo_white.png"
            alt="Chompibara icon"
          />
          <h1 className="navbar-titletext">Chompibara</h1>
        </div>
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/about">About </Link>
        </li>
        <li>
          <Link to="/history">Dashboard </Link>
        </li>
        <li>
          <Link to="/profile">Profile </Link>
        </li>
        <li>
          <Link to="/track">Track a new meal </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
