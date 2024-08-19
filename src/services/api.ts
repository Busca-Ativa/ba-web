import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Pega a URL do arquivo .env
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
