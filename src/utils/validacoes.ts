import type { Carteira, Ativo } from '../dominio/tipos';

export function validarSomaPesos(carteira: Carteira[]): boolean {
  const soma = calcularSomaPesos(carteira);
  return Math.abs(soma - 100) < 0.01;
}

export function calcularSomaPesos(carteira: Carteira[]): number {
  return carteira.reduce((acc, item) => acc + item.peso, 0);
}

function extrairData(data: string): string {
  return data.split('T')[0];
}

export function obterDataMinimaEfetiva(ativos: Ativo[]): string {
  if (ativos.length === 0) return '';
  return ativos.reduce((max, ativo) => {
    const d = extrairData(ativo.dataMinima);
    return d > max ? d : max;
  }, extrairData(ativos[0].dataMinima));
}

export function obterDataMaximaEfetiva(ativos: Ativo[]): string {
  if (ativos.length === 0) return '';
  return ativos.reduce((min, ativo) => {
    const d = extrairData(ativo.dataMaxima);
    return d < min ? d : min;
  }, extrairData(ativos[0].dataMaxima));
}
