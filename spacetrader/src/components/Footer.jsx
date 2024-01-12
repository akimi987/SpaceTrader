import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const Name = "Said ";
  const apiName = "SpaceTrader";

  return (
    <footer className="footer">
      <p>&copy; {currentYear} {Name} || {apiName}</p>
    </footer>
  );
};

export default Footer;
