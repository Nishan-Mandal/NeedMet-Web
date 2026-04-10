import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../style/Header.css";
import companyLogo from '../assets/companyLogo.png'

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoClick = () => navigate('/');

  return (
    <header className="header">
      <div className="header-container">
        
        {/* Logo */}
        <div className="logo" onClick={logoClick}>
          <img src={companyLogo} alt="logo" />
          <h2>NeedMate</h2>
        </div>

        {/* Hamburger */}
        <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation */}
        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/categories" className="nav-link" onClick={() => setMenuOpen(false)}>Categories</NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About Us</NavLink>
          <NavLink to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</NavLink>
        </nav>

      </div>
    </header>
  );
}