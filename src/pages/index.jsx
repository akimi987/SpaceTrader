import React, { useState } from "react";
import axios from "axios";

export default function UserList() {
  const [token, setToken] = useState("");
  localStorage.removeItem("userId");
  localStorage.removeItem("userData");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        "https://api.spacetraders.io/v2/my/agent",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data.data;
        const id = data.accountId;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", id);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  return (
    <>
      <section className="home">
        <section className="home__left">
          <h1 className="home__left--logo">
            <img src="/images/logo.png" /> Era Pilot{" "}
          </h1>
          <h2 className="h2__title"> Bonjour, et bienvenue sur Era Pilot</h2>
          <p className="home__left--text">
            {" "}
            Bienvenue sur ma plateforme de jeu spatial ! Découvrez mon jeu vidéo
            unique utilisant l'API SpaceTraders. Pour y accéder, connectez-vous
            avec votre Token d'identification d'agent. Si vous n'avez pas encore
            d'agent, créez-le avec le bouton ci-dessous. Plongez dans l'aventure
            spatiale dès maintenant !
          </p>
          <a
            className="btn__secondaire"
            href="https://docs.spacetraders.io/quickstart/new-game"
          >
            {" "}
            Créer un compte
          </a>
        </section>
        <section className="home__right">
          <h3 className="h3__title">Identifiez-vous</h3>
          <form onSubmit={handleSubmit}>
            <input
              className="home__right--input"
              type="text"
              placeholder="votre token"
              name="username"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />{" "}
            <button className="btn__secondaire" type="submit">
              Se connecter
            </button>
          </form>
        </section>
      </section>
    </>
  );
}