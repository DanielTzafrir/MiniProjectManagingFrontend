import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/dashboard">
        <button>Dashboard</button>
      </Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Header;
