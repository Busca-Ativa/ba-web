import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Pega a URL do arquivo .env
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Cookies.get('access_token')}`, 
  },
});

export default api;
