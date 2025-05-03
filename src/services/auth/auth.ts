import api from "../api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { GetServerSidePropsContext } from "next";

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.data) {
        Cookies.set("access_token", response.data.data.access_token, {
          path: "/",
          expires: 30, // 30 days
        });
        Cookies.set("refresh_token", response.data.data.refresh_token, {
          path: "/",
          expires: 30, // 30 days
        });
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "Erro ao fazer login:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getUser() {
    // Retrieve the access_token from cookies
    const token = Cookies.get("access_token");

    // Check if the token is defined and is a string
    if (!token || typeof token !== "string") {
      return {};
    }

    // Decode the token and extract the subject (sub)
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub; // Ensure that 'sub' exists in the decoded token
    } catch (error) {
      console.error("Error decoding token:", error);
      throw new Error("Invalid token: cannot decode");
    }
  },

  async register(userData: {
    name: string;
    last_name: string;
    email: string;
    code: string;
    password: string;
  }) {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      console.error(
        "Erro ao registrar usuário:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async refreshToken() {
    try {
      const refreshToken = Cookies.get("refresh_token");

      if (!refreshToken) throw new Error("Token de refresh não encontrado.");

      const response = await api.post("/auth/refresh", {
        access_token: refreshToken,
      });

      if (response.data.data) {
        // Atualizar os tokens nos cookies
        Cookies.set("access_token", response.data.data.access_token, {
          path: "/",
          expires: 30, // 30 days
        });
        Cookies.set("refresh_token", response.data.data.refresh_token, {
          path: "/",
          expires: 30, // 30 days
        });
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "Erro ao atualizar o token:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  logout() {
    // Remover os tokens usando js-cookie
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
  },
};
