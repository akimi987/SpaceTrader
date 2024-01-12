import React from "react";
import { Link } from "react-router-dom";
import '../assets/styles/header.css';

const Header = () => {
    return (
      <section className="header-container">
        <h1 className="header-logo">Galactic Odyssey</h1>
        <div className="header-links">
          <Link to="/dashboard" className="header-link">
            Accueil
          </Link>
          <Link to="/vaisseaux" className="header-link">
            Vaisseaux
          </Link>
          <Link to={"/"}>
                <i className="fas fa-sign-out-alt"></i> Déconnexion
          </Link>
        </div>
      </section>
    );
  };

export default Header;
