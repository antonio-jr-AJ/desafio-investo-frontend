import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../dominio/constantes';

const cliente = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

export default cliente;
