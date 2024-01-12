import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../assets/styles/accueil.css';
import Footer from "../components/Footer";
import Header from "../components/Header";
import Url from "../api/apiConf";

/*  */

export default function NewContact() {
  const storedId = localStorage.getItem("userId");
  if (!storedId) {
    window.location.href = "/";
  }
  const token = localStorage.getItem("token");
  const [agentData, setAgentData] = useState(null);
  const [shipData, setShipData] = useState(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await axios.get(
          `${Url}/v2/my/agent`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data.data;
          setAgentData(data);
        }
      } catch (error) {
        console.error(
          "Impossible de récupérer les données de l'agent :",
          error
        );
      }
    };

    fetchAgentData();
  }, [token, setAgentData]);

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
          setShipData(data);
          console.log(data);
        }
      } catch (error) {
        console.error(
          "Impossible de récuperer les données de l'API :",
          error
        );
      }
    };

    fetchData();
  }, [token, setShipData]);

  return (
    <>
      <Header />
      <div className="dashboard-section">
      <h2 className="dashboard-subtitle">
            Bonjour {agentData ? agentData.symbol : "Chargement..."}
            {agentData && (
            <>
              <p>Planète : {agentData.headquarters}</p>
              <p>Faction : {agentData.startingFaction}</p>
            </>
          )}
      </h2>
      <div className="dashboard-content">
        <div className="dashboard-ships">
          <h3 className="dashboard-subtitle">Mes vaisseaux</h3>
          {shipData ? (
            shipData.map((ship, index) => (
              <div className="dashboard-ship" key={index}>
                <div className="dashboard-ship-info">
                  <p className="ship-symbol">{ship.symbol}</p>
                </div>
                <Link
                  className="ship-details-link"
                  to={`/vaisseau?symbol=${ship.symbol}`}
                >
                  <i className="fas fa-info-circle"></i> Détails
                </Link>
              </div>
            ))
          ) : (
            <p>Chargement des données...</p>
          )}
        </div>
        <div className="dashboard-money">
        <h3 className="dashboard-subtitle">
            Crédits 
        </h3>
        <p>{agentData ? agentData.credits : "Chargement..."} </p>
        </div>

        <div className="dashboard-cargo">
          <h3 className="dashboard-subtitle">Minerais wallet</h3>
          {shipData ? (
            Object.values(shipData).map((ship, index) => (
              <div key={index}>
                {ship.cargo && ship.cargo.inventory ? (
                  ship.cargo.inventory.map((item, idx) => (
                    <div className="dashboard-cargo-unit" key={idx}>
                      <p>{item.name}</p>
                      <p>{item.units}</p>
                    </div>
                  ))
                ) : (
                  <p>Pas d'infos pour ce vaisseau.</p>
                )}
              </div>
            ))
          ) : (
            <p>Chargement des données...</p>
          )}
        </div>
      </div>
    </div>
    <div className="footer">
            <Footer />
    </div>  
    </>
  );
}