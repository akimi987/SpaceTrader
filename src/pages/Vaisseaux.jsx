import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AddContactForm() {
  const storedId = localStorage.getItem("userId");
  if (!storedId) {
    window.location.href = "/";
  }
  const token = localStorage.getItem("token");
  const [shipData, setShipData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.spacetraders.io/v2/my/ships`,
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
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'API :",
          error
        );
      }
    };

    fetchData();
  }, [token, setShipData]);

  const filteredShips = shipData
    ? shipData.filter((ship) =>
        ship.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="page">
        <section className="menu">
          <h1 className="menu__logo">
            <img src="/images/logo.png" /> Era Pilot{" "}
          </h1>
          <div className="menu__link">
            <h3 className="h3__title"> GENERAL </h3>
            <Link to={"/Accueil"} className="menu__link--dashboard">
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
            <Link to={"/vaisseaux"} className="menu__link--vaisseaux actif">
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
          <h2 className="h2__title"> Vaisseaux</h2>
          <div className="vaisseaux__link">
            <Link to={"/achat"} className="vaisseaux__link--buy">
              Acheter un nouveau vaisseau
            </Link>
            <div className="vaisseaux__link--search">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_6_487)">
                  <path
                    d="M13.125 2.5C15.1199 2.49987 17.0746 3.06138 18.7653 4.12029C20.4561 5.1792 21.8145 6.69271 22.6852 8.48762C23.5559 10.2825 23.9037 12.2863 23.6888 14.2697C23.4739 16.253 22.7049 18.1358 21.47 19.7025L26.035 24.2675C26.2626 24.5033 26.3886 24.819 26.3858 25.1468C26.3829 25.4745 26.2515 25.788 26.0197 26.0198C25.788 26.2515 25.4744 26.383 25.1467 26.3858C24.819 26.3887 24.5032 26.2627 24.2675 26.035L19.7025 21.47C18.3718 22.5187 16.8096 23.234 15.1462 23.5561C13.4829 23.8783 11.7666 23.798 10.1406 23.322C8.51458 22.846 7.02599 21.988 5.799 20.8197C4.57201 19.6513 3.64221 18.2065 3.08717 16.6057C2.53214 15.005 2.36796 13.2947 2.60834 11.6176C2.84871 9.94043 3.48667 8.34511 4.469 6.96469C5.45132 5.58427 6.74951 4.45878 8.25527 3.68212C9.76103 2.90546 11.4307 2.50014 13.125 2.5ZM13.125 5C10.9701 5 8.90344 5.85602 7.37971 7.37976C5.85597 8.90349 4.99995 10.9701 4.99995 13.125C4.99995 15.2799 5.85597 17.3465 7.37971 18.8702C8.90344 20.394 10.9701 21.25 13.125 21.25C15.2798 21.25 17.3465 20.394 18.8702 18.8702C20.3939 17.3465 21.25 15.2799 21.25 13.125C21.25 10.9701 20.3939 8.90349 18.8702 7.37976C17.3465 5.85602 15.2798 5 13.125 5ZM13.125 6.25C14.9483 6.25 16.697 6.97433 17.9863 8.26364C19.2756 9.55295 20 11.3016 20 13.125C20 14.9484 19.2756 16.697 17.9863 17.9864C16.697 19.2757 14.9483 20 13.125 20C11.3016 20 9.5529 19.2757 8.26359 17.9864C6.97428 16.697 6.24995 14.9484 6.24995 13.125C6.24995 11.3016 6.97428 9.55295 8.26359 8.26364C9.5529 6.97433 11.3016 6.25 13.125 6.25Z"
                    fill="#66CCFF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_6_487">
                    <rect width="30" height="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <input
                placeholder=" Trouver un vaisseau"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="vaisseau">
            {shipData ? (
              filteredShips.map((ship, index) => (
                <div className="vaisseau__infos" key={index}>
                  <div className="vaisseau__infos--txt">
                    <p className="symbol">{ship.symbol}</p>
                    <p className="destination">
                      <svg
                        width="38"
                        height="38"
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
                      {ship.nav.route.destination.symbol}
                      {"  "}
                      {ship.nav.route.destination.type}
                    </p>
                    <p className="engine">
                      {" "}
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 28 27"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.5274 -0.0078125L17.3339 2.09711L20.9411 9.31135L20.469 11.1998L19.0075 10.9562L19.1927 10.339L19.3592 9.78397L14 8.71229L8.64087 9.78397L8.99255 10.9562L7.53104 11.1997L7.05896 9.31135L10.666 2.09723L13.4727 -0.0078125V3.27344H11.1875L10.25 5.14844L14 7.375L17.75 5.14844L16.8125 3.27344H14.5274V-0.0078125ZM25.5613 9.90965L27.3367 10.5015L26.547 12.2127L24.7883 11.9197L25.5613 9.90965ZM2.43872 9.90965L3.21181 11.9196L1.45306 12.2127L0.66333 10.5015L2.43872 9.90965ZM14 10.0305L17.1524 13.4695L15.4828 19.0352H12.5174L10.8477 13.4695L14 10.0305ZM15.4798 10.0837L18.0159 10.591L17.5052 12.2933L15.4798 10.0837ZM12.5203 10.0838L10.4948 12.2934L9.98419 10.591L12.5203 10.0838ZM18.7019 11.9745L27.2715 13.4027L24.1836 19.5789L18.3348 13.1983L18.7019 11.9745ZM9.29812 11.9745L9.66526 13.1983L3.81644 19.5788L0.728545 13.4027L9.29812 11.9745ZM17.982 14.3745L22.2125 18.9896L17.2581 16.7876L17.982 14.3745ZM10.0181 14.3745L10.742 16.7876L5.78753 18.9896L10.0181 14.3745ZM16.9525 17.806L18.631 18.552L17.3383 23.7227H14.5274V20.0898H16.2673L16.9525 17.806ZM11.0475 17.806L11.7327 20.0898H13.4727V23.7227H10.6618L9.36907 18.552L11.0475 17.806ZM21.711 19.9208L22.7718 20.3923L22.1868 21.66L21.2266 21.1799L21.711 19.9208ZM6.28909 19.9208L6.77343 21.1799L5.81325 21.66L5.22825 20.3923L6.28909 19.9208ZM17.2227 24.7773V26.5352H15.4649V24.7773H17.2227ZM12.5352 24.7773V26.5352H10.7774V24.7773H12.5352Z"
                          fill="#66CCFF"
                        />
                      </svg>{" "}
                      {ship.engine.name}
                    </p>
                    <Link
                      className="vaisseau__infos--link"
                      to={`/vaisseau?symbol=${ship.symbol}`}
                    >
                      Voir plus de détails
                    </Link>
                  </div>

                  <div className="vaisseau__infos--contain">
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
                            height: `${
                              (ship.cargo.units / ship.cargo.capacity) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p>
                        {ship.cargo.units} <span> {ship.cargo.capacity}</span>
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
                            height: `${
                              (ship.fuel.current / ship.fuel.capacity) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p>
                        {ship.fuel.current} <span>{ship.fuel.capacity}</span>
                      </p>
                    </div>
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