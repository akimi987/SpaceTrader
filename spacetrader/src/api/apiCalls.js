import axios from "axios";
import Url from "./apiConf";

export const loginUser = async (token) => {
  try {
    const response = await axios.get(`${Url}/v2/my/agent`, {
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

