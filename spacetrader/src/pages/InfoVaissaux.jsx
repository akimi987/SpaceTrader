import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { DistanceDisplay } from "../services/distance";
import { LocationReload } from "../services/location";
import { showMarketData } from "../services/marche";

export default function InfoVaissaux(props = {}) {
  const token = localStorage.getItem("token");
  const [data, setData] = useState(null);
  const [waypointData, setWaypointData] = useState(null);
  const [marketData, setMarketData] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const Shipsymbol = params.get("symbol");

  useEffect(() => {
    if (Shipsymbol) {
      const fetchData = async () => {
        try {
          const shipResponse = await axios.get(
            `https://api.spacetraders.io/v2/my/ships/${Shipsymbol}`,
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
              `https://api.spacetraders.io/v2/systems/${systemSymbol}/waypoints/${symbol}`,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (waypointResponse.status === 200) {
              const waypointData = waypointResponse.data.data;
              setWaypointData(waypointData);
            }
            const marketResponse = await axios.get(
              `https://api.spacetraders.io/v2/systems/${systemSymbol}/waypoints/${symbol}/market`,
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
          console.error("Erreur lors de la récupération des données :", error);
        }
      };
      fetchData();
    }
  }, [Shipsymbol, token]);

  const [apiResponse, setApiResponse] = useState(null);

  const handleScanWaypoints = async () => {
    try {
      const response = await axios.post(
        `https://api.spacetraders.io/v2/my/ships/${data.symbol}/scan/waypoints`,
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
      console.error("Erreur lors de l'interaction avec l'API :", error);
    }
  };

  const [ExtractResources, setExtractResources] = useState(null);

  const handleExtractResources = async () => {
    try {
      const response = await axios.post(
        `https://api.spacetraders.io/v2/my/ships/${data.symbol}/extract`,
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
      console.error("Erreur lors de l'interaction avec l'API :", error);
    }
  };

  const handleLanding = async () => {
    try {
      const response = await axios.post(
        `https://api.spacetraders.io/v2/my/ships/${data.symbol}/dock`,
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
        "Erreur lors de l'interaction avec l'API pour Se poser :",
        error
      );
    }
  };

  const handleOrbit = async () => {
    try {
      const response = await axios.post(
        `https://api.spacetraders.io/v2/my/ships/${data.symbol}/orbit`,
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
        "Erreur lors de l'interaction avec l'API pour Orbit :",
        error
      );
    }
  };

  const handleGoClick = async (symbol) => {
    const options = {
      method: "POST",
      url: `https://api.spacetraders.io/v2/my/ships/${data.symbol}/navigate`,
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
        `https://api.spacetraders.io/v2/my/ships/${data.symbol}/nav`,
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

  const handleRefuel = async (e) => {
    const options = {
      method: "POST",
      url: "https://api.spacetraders.io/v2/my/ships/MULX-1/refuel",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { units: "100", fromCargo: false },
    };
    try {
      const { data } = await axios.request(options);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const sellMaterial = async (materialSymbol, maxUnits) => {
    const unitsToSell = prompt(
      `Combien d'unités de ${materialSymbol} voulez-vous vendre ? (maximum : ${maxUnits})`
    );

    if (unitsToSell === null || unitsToSell === "") return;

    const options = {
      method: "POST",
      url: `https://api.spacetraders.io/v2/my/ships/${data.symbol}/sell`,
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

  function formatTimeToFrenchLocale(isoTimeString) {
    const arrivalDate = new Date(isoTimeString);
    const currentDate = new Date();

    const remainingMilliseconds = arrivalDate - currentDate;

    if (remainingMilliseconds > 0) {
      const minutes = Math.floor(remainingMilliseconds / (1000 * 60));
      const seconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);
      return `${minutes} min ${seconds} sec`;
    } else {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      return arrivalDate.toLocaleTimeString("fr-FR", options);
    }
  }

  return (
    <>
      <div className="page">
        <section className="menu">
          <h1 className="menu__logo">
            <img src="/images/logo.png" /> Era Pilot{" "}
          </h1>
          <div className="menu__link">
            <h3 className="h3__title"> GENERAL </h3>
            <Link to={"/dashboard"} className="menu__link--dashboard">
              {" "}
              <svg
                width="50"
                height="50"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 6.875C5.5 6.51033 5.64487 6.16059 5.90273 5.90273C6.16059 5.64487 6.51033 5.5 6.875 5.5H12.375C12.7397 5.5 13.0894 5.64487 13.3473 5.90273C13.6051 6.16059 13.75 6.51033 13.75 6.875V13.75C13.75 14.1147 13.6051 14.4644 13.3473 14.7223C13.0894 14.9801 12.7397 15.125 12.375 15.125H6.875C6.51033 15.125 6.16059 14.9801 5.90273 14.7223C5.64487 14.4644 5.5 14.1147 5.5 13.75V6.875ZM19.25 6.875C19.25 6.51033 19.3949 6.16059 19.6527 5.90273C19.9106 5.64487 20.2603 5.5 20.625 5.5H26.125C26.4897 5.5 26.8394 5.64487 27.0973 5.90273C27.3551 6.16059 27.5 6.51033 27.5 6.875V9.625C27.5 9.98967 27.3551 10.3394 27.0973 10.5973C26.8394 10.8551 26.4897 11 26.125 11H20.625C20.2603 11 19.9106 10.8551 19.6527 10.5973C19.3949 10.3394 19.25 9.98967 19.25 9.625V6.875ZM5.5 22C5.5 21.6353 5.64487 21.2856 5.90273 21.0277C6.16059 20.7699 6.51033 20.625 6.875 20.625H12.375C12.7397 20.625 13.0894 20.7699 13.3473 21.0277C13.6051 21.2856 13.75 21.6353 13.75 22V26.125C13.75 26.4897 13.6051 26.8394 13.3473 27.0973C13.0894 27.3551 12.7397 27.5 12.375 27.5H6.875C6.51033 27.5 6.16059 27.3551 5.90273 27.0973C5.64487 26.8394 5.5 26.4897 5.5 26.125V22ZM19.25 17.875C19.25 17.5103 19.3949 17.1606 19.6527 16.9027C19.9106 16.6449 20.2603 16.5 20.625 16.5H26.125C26.4897 16.5 26.8394 16.6449 27.0973 16.9027C27.3551 17.1606 27.5 17.5103 27.5 17.875V26.125C27.5 26.4897 27.3551 26.8394 27.0973 27.0973C26.8394 27.3551 26.4897 27.5 26.125 27.5H20.625C20.2603 27.5 19.9106 27.3551 19.6527 27.0973C19.3949 26.8394 19.25 26.4897 19.25 26.125V17.875Z"
                  stroke-width="2.5"
                />
              </svg>{" "}
              Accueil{" "}
            </Link>
            <Link to={"/vaisseaux"} className="menu__link--vaisseaux">
              {" "}
              <svg
                width="50"
                height="50"
                viewBox="0 0 28 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5274 -0.0078125L17.3339 2.09711L20.9411 9.31135L20.469 11.1998L19.0075 10.9562L19.1927 10.339L19.3592 9.78397L14 8.71229L8.64087 9.78397L8.99255 10.9562L7.53104 11.1997L7.05896 9.31135L10.666 2.09723L13.4727 -0.0078125V3.27344H11.1875L10.25 5.14844L14 7.375L17.75 5.14844L16.8125 3.27344H14.5274V-0.0078125ZM25.5613 9.90965L27.3367 10.5015L26.547 12.2127L24.7883 11.9197L25.5613 9.90965ZM2.43872 9.90965L3.21181 11.9196L1.45306 12.2127L0.66333 10.5015L2.43872 9.90965ZM14 10.0305L17.1524 13.4695L15.4828 19.0352H12.5174L10.8477 13.4695L14 10.0305ZM15.4798 10.0837L18.0159 10.591L17.5052 12.2933L15.4798 10.0837ZM12.5203 10.0838L10.4948 12.2934L9.98419 10.591L12.5203 10.0838ZM18.7019 11.9745L27.2715 13.4027L24.1836 19.5789L18.3348 13.1983L18.7019 11.9745ZM9.29812 11.9745L9.66526 13.1983L3.81644 19.5788L0.728545 13.4027L9.29812 11.9745ZM17.982 14.3745L22.2125 18.9896L17.2581 16.7876L17.982 14.3745ZM10.0181 14.3745L10.742 16.7876L5.78753 18.9896L10.0181 14.3745ZM16.9525 17.806L18.631 18.552L17.3383 23.7227H14.5274V20.0898H16.2673L16.9525 17.806ZM11.0475 17.806L11.7327 20.0898H13.4727V23.7227H10.6618L9.36907 18.552L11.0475 17.806ZM21.711 19.9208L22.7718 20.3923L22.1868 21.66L21.2266 21.1799L21.711 19.9208ZM6.28909 19.9208L6.77343 21.1799L5.81325 21.66L5.22825 20.3923L6.28909 19.9208ZM17.2227 24.7773V26.5352H15.4649V24.7773H17.2227ZM12.5352 24.7773V26.5352H10.7774V24.7773H12.5352Z"
                  fill="#020202"
                />
              </svg>{" "}
              Vaisseaux{" "}
            </Link>
          </div>
          <p className="menu__made">
            {" "}
            <img src="/images/logo.png" /> 2024 Kadre DOGA{" "}
          </p>
        </section>
        <section className="vaisseaux">
          <h2 className="h2__title"> Vaisseau</h2>
          <Link className="vaisseaux__retour" to={"/vaisseaux"}>
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
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>{" "}
            Retour{" "}
          </Link>
          <div className="vaisseau__page">
            <div className="vaisseau__page--left">
              <button
                className="btn__able btn__refresh"
                onClick={LocationReload}
              >
                {" "}
                Recharger{" "}
              </button>
              <div className="vaisseau__page--name">
                <h3 className="h3__title">
                  {data ? data.symbol : "Chargement..."}
                </h3>
                <p>{data ? data.engine.name : "Chargement..."}</p>
              </div>
              <div className="vaisseau__page--place">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 38 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 19C20.8897 19 22.7019 18.2493 24.0381 16.9131C25.3743 15.5769 26.125 13.7647 26.125 11.875C26.125 9.98533 25.3743 8.17306 24.0381 6.83686C22.7019 5.50067 20.8897 4.75 19 4.75C17.1103 4.75 15.2981 5.50067 13.9619 6.83686C12.6257 8.17306 11.875 9.98533 11.875 11.875C11.875 13.7647 12.6257 15.5769 13.9619 16.9131C15.2981 18.2493 17.1103 19 19 19ZM19 21.375C16.4804 21.375 14.0641 20.3741 12.2825 18.5925C10.5009 16.8109 9.5 14.3946 9.5 11.875C9.5 9.35544 10.5009 6.93908 12.2825 5.15749C14.0641 3.37589 16.4804 2.375 19 2.375C21.5196 2.375 23.9359 3.37589 25.7175 5.15749C27.4991 6.93908 28.5 9.35544 28.5 11.875C28.5 14.3946 27.4991 16.8109 25.7175 18.5925C23.9359 20.3741 21.5196 21.375 19 21.375Z"
                    fill="#66CCFF"
                  />
                  <path
                    d="M19 19C19.3149 19 19.617 19.1251 19.8397 19.3478C20.0624 19.5705 20.1875 19.8726 20.1875 20.1875V29.6875C20.1875 30.0024 20.0624 30.3045 19.8397 30.5272C19.617 30.7499 19.3149 30.875 19 30.875C18.6851 30.875 18.383 30.7499 18.1603 30.5272C17.9376 30.3045 17.8125 30.0024 17.8125 29.6875V20.1875C17.8125 19.8726 17.9376 19.5705 18.1603 19.3478C18.383 19.1251 18.6851 19 19 19Z"
                    fill="#66CCFF"
                  />
                  <path
                    d="M14.25 24.0872V26.4979C10.0106 27.1771 7.125 28.6449 7.125 29.6875C7.125 31.0864 12.3168 33.25 19 33.25C25.6833 33.25 30.875 31.0864 30.875 29.6875C30.875 28.6425 27.9894 27.1771 23.75 26.4979V24.0872C29.2838 24.9019 33.25 27.1035 33.25 29.6875C33.25 32.965 26.8708 35.625 19 35.625C11.1293 35.625 4.75 32.965 4.75 29.6875C4.75 27.1011 8.71625 24.9019 14.25 24.0872Z"
                    fill="#66CCFF"
                  />
                </svg>
                <div>
                  <p className="strong">
                    {data ? data.nav.route.destination.type : "Chargement..."} -{" "}
                    {data ? data.nav.route.destination.symbol : "Chargement..."}
                  </p>
                  <p>
                    {waypointData &&
                      waypointData.traits &&
                      waypointData.traits.map((trait, index) => (
                        <span key={index}>
                          {trait.name}
                          {index !== waypointData.traits.length - 1 ? ", " : ""}
                        </span>
                      ))}
                  </p>
                </div>
              </div>
              <div className="vaisseau__page--flight">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 36 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M34.7898 0.328262L31.0393 3.76088L29.4112 8.00768C26.8405 9.15399 25.852 9.82173 24.8489 13.5647L27.7853 12.2543L27.6462 14.6363L30.4177 15.7009L32.0319 13.8825L33.34 16.8186C35.1599 13.6668 35.2447 12.125 33.6578 9.63574L35.2859 5.38894L34.7896 0.328262H34.7898ZM27.878 16.5359C26.666 18.4032 25.0565 20.1407 23.1976 21.5988C23.1959 21.6002 23.1948 21.6022 23.1931 21.6035C20.4246 23.362 17.0129 23.7661 14.4283 22.7679C15.6333 23.8853 17.2215 24.3046 18.8187 24.1896C15.1516 25.2935 11.2247 24.8663 8.45603 23.1297C9.50563 24.5647 11.0161 25.4469 12.6843 25.8456C8.31056 26.0926 3.93432 24.3766 0.628174 19.6112L0.628322 32.0822C5.52008 34.2085 10.6588 33.5383 15.1914 31.2242L13.9319 33.8797L20.4725 27.5689H20.4656C20.614 27.4356 20.7605 27.3017 20.9061 27.1653L20.069 30.4263L24.5081 23.0461C25.9679 21.0006 27.1246 18.7871 27.8781 16.5358L27.878 16.5359Z"
                    fill="#66CCFF"
                  />
                </svg>

                <p>{data ? data.nav.flightMode : "Chargement..."}</p>
                <select
                  className="btn__able"
                  value={selectedMode}
                  onChange={handleChange}
                >
                  <option value="changer" disabled>
                    Changer
                  </option>
                  <option value="DRIFT">DRIFT</option>
                  <option value="STEALTH">STEALTH</option>
                  <option value="CRUISE">CRUISE</option>
                  <option value="BURN">BURN</option>
                </select>
              </div>
              <div className="vaisseau__page--status">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 33 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29.4583 25.0833H2.54165C1.67082 25.0833 0.958318 25.7958 0.958318 26.6667C0.958318 27.5375 1.67082 28.25 2.54165 28.25H29.4583C30.3292 28.25 31.0417 27.5375 31.0417 26.6667C31.0417 25.7958 30.3292 25.0833 29.4583 25.0833ZM31.9442 10.2633C31.5958 8.99666 30.2975 8.25249 29.0308 8.58499L20.6233 10.8333L10.395 1.30166C10.1834 1.10108 9.92314 0.959088 9.63995 0.889679C9.35676 0.820269 9.06037 0.825834 8.77998 0.905824C7.70332 1.20666 7.19665 2.44166 7.75082 3.40749L13.1975 12.8442L5.32832 14.95L2.84248 12.9867C2.44665 12.6858 1.93998 12.575 1.44915 12.7017L0.926651 12.8442C0.419984 12.9708 0.182484 13.5567 0.451651 14L3.42832 19.1458C3.79248 19.7633 4.52082 20.0642 5.20165 19.89L30.25 13.1767C31.5167 12.8283 32.2767 11.53 31.9442 10.2633Z"
                    fill="#66CCFF"
                  />
                </svg>

                <p>{data ? data.nav.status : "Chargement..."} </p>
                {data && data.nav.status === "IN_TRANSIT" && (
                  <span>
                    {data
                      ? formatTimeToFrenchLocale(data.nav.route.arrival)
                      : "Calcul du temps restant..."}
                  </span>
                )}
                {data && data.nav.status === "IN_ORBIT" && (
                  <button className="btn__able" onClick={handleLanding}>
                    Se poser
                  </button>
                )}
                {data && data.nav.status === "DOCKED" && (
                  <button className="btn__able" onClick={handleOrbit}>
                    Décoller
                  </button>
                )}
              </div>
              <div className="vaisseau__waypoints">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.97917 3.74025L18.2389 16L16.0001 18.2388L10.5439 12.7827C9.84298 13.9711 9.54929 15.3558 9.7075 16.7265C9.86571 18.0971 10.4672 19.3785 11.4204 20.376C12.3737 21.3734 13.6266 22.0323 14.9886 22.2524C16.3507 22.4726 17.7473 22.2419 18.9662 21.5955C20.1852 20.9491 21.1597 19.9223 21.7416 18.6713C22.3235 17.4203 22.4809 16.0135 22.19 14.6648C21.8991 13.3161 21.1757 12.0993 20.1299 11.1994C19.084 10.2995 17.7729 9.76579 16.3959 9.67933L13.5396 6.82142C15.6996 6.24217 17.9948 6.44352 20.021 7.39004C22.0472 8.33656 23.6745 9.96756 24.6164 11.9959C25.5584 14.0242 25.7546 16.3198 25.1704 18.4785C24.5863 20.6373 23.2593 22.5207 21.4231 23.7973C19.5869 25.0739 17.3592 25.6618 15.1322 25.4575C12.9052 25.2531 10.8217 24.2697 9.24842 22.6803C7.67518 21.0908 6.71311 18.9974 6.53157 16.7684C6.35004 14.5394 6.96069 12.3178 8.25601 10.4948L5.99342 8.23217C4.10527 10.6663 3.16891 13.7051 3.3596 16.7798C3.55029 19.8545 4.85496 22.7543 7.02941 24.9365C9.20386 27.1187 12.099 28.4337 15.173 28.6353C18.247 28.8369 21.2892 27.9113 23.73 26.0318C26.1708 24.1523 27.843 21.4477 28.4337 18.4243C29.0243 15.4008 28.4928 12.2657 26.9388 9.60583C25.3847 6.94594 22.9145 4.94356 19.9907 3.97349C17.0668 3.00342 13.8896 3.13215 11.0538 4.33558L8.67559 1.959C10.9362 0.777864 13.4496 0.162827 16.0001 0.166667C24.7448 0.166667 31.8334 7.25525 31.8334 16C31.8334 24.7448 24.7448 31.8333 16.0001 31.8333C7.25534 31.8333 0.166756 24.7448 0.166756 16C0.16437 13.6531 0.684779 11.3352 1.69018 9.21454C2.69558 7.09391 4.16072 5.22387 5.97917 3.74025Z"
                    fill="#66CCFF"
                  />
                </svg>
                {data ? (
                  data.nav.status === "IN_ORBIT" ? (
                    <>
                      {data.mounts.some((mount) =>
                        mount.name.toLowerCase().includes("sensor")
                      ) ? (
                        <button
                          className="btn__able"
                          onClick={handleScanWaypoints}
                        >
                          Scannez les Waypoints
                        </button>
                      ) : (
                        <>
                          <button disabled className="btn__disabled">
                            Scannez les Waypoints
                          </button>
                          <p className="msg__error">
                            Vous n'avez pas les technologies pour scanner les
                            waypoints.
                          </p>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <button disabled className="btn__disabled">
                        Scannez les Waypoints
                      </button>
                      <p className="msg__error">
                        Vous devez passer en orbit pour scanner les waypoints.
                      </p>
                    </>
                  )
                ) : null}
              </div>
              <div className="vaisseau__minerais">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 28 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.549 35.4515L12.9679 25.7192L11.9944 35.2078L8.70964 33.3826L12.3481 20.8435L15.4002 25.8407L16.8597 32.6534L14.549 35.4515ZM3.14227 35.1635L2.56188 33.0963L0.500383 32.4267L2.56648 31.8459L3.23594 29.7838L3.81707 31.8504L5.87909 32.5206L3.81254 33.101L3.14227 35.1635ZM7.66516 31.0462L5.51505 30.8798L0.753172 23.0579L0.445312 16.9044L6.26874 19.1562L10.0613 24.2005L8.84428 28.8728L4.1607 22.7092L7.66531 31.0462H7.66516ZM18.4761 28.9119L17.2129 28.7541L16.5814 25.5164L15.5216 23.5292L22.3344 16.7165L24.6463 17.4457L23.673 22.9203L18.4762 28.9119L18.4761 28.9119ZM19.8379 25.8026L21.8618 23.389L22.6025 20.3518L20.7335 22.7654L19.8379 25.8026ZM10.5667 22.9522L7.70725 19.1211L9.34971 11.0294L15.068 3.97473L19.7515 10.3002L19.2654 18.1477L14.8856 22.6483L12.0876 18.3902L10.5667 22.9522ZM14.0787 19.4454L16.096 12.4243L17.932 10.7278L15.8516 11.0136L15.0254 7.80138L14.5387 11.0136L11.1733 11.423L14.5211 12.6231L14.0788 19.4453L14.0787 19.4454ZM6.86108 17.9813L4.79216 14.6959L5.52247 7.76286L7.83386 12.3856L6.861 17.9814L6.86108 17.9813ZM24.099 16.3143L23.3664 13.7037L20.7631 12.8581L23.3721 12.1243L24.2177 9.52103L24.9514 12.1306L27.5547 12.9768L24.9457 13.7093L24.0988 16.3144L24.099 16.3143ZM8.22359 9.04514L7.30743 5.78025L4.05101 4.72264L7.31485 3.80492L8.37225 0.5485L9.29011 3.81234L12.5459 4.87093L9.28261 5.78753L8.22359 9.04514Z"
                    fill="#66CCFF"
                  />
                </svg>

                {data ? (
                  data.nav.status === "IN_ORBIT" &&
                  [
                    "ASTEROID",
                    "ASTEROID_FIELD",
                    "ENGINEERED_ASTEROID",
                  ].includes(data.nav.route.destination.type) ? (
                    <button
                      className="btn__able"
                      onClick={handleExtractResources}
                    >
                      Extraire du minerais
                    </button>
                  ) : (
                    <>
                      <button disabled className="btn__disabled">
                        Extraire du minerais
                      </button>
                      <p className="msg__error">
                        {" "}
                        Vous devez vous trouvez sur tout type d'Astéroid pour
                        pouvoir extraire du minerais
                      </p>
                    </>
                  )
                ) : null}
              </div>
            </div>
            <div className="vaisseau__page--right">
              <div className="vaisseau__page--contain">
                <div className="progress-container">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.0486 4.32642C19.1774 4.45535 19.2499 4.63019 19.2499 4.81249C19.2499 4.99479 19.1774 5.16962 19.0486 5.29855L17.4721 6.87499L19.0486 8.45142C19.1738 8.58109 19.2431 8.75475 19.2415 8.93501C19.24 9.11527 19.1677 9.28771 19.0402 9.41517C18.9127 9.54264 18.7403 9.61495 18.56 9.61651C18.3798 9.61808 18.2061 9.54878 18.0764 9.42355L16.5 7.84711L14.9236 9.42355C14.8597 9.48738 14.7839 9.538 14.7004 9.57253C14.617 9.60706 14.5276 9.62481 14.4373 9.62478C14.347 9.62475 14.2575 9.60693 14.1741 9.57235C14.0907 9.53776 14.0149 9.48708 13.9511 9.4232C13.8873 9.35933 13.8366 9.28351 13.8021 9.20007C13.7676 9.11663 13.7498 9.0272 13.7499 8.9369C13.7499 8.8466 13.7677 8.75719 13.8023 8.67377C13.8369 8.59035 13.8876 8.51457 13.9514 8.45074L15.5279 6.87499L13.9514 5.29855C13.8876 5.23467 13.837 5.15885 13.8025 5.07541C13.7679 4.99197 13.7502 4.90255 13.7502 4.81224C13.7502 4.72194 13.7681 4.63253 13.8026 4.54911C13.8372 4.4657 13.8879 4.38991 13.9518 4.32608C14.0157 4.26225 14.0915 4.21163 14.1749 4.1771C14.2584 4.14257 14.3478 4.12482 14.4381 4.12485C14.5284 4.12488 14.6178 4.1427 14.7012 4.17728C14.7846 4.21187 14.8604 4.26255 14.9243 4.32642L16.5 5.90286L18.0764 4.32642C18.2054 4.19754 18.3802 4.12513 18.5625 4.12513C18.7448 4.12513 18.9196 4.19754 19.0486 4.32642ZM13.1986 22.5005C13.6589 22.6539 14.1549 22.6645 14.6213 22.531C15.0878 22.3975 15.503 22.1262 15.8125 21.7525V28.8908L7.5625 25.7812V20.6222L13.1986 22.5005Z"
                      fill="#66CCFF"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M25.4375 25.7812L17.1875 28.8908V21.7525C17.497 22.1262 17.9122 22.3975 18.3787 22.531C18.8451 22.6645 19.3411 22.6539 19.8014 22.5005L25.4375 20.6222V25.7812ZM16.7248 10.3503C16.5792 10.2999 16.4208 10.2999 16.2752 10.3503L7.33907 13.444L7.32326 13.4489C7.20305 13.4934 7.09776 13.5708 7.01938 13.6723L4.27626 17.1015C4.20697 17.188 4.15961 17.2899 4.1382 17.3986C4.11679 17.5073 4.12197 17.6196 4.1533 17.7259C4.18463 17.8321 4.24118 17.9293 4.31813 18.009C4.39508 18.0887 4.49016 18.1486 4.59526 18.1837L13.8765 21.2774C14.0171 21.3241 14.169 21.3242 14.3096 21.2776C14.4502 21.2311 14.572 21.1403 14.6568 21.0189L16.5 18.3858L18.3425 21.0189C18.4274 21.1405 18.5493 21.2313 18.6901 21.2779C18.8308 21.3245 18.9829 21.3243 19.1235 21.2774L28.4048 18.1837C28.5099 18.1487 28.6051 18.0888 28.6821 18.0092C28.7591 17.9295 28.8158 17.8324 28.8471 17.7261C28.8785 17.6198 28.8838 17.5075 28.8624 17.3988C28.8411 17.29 28.7937 17.188 28.7244 17.1015L25.9813 13.6723C25.8993 13.5662 25.7879 13.4866 25.6609 13.4434L16.7248 10.3503ZM16.5 16.4601L23.3358 14.0937L16.5 11.7274L9.6642 14.0937L16.5 16.4601Z"
                      fill="#66CCFF"
                    />
                  </svg>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        height: data
                          ? `${(data.cargo.units / data.cargo.capacity) * 100}%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                  <p>
                    {data ? `${data.cargo.units}  ` : "...Chargement"}
                    <span>{data ? data.cargo.capacity : ""}</span>
                  </p>
                </div>
                <div className="progress-container">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.125 2.75H8.25C8.635 2.75 8.97875 2.90125 9.22625 3.14875L12.0862 6.0225L13.1863 4.93625C13.75 4.4 14.4375 4.125 15.125 4.125H23.375C24.0625 4.125 24.75 4.4 25.3137 4.93625L26.6887 6.31125C27.225 6.875 27.5 7.5625 27.5 8.25V26.125C27.5 26.8543 27.2103 27.5538 26.6945 28.0695C26.1788 28.5853 25.4793 28.875 24.75 28.875H11C10.2707 28.875 9.57118 28.5853 9.05546 28.0695C8.53973 27.5538 8.25 26.8543 8.25 26.125V11C8.25 10.3125 8.525 9.625 9.06125 9.06125L10.1475 7.96125L7.68625 5.5H4.125V2.75ZM15.125 6.875V9.625H23.375V6.875H15.125ZM15.6887 15.125L12.9387 12.375H11V14.3137L13.75 17.0637V21.4363L11 24.1863V26.125H12.9387L15.6887 23.375H20.0613L22.8113 26.125H24.75V24.1863L22 21.4363V17.0637L24.75 14.3137V12.375H22.8113L20.0613 15.125H15.6887ZM16.5 17.875H19.25V20.625H16.5V17.875Z"
                      fill="#66CCFF"
                    />
                  </svg>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        height: data
                          ? `${(data.fuel.current / data.fuel.capacity) * 100}%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                  <p>
                    {data ? `${data.fuel.current}  ` : "...Chargement"}
                    <span>{data ? data.fuel.capacity : ""}</span>
                  </p>
                </div>
              </div>
              <div className="progress__bar--bottom">
                {data && data.cargo && data.cargo.inventory && (
                  <div className="inventory">
                    {data.cargo.inventory.map((item, index) => (
                      <div className="inventory__item" key={index}>
                        <p>
                          <strong>{item.name}</strong> ({item.units})
                        </p>
                        {data.nav.status === "IN_TRANSIT" ? (
                          <svg
                            width="25"
                            height="25"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_24_41)">
                              <path
                                d="M15.8399 16.56C16.6352 16.56 17.2799 15.9153 17.2799 15.12C17.2799 14.3247 16.6352 13.68 15.8399 13.68C15.0446 13.68 14.3999 14.3247 14.3999 15.12C14.3999 15.9153 15.0446 16.56 15.8399 16.56Z"
                                fill="#FF3333"
                              />
                              <path
                                d="M5.39996 16.56C6.19525 16.56 6.83996 15.9153 6.83996 15.12C6.83996 14.3247 6.19525 13.68 5.39996 13.68C4.60467 13.68 3.95996 14.3247 3.95996 15.12C3.95996 15.9153 4.60467 16.56 5.39996 16.56Z"
                                fill="#FF3333"
                              />
                              <path
                                d="M16.92 11.88H5.67756L5.91768 11.4905C6.02064 11.3234 6.05088 11.1215 6.00156 10.9314L5.7672 10.0292L16.2011 9.48708C16.5967 9.46692 16.92 9.126 16.92 8.73V3.96C16.92 3.564 16.596 3.24 16.2 3.24H4.00284L3.86208 2.69892C3.82198 2.5446 3.73179 2.40796 3.60565 2.31042C3.47951 2.21289 3.32457 2.15998 3.16512 2.16H0.72C0.529044 2.16 0.345909 2.23586 0.210883 2.37089C0.0758569 2.50591 0 2.68905 0 2.88C0 3.07096 0.0758569 3.25409 0.210883 3.38912C0.345909 3.52415 0.529044 3.6 0.72 3.6H2.60856L4.53096 10.9962L3.77496 12.222C3.70772 12.3311 3.67082 12.4561 3.6681 12.5842C3.66538 12.7123 3.69693 12.8388 3.75948 12.9506C3.82178 13.0626 3.91286 13.1559 4.02331 13.2208C4.13376 13.2858 4.25956 13.32 4.38768 13.32H16.92C17.111 13.32 17.2941 13.2441 17.4291 13.1091C17.5641 12.9741 17.64 12.791 17.64 12.6C17.64 12.409 17.5641 12.2259 17.4291 12.0909C17.2941 11.9559 17.111 11.88 16.92 11.88Z"
                                fill="#FF3333"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_24_41">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        ) : marketData &&
                          marketData.tradeGoods &&
                          marketData.tradeGoods.some(
                            (good) => good.symbol === item.symbol
                          ) ? (
                          <button
                            className="sell__inventory"
                            onClick={() =>
                              sellMaterial(item.symbol, item.units)
                            }
                          >
                            <svg
                              width="25"
                              height="25"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_24_41)">
                                <path
                                  d="M15.8399 16.56C16.6352 16.56 17.2799 15.9153 17.2799 15.12C17.2799 14.3247 16.6352 13.68 15.8399 13.68C15.0446 13.68 14.3999 14.3247 14.3999 15.12C14.3999 15.9153 15.0446 16.56 15.8399 16.56Z"
                                  fill="#9933cc"
                                />
                                <path
                                  d="M5.39996 16.56C6.19525 16.56 6.83996 15.9153 6.83996 15.12C6.83996 14.3247 6.19525 13.68 5.39996 13.68C4.60467 13.68 3.95996 14.3247 3.95996 15.12C3.95996 15.9153 4.60467 16.56 5.39996 16.56Z"
                                  fill="#9933cc"
                                />
                                <path
                                  d="M16.92 11.88H5.67756L5.91768 11.4905C6.02064 11.3234 6.05088 11.1215 6.00156 10.9314L5.7672 10.0292L16.2011 9.48708C16.5967 9.46692 16.92 9.126 16.92 8.73V3.96C16.92 3.564 16.596 3.24 16.2 3.24H4.00284L3.86208 2.69892C3.82198 2.5446 3.73179 2.40796 3.60565 2.31042C3.47951 2.21289 3.32457 2.15998 3.16512 2.16H0.72C0.529044 2.16 0.345909 2.23586 0.210883 2.37089C0.0758569 2.50591 0 2.68905 0 2.88C0 3.07096 0.0758569 3.25409 0.210883 3.38912C0.345909 3.52415 0.529044 3.6 0.72 3.6H2.60856L4.53096 10.9962L3.77496 12.222C3.70772 12.3311 3.67082 12.4561 3.6681 12.5842C3.66538 12.7123 3.69693 12.8388 3.75948 12.9506C3.82178 13.0626 3.91286 13.1559 4.02331 13.2208C4.13376 13.2858 4.25956 13.32 4.38768 13.32H16.92C17.111 13.32 17.2941 13.2441 17.4291 13.1091C17.5641 12.9741 17.64 12.791 17.64 12.6C17.64 12.409 17.5641 12.2259 17.4291 12.0909C17.2941 11.9559 17.111 11.88 16.92 11.88Z"
                                  fill="#9933cc"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_24_41">
                                  <rect width="18" height="18" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                        ) : (
                          <svg
                            width="25"
                            height="25"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_24_41)">
                              <path
                                d="M15.8399 16.56C16.6352 16.56 17.2799 15.9153 17.2799 15.12C17.2799 14.3247 16.6352 13.68 15.8399 13.68C15.0446 13.68 14.3999 14.3247 14.3999 15.12C14.3999 15.9153 15.0446 16.56 15.8399 16.56Z"
                                fill="#FF3333"
                              />
                              <path
                                d="M5.39996 16.56C6.19525 16.56 6.83996 15.9153 6.83996 15.12C6.83996 14.3247 6.19525 13.68 5.39996 13.68C4.60467 13.68 3.95996 14.3247 3.95996 15.12C3.95996 15.9153 4.60467 16.56 5.39996 16.56Z"
                                fill="#FF3333"
                              />
                              <path
                                d="M16.92 11.88H5.67756L5.91768 11.4905C6.02064 11.3234 6.05088 11.1215 6.00156 10.9314L5.7672 10.0292L16.2011 9.48708C16.5967 9.46692 16.92 9.126 16.92 8.73V3.96C16.92 3.564 16.596 3.24 16.2 3.24H4.00284L3.86208 2.69892C3.82198 2.5446 3.73179 2.40796 3.60565 2.31042C3.47951 2.21289 3.32457 2.15998 3.16512 2.16H0.72C0.529044 2.16 0.345909 2.23586 0.210883 2.37089C0.0758569 2.50591 0 2.68905 0 2.88C0 3.07096 0.0758569 3.25409 0.210883 3.38912C0.345909 3.52415 0.529044 3.6 0.72 3.6H2.60856L4.53096 10.9962L3.77496 12.222C3.70772 12.3311 3.67082 12.4561 3.6681 12.5842C3.66538 12.7123 3.69693 12.8388 3.75948 12.9506C3.82178 13.0626 3.91286 13.1559 4.02331 13.2208C4.13376 13.2858 4.25956 13.32 4.38768 13.32H16.92C17.111 13.32 17.2941 13.2441 17.4291 13.1091C17.5641 12.9741 17.64 12.791 17.64 12.6C17.64 12.409 17.5641 12.2259 17.4291 12.0909C17.2941 11.9559 17.111 11.88 16.92 11.88Z"
                                fill="#FF3333"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_24_41">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        )}
                      </div>
                    ))}

                    {data ? (
                      data.nav.status === "IN_TRANSIT" ? (
                        <div className="btn__disabled">Marketplace</div>
                      ) : (
                        <button onClick={showMarketData} className="btn__able">
                          Marketplace
                        </button>
                      )
                    ) : (
                      <div>Chargement en cours...</div>
                    )}
                  </div>
                )}

                <div className="refuel">
                  {data && waypointData ? (
                    data.nav.status === "DOCKED" &&
                    waypointData.traits.some(
                      (trait) => trait.name === "Marketplace"
                    ) ? (
                      <button onClick={handleRefuel} className="refuel__ok">
                        +
                      </button>
                    ) : (
                      <button className="refuel__no">+</button>
                    )
                  ) : (
                    "Chargement..."
                  )}
                </div>
              </div>
            </div>
          </div>
          {marketData ? (
            <section className="marketplace hidden">
              <button className="closed" onClick={LocationReload}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14 17.5367L22.8383 26.375C23.3073 26.844 23.9434 27.1075 24.6066 27.1075C25.2699 27.1075 25.906 26.844 26.375 26.375C26.844 25.906 27.1074 25.2699 27.1074 24.6067C27.1074 23.9434 26.844 23.3073 26.375 22.8383L17.5333 14L26.3733 5.16167C26.6054 4.92945 26.7895 4.65378 26.9151 4.35041C27.0407 4.04704 27.1053 3.72191 27.1052 3.39358C27.1051 3.06525 27.0404 2.74014 26.9146 2.43683C26.7889 2.13352 26.6047 1.85795 26.3725 1.62583C26.1402 1.39372 25.8646 1.20962 25.5612 1.08405C25.2578 0.958471 24.9327 0.893878 24.6044 0.893955C24.276 0.894033 23.9509 0.958779 23.6476 1.0845C23.3443 1.21022 23.0687 1.39445 22.8366 1.62667L14 10.465L5.16164 1.62667C4.93113 1.38779 4.65536 1.1972 4.35041 1.06604C4.04547 0.934874 3.71745 0.865755 3.3855 0.862715C3.05356 0.859675 2.72433 0.922774 2.41703 1.04833C2.10973 1.17389 1.83052 1.35939 1.59568 1.59401C1.36083 1.82863 1.17507 2.10767 1.04922 2.41485C0.923377 2.72203 0.859967 3.0512 0.862694 3.38315C0.865421 3.7151 0.93423 4.04318 1.06511 4.34825C1.19598 4.65332 1.38631 4.92927 1.62497 5.16L10.4666 14L1.62664 22.84C1.38797 23.0707 1.19765 23.3467 1.06677 23.6518C0.935897 23.9568 0.867088 24.2849 0.864361 24.6169C0.861634 24.9488 0.925044 25.278 1.05089 25.5851C1.17674 25.8923 1.3625 26.1714 1.59734 26.406C1.83218 26.6406 2.1114 26.8261 2.4187 26.9517C2.726 27.0772 3.05522 27.1403 3.38717 27.1373C3.71912 27.1342 4.04713 27.0651 4.35208 26.934C4.65703 26.8028 4.9328 26.6122 5.1633 26.3733L14 17.5367Z"
                    fill="#FF3333"
                  />
                </svg>
              </button>
              <h2> Présence dans le market</h2>
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Type</th>
                    <th>Offre</th>
                    <th>Activité</th>
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
                        <td>{item.supply}</td>
                        <td>{item.activity}</td>
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
            <section className="listwaypoints">
              <button className="closed" onClick={LocationReload}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14 17.5367L22.8383 26.375C23.3073 26.844 23.9434 27.1075 24.6066 27.1075C25.2699 27.1075 25.906 26.844 26.375 26.375C26.844 25.906 27.1074 25.2699 27.1074 24.6067C27.1074 23.9434 26.844 23.3073 26.375 22.8383L17.5333 14L26.3733 5.16167C26.6054 4.92945 26.7895 4.65378 26.9151 4.35041C27.0407 4.04704 27.1053 3.72191 27.1052 3.39358C27.1051 3.06525 27.0404 2.74014 26.9146 2.43683C26.7889 2.13352 26.6047 1.85795 26.3725 1.62583C26.1402 1.39372 25.8646 1.20962 25.5612 1.08405C25.2578 0.958471 24.9327 0.893878 24.6044 0.893955C24.276 0.894033 23.9509 0.958779 23.6476 1.0845C23.3443 1.21022 23.0687 1.39445 22.8366 1.62667L14 10.465L5.16164 1.62667C4.93113 1.38779 4.65536 1.1972 4.35041 1.06604C4.04547 0.934874 3.71745 0.865755 3.3855 0.862715C3.05356 0.859675 2.72433 0.922774 2.41703 1.04833C2.10973 1.17389 1.83052 1.35939 1.59568 1.59401C1.36083 1.82863 1.17507 2.10767 1.04922 2.41485C0.923377 2.72203 0.859967 3.0512 0.862694 3.38315C0.865421 3.7151 0.93423 4.04318 1.06511 4.34825C1.19598 4.65332 1.38631 4.92927 1.62497 5.16L10.4666 14L1.62664 22.84C1.38797 23.0707 1.19765 23.3467 1.06677 23.6518C0.935897 23.9568 0.867088 24.2849 0.864361 24.6169C0.861634 24.9488 0.925044 25.278 1.05089 25.5851C1.17674 25.8923 1.3625 26.1714 1.59734 26.406C1.83218 26.6406 2.1114 26.8261 2.4187 26.9517C2.726 27.0772 3.05522 27.1403 3.38717 27.1373C3.71912 27.1342 4.04713 27.0651 4.35208 26.934C4.65703 26.8028 4.9328 26.6122 5.1633 26.3733L14 17.5367Z"
                    fill="#FF3333"
                  />
                </svg>
              </button>
              <h2> Découverte des points de passages</h2>
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Distance</th>
                    <th>Traits</th>
                    <th>Type</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {apiResponse ? (
                    apiResponse.waypoints.map((item, index) => (
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
                            className="btn__able"
                            onClick={() => handleGoClick(item.symbol)}
                          >
                            {" "}
                            Go{" "}
                          </button>
                        </td>
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
            <section className="listwaypoints hidden"></section>
          )}
        </section>
      </div>
    </>
  );
}