import axios from 'axios';

const IBGE_API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

// Cache em memória para evitar chamadas repetidas
const estadosCache: { [id: number]: string } = {};
const cidadesCache: { [estadoId: number]: { [cidadeId: number]: string } } = {};

// Função para buscar o nome do estado pelo ID
export async function getEstadoById(id: number): Promise<string> {
  if (!estadosCache[id]) {
    const response = await axios.get(`${IBGE_API_URL}/estados/${id}`);
    estadosCache[id] = response.data.nome;
  }
  return estadosCache[id];
}

// Função para buscar o nome da cidade pelo ID
export async function getCidadeById(estadoId: number, cidadeId: number): Promise<string> {
  if (!cidadesCache[estadoId]) {
    cidadesCache[estadoId] = {};
  }
  if (!cidadesCache[estadoId][cidadeId]) {
    const response = await axios.get(`${IBGE_API_URL}/estados/${estadoId}/municipios/`);
    cidadesCache[estadoId][cidadeId] = response.data.filter( (municipio: any) => {if (municipio.id == cidadeId) return true} )[0]?.nome;
  }
  return cidadesCache[estadoId][cidadeId];
}
