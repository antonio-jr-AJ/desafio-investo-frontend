import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Indicadores } from '../../dominio/tipos';
import { formatarPercentual } from '../../utils/formatadores';

interface TabelaIndicadoresProps {
  indicadoresA: Indicadores | null;
  indicadoresB: Indicadores | null;
  nomeCarteiraA?: string;
  nomeCarteiraB?: string;
}

interface LinhaIndicador {
  indicador: string;
  carteiraA: string | number;
  carteiraB: string | number;
}

export default function TabelaIndicadores({
  indicadoresA,
  indicadoresB,
  nomeCarteiraA = 'Carteira A',
  nomeCarteiraB = 'Carteira B',
}: TabelaIndicadoresProps) {
  if (!indicadoresA && !indicadoresB) return null;

  const dados: LinhaIndicador[] = [
    {
      indicador: 'Rentabilidade Anualizada',
      carteiraA: indicadoresA ? formatarPercentual(indicadoresA.rentabilidadeAnualizada) : '-',
      carteiraB: indicadoresB ? formatarPercentual(indicadoresB.rentabilidadeAnualizada) : '-',
    },
    {
      indicador: 'Sharpe',
      carteiraA: indicadoresA ? indicadoresA.sharpe.toFixed(2) : '-',
      carteiraB: indicadoresB ? indicadoresB.sharpe.toFixed(2) : '-',
    },
    {
      indicador: 'Sortino',
      carteiraA: indicadoresA ? indicadoresA.sortino.toFixed(2) : '-',
      carteiraB: indicadoresB ? indicadoresB.sortino.toFixed(2) : '-',
    },
    {
      indicador: 'Volatilidade Anualizada',
      carteiraA: indicadoresA ? formatarPercentual(indicadoresA.volatilidadeAnualizada) : '-',
      carteiraB: indicadoresB ? formatarPercentual(indicadoresB.volatilidadeAnualizada) : '-',
    },
    {
      indicador: 'Desvio Padrão',
      carteiraA: indicadoresA ? formatarPercentual(indicadoresA.desvioPadrao) : '-',
      carteiraB: indicadoresB ? formatarPercentual(indicadoresB.desvioPadrao) : '-',
    },
    {
      indicador: 'Max Drawdown',
      carteiraA: indicadoresA ? formatarPercentual(indicadoresA.maxDrawdown) : '-',
      carteiraB: indicadoresB ? formatarPercentual(indicadoresB.maxDrawdown) : '-',
    },
    {
      indicador: 'Dias Drawdown',
      carteiraA: indicadoresA ? indicadoresA.diasDrawdown.toString() : '-',
      carteiraB: indicadoresB ? indicadoresB.diasDrawdown.toString() : '-',
    },
    {
      indicador: 'Ulcer Index',
      carteiraA: indicadoresA ? indicadoresA.ulcerIndex.toFixed(2) : '-',
      carteiraB: indicadoresB ? indicadoresB.ulcerIndex.toFixed(2) : '-',
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
        <Column field="indicador" header="Indicador" />
        <Column field="carteiraA" header={nomeCarteiraA} />
        <Column field="carteiraB" header={nomeCarteiraB} />
      </DataTable>
    </div>
  );
}
