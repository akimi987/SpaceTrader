import axios from "axios";
import Url from "./apiConf";

export const loginUser = async (token) => {
  try {
    const response = await axios.get(`${Url}/my/agent`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = response.data.data;
      const id = data.accountId;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);

      return { success: true, data };
    }
  } catch (error) {
    console.error("Erreur de token (peut-être invalide) :", error);
    return { success: false, error };
  }
};

export const fetchAgentData = async (token) => {
  try {
    const response = await axios.get(`${Url}/agent`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données de l'agent :", error);
    throw error;
  }
};

export const fetchShipData = async (token) => {
  try {
    const response = await axios.get(`${Url}/ships`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données de l'API :", error);
    throw error;
  }
};
