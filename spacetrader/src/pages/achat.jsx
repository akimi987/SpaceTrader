import React, { useEffect, useState } from "react";
import axios from "axios";
import '../assets/styles/achat.css';
import Header from "../components/Header";
import Url from "../api/apiConf";

export default function NewContact() {
  const storedId = localStorage.getItem("userId");
  if (!storedId) {
    window.location.href = "/";
  }
  const token = localStorage.getItem("token");
  const [agentData, setAgentData] = useState(null);
  const [shipsData, setShipsData] = useState([]);
  const [selectedShipyardSymbol, setSelectedShipyardSymbol] = useState(null);

  useEffect(() => {
    const getAgentInfo = async () => {
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
          "Erreur lors de la récupération des données de l'agent :",
          error
        );
      }
    };

    const getAgentInfos = async () => {
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
          const ships = response.data.data;
          const systemSymbolsSet = new Set(
            ships.map((ship) => ship.nav.systemSymbol)
          );
          const uniqueSystemSymbols = Array.from(systemSymbolsSet);

          for (let symbol of uniqueSystemSymbols) {
            const shipyardResponse = await axios.get(
              `${Url}/v2/systems/${symbol}/waypoints?traits=SHIPYARD`,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (shipyardResponse.status === 200) {
              const shipyards = shipyardResponse.data.data;

              for (let shipyard of shipyards) {
                const shipyardDataResponse = await axios.get(
                  `${Url}/v2/systems/${symbol}/waypoints/${shipyard.symbol}/shipyard`,
                  {
                    headers: {
                      Accept: "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (shipyardDataResponse.status === 200) {
                  const shipyardData = shipyardDataResponse.data.data;
                  setSelectedShipyardSymbol(shipyardData.symbol);

                  let transactionData = [];

                  if (Array.isArray(shipyardData)) {
                    transactionData = shipyardData.filter(
                      (ship) => ship.transactions
                    );
                  } else if (
                    typeof shipyardData === "object" &&
                    shipyardData !== null &&
                    shipyardData.transactions
                  ) {
                    transactionData = [shipyardData];
                  }
                  for (let transactionShip of transactionData) {
                    const exists = shipsData.some(
                      (existingShip) => existingShip.id === transactionShip.id
                    );

                    if (!exists) {
                      setShipsData((prevData) => [transactionShip]);
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(
          "Impossible de récuperer des informations sur le vaisseaux :",
          error
        );
      }
    };

    getAgentInfo();
    getAgentInfos();
  }, [token]);

  const acheterVaisseau = async (typeVaisseau) => {
    const options = {
      method: "POST",
      url: "${Url}/v2/my/ships",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { shipType: typeVaisseau, waypointSymbol: selectedShipyardSymbol },
    };

    try {
      const { data } = await axios.request(options);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className="page">
        <section className="achat-section">
          <h2 className="achat-title"> Acheter de nouveaux vaisseaux </h2>
          <div className="achat-credits">
            <p className="achat-credits-text">
              Crédits : {agentData ? agentData.credits : "Chargement..."}
            </p>
          </div>
          <div className="vaisseau-container">
            {shipsData ? (
              shipsData.map((shipyard, index) => (
                <div key={index} className="achat-shipyard-container">
                  <div className="achat-ship-container">
                    {shipyard.ships.map((vaisseau, idx) => (
                      <div key={idx} className="achat-ship">
                        <div>
                          <p className="achat-name">{vaisseau.name}</p>
                          <div className="achat-type">
                            <p>{vaisseau.type}</p>
                          </div>
                          <p className="achat-description">{vaisseau.description}</p>
                          <div className="achat-modules">
                            <p>
                              {vaisseau.modules
                                .map((module) => module.name)
                                .join(", ")}
                            </p>
                          </div>
                          <div className="achat-price">
                            Prix : <p>{vaisseau.purchasePrice}</p>
                          </div>
                          <button
                            className="achat-btn"
                            onClick={() => acheterVaisseau(vaisseau.type)}
                          >
                            Acheter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>Chargement...</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
