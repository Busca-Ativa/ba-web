import axios from 'axios';

const IBGE_API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

// Cache em memória para evitar chamadas repetidas
const estadosCache: { [id: number]: string } = {};
const cidadesCache: { [cidadeId: number]: string } = {};

// Função para buscar o nome do estado pelo ID
export async function getEstadoById(id: number): Promise<string> {
  if (!estadosCache[id]) {
    const response = await axios.get(`${IBGE_API_URL}/estados/${id}`);
    estadosCache[id] = response.data.nome;
  }
  return estadosCache[id];
}

// Função para buscar o nome da cidade pelo ID (usando o endpoint direto)
export async function getCidadeById(cidadeId: number): Promise<string> {
  if (!cidadesCache[cidadeId]) {
    const response = await axios.get(`${IBGE_API_URL}/municipios/${cidadeId}`);
    cidadesCache[cidadeId] = response.data.nome;
  }
  return cidadesCache[cidadeId];
}
