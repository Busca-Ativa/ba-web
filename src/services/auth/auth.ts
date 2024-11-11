import api from '../api';
import { destroyCookie } from 'nookies';
import nookies  from 'nookies';
import { jwtDecode } from 'jwt-decode'
import { GetServerSidePropsContext } from 'next';

export const AuthService = {
  async login(email: string, password: string, ctx?: GetServerSidePropsContext) {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.data) {
        nookies.set(ctx, 'access_token', response.data.data.access_token, {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        });
        nookies.set(ctx, 'refresh_token', response.data.data.refresh_token, {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        });
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.response?.data || error.message);
      throw error;
    }
  },

  getUser(ctx?: GetServerSidePropsContext) {
    // Retrieve the access_token from cookies
    const cookies = nookies.get(ctx);
    const token = cookies.access_token;

    // Check if the token is defined and is a string
    if (!token || typeof token !== 'string') {
      return {}
    }

    // Decode the token and extract the subject (sub)
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub; // Ensure that 'sub' exists in the decoded token
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token: cannot decode');
    }
  },

  async register(userData: {
    name: string;
    last_name: string;
    email: string;
    code: string;
    password: string;
  }, ctx?: GetServerSidePropsContext) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error.response?.data || error.message);
      throw error;
    }
  },

  async refreshToken(ctx?: GetServerSidePropsContext) {
    try {
      const cookies = nookies.get(ctx);
      const refreshToken = cookies.refresh_token;

      if (!refreshToken) throw new Error('Token de refresh não encontrado.');

      const response = await api.post('/auth/refresh', { access_token: refreshToken });

      if (response.data.data) {
        // Atualizar os tokens nos cookies
        nookies.set(ctx, 'access_token', response.data.data.access_token, {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        });
        nookies.set(ctx, 'refresh_token', response.data.data.refresh_token, {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        });
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar o token:', error.response?.data || error.message);
      throw error;
    }
  },

  logout(ctx?: GetServerSidePropsContext) {
    // Remover os tokens dos cookies
    nookies.destroy(ctx, 'access_token');
    nookies.destroy(ctx, 'refresh_token');
    // ClientSide
    destroyCookie(null, 'access_token', {path:'/'});
    destroyCookie(null, 'refresh_token', {path:'/'});
  }
};
