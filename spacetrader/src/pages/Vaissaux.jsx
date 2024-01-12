/* Said */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import '../assets/styles/ListeVaisseau.css';
import Url from "../api/apiConf";

export default function NewContact() {
  const storedId = localStorage.getItem("userId");
  if (!storedId) {
    window.location.href = "/";
  }
  const token = localStorage.getItem("token");
  const [spacecraftData, setSpacecraftData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${Url}/v2/my/ships`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data.data;
          setSpacecraftData(data);
        }
      } catch (error) {
        console.error(
          "Impossible de joinde l'API :",
          error
        );
      }
    };

    fetchData();
  }, [token, setSpacecraftData]);

  const filteredSpacecrafts = spacecraftData
    ? spacecraftData.filter((spacecraft) =>
        spacecraft.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      <Header />
      <div className="custom-page">
        <section className="custom-spacecrafts">
          <h2 className="custom-h2__title">Liste de mes vaisseaux</h2>
          <div className="custom-spacecrafts__link">
            <Link to={"/buy"} className="custom-spacecrafts__link--buy">
              Acheter un vaisseau
            </Link>
            <div className="custom-spacecrafts__link--search">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
              </svg>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un vaisseau"
              />
            </div>
          </div>
          <div className="custom-spacecraft">
            {spacecraftData ? (
              filteredSpacecrafts.map((spacecraft, index) => (
                <div className="custom-spacecraft__info" key={index}>
                  <div className="custom-spacecraft__info--text">
                    <p className="custom-symbol">{spacecraft.symbol}</p>
                    <p className="custom-destination">
                      {spacecraft.nav.route.destination.symbol}
                      {"  "}
                      {spacecraft.nav.route.destination.type}
                    </p>
                    <p className="custom-engine">{spacecraft.engine.name}</p>
                    <Link
                      className="custom-spacecraft__info--link"
                      to={`/vaisseau?symbol=${spacecraft.symbol}`}
                    >
                      Plus d'infos
                    </Link>
                  </div>

                  <div className="custom-spacecraft__info--container">
                  </div>
                </div>
              ))
            ) : (
              <p>Chargement des données...</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
