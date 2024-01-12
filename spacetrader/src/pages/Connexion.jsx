import React, { useState } from "react";
import { loginUser } from "../api/apiCalls";
import '../assets/styles/connexion.css'

export default function Connexion() {
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(token);

      if (result.success) {
        const { data } = result;
        window.location.href = "/Dashboard";
      } else {
        console.error("Login failed:", result.error);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  return (
    <>
    <section className="go">
    <section className="go__left">
    <h1 className="go__left--logo">
      Galactic Odyssey
    </h1>
    <h2 className="h2__title">Salut !! Bienvenue sur Galactic Odyssey</h2>
    <p className="go__left--text">
      Bienvenue sur l'incroyable plateforme de jeu spatial !
      Explorez les confins de l'univers avec un jeu vidéo unique, alimenté
      par l'API SpaceTraders. Pour embarquer dans cette aventure intergalactique,
      connectez-vous en utilisant votre Token d'identification d'agent. 
      🚀 Lancez-vous dans des missions captivantes, commercez avec des civilisations
      extraterrestres, et construisez votre propre empire spatial. Chaque décision 
      compte dans cette odyssée interstellaire passionnante. 🌌
      N'attendez plus, plongez dans l'inconnu et découvrez les mystères de l'espace ! 
      Si vous êtes nouveau ici, créez votre propre agent en un clin d'œil avec le bouton ci-dessous.
      <br />
      Et 
      Que l'aventure commence ! ✨
    </p>
    <a
      className="btn__go"
      href="https://docs.spacetraders.io/quickstart/new-game"
    >
      S'inscrire
    </a>
    </section>
    <section className="go__right">
    <h3 className="h3__title">Identifiez-vous</h3>
    <form onSubmit={handleSubmit}>
      <input
        className="go__right--input"
        type="text"
        placeholder="votre token"
        name="username"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button className="btn__go" type="submit">
        Se connecter
      </button>
    </form>
  </section>
</section>

    </>
  );
}
