/* Said */

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { DistanceDisplay } from "../services/distance";
import { LocationReload } from "../services/location";
import { showMarketData } from "../services/marche";
import '../assets/styles/vaisseauInfo.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import Url from "../api/apiConf";

export default function Vaisseau(props = {}) {
  const token = localStorage.getItem("token");
  const [data, setData] = useState(null);
  const [waypointInfo, setwaypointInfo] = useState(null);
  const [marketData, setMarketData] = useState(null);

  const location = useLocation();
  const parameters = new URLSearchParams(location.search);
  const Symbolship = parameters.get("symbol");

  useEffect(() => {
    if (Symbolship) {
      const fetchData = async () => {
        try {
          const shipResponse = await axios.get(
            `${Url}/v2/my/ships/${Symbolship}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (shipResponse.status === 200) {
            const shipData = shipResponse.data.data;
            setData(shipData);
            const systemSymbol = shipData.nav.route.destination.systemSymbol;
            const symbol = shipData.nav.route.destination.symbol;

            const waypointResponse = await axios.get(
              `${Url}/v2/systems/${systemSymbol}/waypoints/${symbol}`,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (waypointResponse.status === 200) {
              const waypointInfo = waypointResponse.data.data;
              setwaypointInfo(waypointInfo);
            }
            const marketResponse = await axios.get(
              `${Url}/v2/systems/${systemSymbol}/waypoints/${symbol}/market`,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (marketResponse.status === 200) {
              const marketData = marketResponse.data.data;
              setMarketData(marketData);
            }
          }
        } catch (error) {
          console.error("Récupération des données impossible :", error);
        }
      };
      fetchData();
    }
  }, [Symbolship, token]);

  const [apiResponse, setApiResponse] = useState(null);

  const handleScanWaypoints = async () => {
    try {
      const response = await axios.post(
        `${Url}/v2/my/ships/${data.symbol}/scan/waypoints`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataWaypoints = response.data.data;
      setApiResponse(dataWaypoints);
    } catch (error) {
      console.error("Impossible de joindre l'API:", error);
    }
  };

  const [ExtractResources, setExtractResources] = useState(null);

  const handleExtractResources = async () => {
    try {
      const response = await axios.post(
        `${Url}/v2/my/ships/${data.symbol}/extract`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExtractResources(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Impossible de joindre l'API :", error);
    }
  };

  const handleLanding = async () => {
    try {
      const response = await axios.post(
        `${Url}/v2/my/ships/${data.symbol}/dock`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error(
        "Impossible d'attérir :",
        error
      );
    }
  };

  const handleOrbit = async () => {
    try {
      const response = await axios.post(
        `${Url}/v2/my/ships/${data.symbol}/orbit`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error(
        "Erreur :",
        error
      );
    }
  };

  const handleGoClick = async (symbol) => {
    const options = {
      method: "POST",
      url: `${Url}/v2/my/ships/${data.symbol}/navigate`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { waypointSymbol: symbol },
    };

    try {
      const { data } = await axios.request(options);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const [selectedMode, setSelectedMode] = useState("changer");

  const handleChange = async (e) => {
    const newMode = e.target.value;

    try {
      const response = await axios.patch(
        `${Url}/v2/my/ships/${data.symbol}/nav`,
        { flightMode: newMode },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'interaction avec l'API :", error);
    }
  };
  const sellMaterial = async (materialSymbol, maxUnits) => {
    const unitsToSell = prompt(
      `Combien d'unités de ${materialSymbol} voulez-vous vendre ? (maximum : ${maxUnits})`
    );

    if (unitsToSell === null || unitsToSell === "") return;

    const options = {
      method: "POST",
      url: `${Url}/v2/my/ships/${data.symbol}/sell`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        symbol: String(materialSymbol),
        units: parseInt(unitsToSell, 10),
      },
    };

    try {
      const { data } = await axios.request(options);
      alert("La vente a bien été réalisée.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite lors de la vente.");
    }
  };

  function TimeFormat(isoTimeString) {
    const DateAterriss = new Date(isoTimeString);
    const currentDate = new Date();

    const setMilliS = DateAterriss - currentDate;

    if (setMilliS > 0) {
      const minutes = Math.floor(setMilliS / (1000 * 60));
      const seconds = Math.floor((setMilliS % (1000 * 60)) / 1000);
      return `${minutes} min ${seconds} sec`;
    } else {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      return DateAterriss.toLocaleTimeString("fr-FR", options);
    }
  }

  return (
    <>
      <Header />
      <div className="custom-page">
        <section className="custom-vaisseaux">
          <Link className="custom-vaisseaux__retour" to={"/vaisseaux"}>
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.25 9L8.75 1.5M1.25 9L8.75 16.5M1.25 9L18.75 9"
                stroke="#FF3333"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>{" "}
            Retour{" "}
          </Link>
          <div className="custom-vaisseau__page">
            <div className="custom-vaisseau__page--left">
              <div className="custom-vaisseau__page--name">
                <h3 className="custom-h3__title">
                  {data ? data.symbol : "Chargement..."}
                </h3>
                <p>{data ? data.engine.name : "Chargement..."}</p>
              </div>
              <div className="custom-vaisseau__page--place">
                <div>
                  <p className="custom-strong">
                    {data ? data.nav.route.destination.type : "Chargement..."} -{" "}
                    {data ? data.nav.route.destination.symbol : "Chargement..."}
                  </p>
                  <p>
                    {waypointInfo &&
                      waypointInfo.traits &&
                      waypointInfo.traits.map((trait, index) => (
                        <span key={index}>
                          {trait.name}
                          {index !== waypointInfo.traits.length - 1 ? ", " : ""}
                        </span>
                      ))}
                  </p>
                </div>
              </div>
              <div className="custom-vaisseau__page--flight">
                <p>{data ? data.nav.flightMode : "Chargement..."}</p>
                <select
                  className="custom-btn__able"
                  value={selectedMode}
                  onChange={handleChange}
                >
                  <option value="changer" disabled>
                    Choisir
                  </option>
                  <option value="CRUISE">CRUISE</option>
                  <option value="STEALTH">STEALTH</option>
                  <option value="DRIFT">DRIFT</option>
                  <option value="BURN">BURN</option>
                </select>
              </div>
              <div className="custom-vaisseau__page--status">
                <p>{data ? data.nav.status : "Chargement..."} </p>
                {data && data.nav.status === "IN_TRANSIT" && (
                  <span>
                    {data
                      ? TimeFormat(data.nav.route.arrival)
                      : "Calcul du temps restant..."}
                  </span>
                )}
                {data && data.nav.status === "IN_ORBIT" && (
                  <button className="custom-btn__able" onClick={handleLanding}>
                    Atterir
                  </button>
                )}
                {data && data.nav.status === "DOCKED" && (
                  <button className="custom-btn__able" onClick={handleOrbit}>
                    Décoller
                  </button>
                )}
              </div>
              {data ? (
                data.nav.status === "IN_TRANSIT" ? (
                  <div className="custom-btn__disabled">Marketplace</div>
                ) : (
                  <button onClick={showMarketData} className="custom-btn__able">
                    Marketplace
                  </button>
                )
              ) : (
                <div>Chargement en cours...</div>
              )}
              <div className="custom-vaisseau__waypoints">
                {data ? (
                  data.nav.status === "IN_ORBIT" ? (
                    <>
                      {data.mounts.some((mount) =>
                        mount.name.toLowerCase().includes("sensor")
                      ) ? (
                        <button
                          className="custom-btn__able"
                          onClick={handleScanWaypoints}
                        >
                          Scannez les Waypoints
                        </button>
                      ) : (
                        <>
                          <button disabled className="custom-btn__disabled">
                            Scannez les Waypoints
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <button disabled className="custom-btn__disabled">
                        Décoller pour scannez les Waypoints
                      </button>
                    </>
                  )
                ) : null}
              </div>
              <div className="custom-vaisseau__minerais">
                {data ? (
                  data.nav.status === "IN_ORBIT" &&
                    [
                      "ENGINEERED_ASTEROID",
                      "ASTEROID",
                      "ASTEROID_FIELD",
                    ].includes(data.nav.route.destination.type) ? (
                    <button
                      className="custom-btn__able"
                      onClick={handleExtractResources}
                    >
                      Extraire du minerais
                    </button>
                  ) : (
                    <>
                      <button disabled className="custom-btn__disabled">
                        Extraire du minerais
                      </button>
                    </>
                  )
                ) : null}
              </div>
            </div>
            <div className="custom-vaisseau__page--right">
              <div className="custom-vaisseau__page--contain"></div>
            </div>
          </div>
          {marketData ? (
            <section className="custom-marketplace hidden">
              <Link className="custom-vaisseaux__retour" to={"/vaisseaux"}>
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.25 9L8.75 1.5M1.25 9L8.75 16.5M1.25 9L18.75 9"
                    stroke="#FF3333"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
                Retour{" "}
              </Link>
              <h2> Produits disponibles</h2>
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Type</th>
                    <th>Prix d'achat</th>
                    <th>Prix de vente</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.tradeGoods && marketData.tradeGoods.length > 0 ? (
                    marketData.tradeGoods.map((item, index) => (
                      <tr key={index}>
                        <td>{item.symbol}</td>
                        <td>{item.type}</td>
                        <td>{item.purchasePrice}</td>
                        <td>{item.sellPrice}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Loading...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          ) : (
            <section className="hidden"></section>
          )}
          {apiResponse ? (
            <section className="custom-listwaypoints">
              <button className="custom-closed" onClick={LocationReload}></button>
              <h2> Waypoints</h2>
              <table>
                <thead>
                  <tr>
                    <th>Objet</th>
                    <th>Distance</th>
                    <th>Caractéristiques</th>
                    <th>Type d'objet</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apiResponse.waypoints.map((item, index) => (
                    <tr key={index}>
                      <td>{item.symbol}</td>
                      <td>
                        <DistanceDisplay
                          x1={item.x}
                          y1={item.y}
                          x2={data.nav.route.destination.x}
                          y2={data.nav.route.destination.y}
                        />
                      </td>
                      <td>
                        {item.traits.map((trait, traitIndex) => (
                          <p key={traitIndex}>{trait.name}</p>
                        ))}
                      </td>
                      <td>{item.type}</td>
                      <td>
                        <button
                          className="custom-btn__able"
                          onClick={() => handleGoClick(item.symbol)}
                        >
                          Explorer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : (
            <section className="custom-listwaypoints hidden"></section>
          )}
        </section>
      </div>
    </>
  );
}