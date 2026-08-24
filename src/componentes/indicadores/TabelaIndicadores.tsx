import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Indicadores } from '../../dominio/tipos';
import { formatarPercentual } from '../../utils/formatadores';

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

export default function TabelaIndicadores({
  indicadoresA,
  indicadoresB,
  indicadoresBenchmark,
  nomeCarteiraA = 'Carteira A',
  nomeCarteiraB = 'Carteira B',
  nomeBenchmark = 'CDI',
}: TabelaIndicadoresProps) {
  if (!indicadoresA && !indicadoresB && !indicadoresBenchmark) return null;

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
        <Column field="carteira" header="Carteira" />
        <Column field="rentabilidade" header="Rentabilidade" />
        <Column field="sharpe" header="Sharpe" />
        <Column field="volatilidade" header="Volatilidade" />
        <Column field="drawdown" header="Drawdown" />
      </DataTable>
    </div>
  );
}
