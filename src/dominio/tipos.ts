export interface Ativo {
  codigoAtivo: string;
  referencia: string;
  nome: string;
  descricao: string;
  tipo: string;
  subtipo: string;
  categoria: string;
  etiqueta: string;
  linkMarketing: string;
  dataMinima: string;
  dataMaxima: string;
  datasDisponiveis: string;
}

export interface AtivosResponse {
  ativos: Ativo[];
}

export interface Carteira {
  ativo: Ativo | null;
  peso: number;
}

export interface Indicadores {
  sharpe: number;
  sortino: number;
  rentabilidadeAnualizada: number;
  desvioPadrao: number;
  taxaBaseAnualizada: number;
  rentabilidadePeriodo: number;
  maxDrawdown: number;
  diasDrawdown: number;
  ulcerIndex: number;
  volatilidadeAnualizada: number;
}

export interface PeriodoResumo {
  label: string;
  dias: number;
  rentabilidadePeriodo: number;
}

export interface Resumo {
  periodos: PeriodoResumo[];
  anos: PeriodoResumo[];
  rentabiliadeMelhorAno: number;
  melhorAno: string;
  rentabilidadePiorAno: number;
  piorAno: string;
}

export interface PontoRentabilidade {
  data: string;
  valor: number;
  fator: number;
  financeiro: number;
  acumulado: number;
  aporte: number;
}

export interface HistoricoRentabilidade {
  etiqueta: string;
  label: string;
  rentabilidade: PontoRentabilidade[];
}

export interface RentabilidadeCarteira {
  historico: HistoricoRentabilidade[];
}

export interface IndiceBenchmark {
  codigoAtivo: string;
  referencia: string;
  tipo: string;
  dataMinima: string;
  dataMaxima: string;
  datasDisponiveis: string;
}

export interface IndicesResponse {
  ativos: IndiceBenchmark[];
}

export interface ErroApi {
  message: string;
  error?: string;
  statusCode: number;
}
