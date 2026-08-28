import cliente from './cliente';
import type {
  AtivosResponse,
  Indicadores,
  IndicesResponse,
  Resumo,
  RentabilidadeCarteira,
} from '../dominio/tipos';

export async function buscarAtivos(): Promise<AtivosResponse> {
  const { data } = await cliente.get('/api/simulacao/ativos');
  return data;
}

export async function buscarIndicadores(
  codigos: string[],
  pesos: number[]
): Promise<Indicadores> {
  const { data } = await cliente.get('/api/simulacao/indicadores', {
    params: {
      codigoAtivos: codigos.join(','),
      participacaoAtivos: pesos.map((p) => p / 100).join(','),
    },
  });
  return data;
}

export async function buscarResumo(
  codigos: string[],
  pesos: number[]
): Promise<Resumo> {
  const { data } = await cliente.get('/api/simulacao/resumo', {
    params: {
      codigoAtivos: codigos.join(','),
      participacaoAtivos: pesos.map((p) => p / 100).join(','),
    },
  });
  return data;
}

export async function buscarRentabilidade(
  codigos: string[],
  pesos: number[],
  dataInicio: string,
  dataFim: string
): Promise<RentabilidadeCarteira> {
  const { data } = await cliente.get('/api/simulacao/rentabilidade-carteira', {
    params: {
      codigoAtivos: codigos.join(','),
      participacaoAtivos: pesos.map((p) => p / 100).join(','),
      dataInicio,
      dataFim,
    },
  });
  return data;
}

export async function buscarIndicesBenchmark(): Promise<IndicesResponse> {
  const { data } = await cliente.get('/api/comparacao/ativos', {
    params: { tipo: 'INDICE' },
  });
  return data;
}
