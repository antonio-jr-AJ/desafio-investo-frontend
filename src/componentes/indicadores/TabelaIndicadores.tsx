import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Indicadores } from '../../dominio/tipos';
import { formatarPercentual } from '../../utils/formatadores';
import { COR_CARTEIRA_A, COR_CARTEIRA_B, COR_BENCHMARK } from '../../dominio/constantes';

interface TabelaIndicadoresProps {
  indicadoresA: Indicadores | null;
  indicadoresB: Indicadores | null;
  indicadoresBenchmark: Indicadores | null;
  nomeCarteiraA?: string;
  nomeCarteiraB?: string;
  nomeBenchmark?: string;
}

interface LinhaIndicador {
  carteira: string;
  rentabilidade: string;
  sharpe: string;
  volatilidade: string;
  drawdown: string;
}

function valorEhNegativo(texto: string): boolean {
  if (texto === '-') return false;
  const numero = parseFloat(texto.replace('%', '').replace(',', '.'));
  return !isNaN(numero) && numero < 0;
}

export default function TabelaIndicadores({
  indicadoresA,
  indicadoresB,
  indicadoresBenchmark,
  nomeCarteiraA = 'Carteira A',
  nomeCarteiraB = 'Carteira B',
  nomeBenchmark = 'CDI',
}: TabelaIndicadoresProps) {
  if (!indicadoresA && !indicadoresB && !indicadoresBenchmark) return null;

  const cores: Record<string, string> = {
    [nomeCarteiraA]: COR_CARTEIRA_A,
    [nomeCarteiraB]: COR_CARTEIRA_B,
    [nomeBenchmark]: COR_BENCHMARK,
  };

  const dados: LinhaIndicador[] = [
    {
      carteira: nomeCarteiraA,
      rentabilidade: indicadoresA ? formatarPercentual(indicadoresA.rentabilidadeAnualizada) : '-',
      sharpe: indicadoresA ? indicadoresA.sharpe.toFixed(2) : '-',
      volatilidade: indicadoresA ? formatarPercentual(indicadoresA.volatilidadeAnualizada) : '-',
      drawdown: indicadoresA ? formatarPercentual(indicadoresA.maxDrawdown) : '-',
    },
    {
      carteira: nomeCarteiraB,
      rentabilidade: indicadoresB ? formatarPercentual(indicadoresB.rentabilidadeAnualizada) : '-',
      sharpe: indicadoresB ? indicadoresB.sharpe.toFixed(2) : '-',
      volatilidade: indicadoresB ? formatarPercentual(indicadoresB.volatilidadeAnualizada) : '-',
      drawdown: indicadoresB ? formatarPercentual(indicadoresB.maxDrawdown) : '-',
    },
    {
      carteira: nomeBenchmark,
      rentabilidade: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.rentabilidadeAnualizada) : '-',
      sharpe: indicadoresBenchmark ? indicadoresBenchmark.sharpe.toFixed(2) : '-',
      volatilidade: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.volatilidadeAnualizada) : '-',
      drawdown: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.maxDrawdown) : '-',
    },
  ];

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
        Indicadores
      </h3>
      <DataTable value={dados} size="small" stripedRows>
        <Column field="carteira" header="Carteira"
          body={(row) => (
            <span style={{ color: cores[row.carteira], fontWeight: 600 }}>
              {row.carteira}
            </span>
          )} />
        <Column field="rentabilidade" header="Rentabilidade"
          body={(row) => (
            <span style={{ color: valorEhNegativo(row.rentabilidade) ? '#ef4444' : undefined }}>
              {row.rentabilidade}
            </span>
          )} />
        <Column field="sharpe" header="Sharpe"
          body={(row) => (
            <span style={{ color: valorEhNegativo(row.sharpe) ? '#ef4444' : undefined }}>
              {row.sharpe}
            </span>
          )} />
        <Column field="volatilidade" header="Volatilidade"
          body={(row) => (
            <span style={{ color: valorEhNegativo(row.volatilidade) ? '#ef4444' : undefined }}>
              {row.volatilidade}
            </span>
          )} />
        <Column field="drawdown" header="Drawdown"
          body={(row) => (
            <span style={{ color: valorEhNegativo(row.drawdown) ? '#ef4444' : undefined }}>
              {row.drawdown}
            </span>
          )} />
      </DataTable>
    </div>
  );
}
