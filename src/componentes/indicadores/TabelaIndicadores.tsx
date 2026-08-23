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
  indicador: string;
  carteiraA: string | number;
  carteiraB: string | number;
  benchmark: string | number;
  percentualCdi?: string | number;
}

export default function TabelaIndicadores({
  indicadoresA,
  indicadoresB,
  indicadoresBenchmark,
  nomeCarteiraA = 'Carteira A',
  nomeCarteiraB = 'Carteira B',
  nomeBenchmark = 'Benchmark',
}: TabelaIndicadoresProps) {
  if (!indicadoresA && !indicadoresB && !indicadoresBenchmark) return null;

  const rentabBenchmark = indicadoresBenchmark?.rentabilidadeAnualizada ?? 0;

  function calcularPercentualCdi(rentabilidadeCarteira: number): string {
    if (!rentabBenchmark || rentabBenchmark === 0) return '-';
    return `${((rentabilidadeCarteira / rentabBenchmark) * 100).toFixed(1)}%`;
  }

  const dados: LinhaIndicador[] = [
    {
      indicador: 'Rentabilidade Anualizada',
      carteiraA: indicadoresA ? formatarPercentual(indicadoresA.rentabilidadeAnualizada) : '-',
      carteiraB: indicadoresB ? formatarPercentual(indicadoresB.rentabilidadeAnualizada) : '-',
      benchmark: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.rentabilidadeAnualizada) : '-',
      percentualCdi: indicadoresA ? calcularPercentualCdi(indicadoresA.rentabilidadeAnualizada) : '-',
    },
    {
      indicador: 'Sharpe',
      carteiraA: indicadoresA ? indicadoresA.sharpe.toFixed(2) : '-',
      carteiraB: indicadoresB ? indicadoresB.sharpe.toFixed(2) : '-',
      benchmark: indicadoresBenchmark ? indicadoresBenchmark.sharpe.toFixed(2) : '-',
    },
    {
      indicador: 'Sortino',
      carteiraA: indicadoresA ? indicadoresA.sortino.toFixed(2) : '-',
      carteiraB: indicadoresB ? indicadoresB.sortino.toFixed(2) : '-',
      benchmark: indicadoresBenchmark ? indicadoresBenchmark.sortino.toFixed(2) : '-',
    },
    {
      indicador: 'Volatilidade Anualizada',
      carteiraA: indicadoresA ? formatarPercentual(indicadoresA.volatilidadeAnualizada) : '-',
      carteiraB: indicadoresB ? formatarPercentual(indicadoresB.volatilidadeAnualizada) : '-',
      benchmark: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.volatilidadeAnualizada) : '-',
    },
    {
      indicador: 'Desvio Padrão',
      carteiraA: indicadoresA ? formatarPercentual(indicadoresA.desvioPadrao) : '-',
      carteiraB: indicadoresB ? formatarPercentual(indicadoresB.desvioPadrao) : '-',
      benchmark: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.desvioPadrao) : '-',
    },
    {
      indicador: 'Max Drawdown',
      carteiraA: indicadoresA ? formatarPercentual(indicadoresA.maxDrawdown) : '-',
      carteiraB: indicadoresB ? formatarPercentual(indicadoresB.maxDrawdown) : '-',
      benchmark: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.maxDrawdown) : '-',
    },
    {
      indicador: 'Dias Drawdown',
      carteiraA: indicadoresA ? indicadoresA.diasDrawdown.toString() : '-',
      carteiraB: indicadoresB ? indicadoresB.diasDrawdown.toString() : '-',
      benchmark: indicadoresBenchmark ? indicadoresBenchmark.diasDrawdown.toString() : '-',
    },
    {
      indicador: 'Ulcer Index',
      carteiraA: indicadoresA ? indicadoresA.ulcerIndex.toFixed(2) : '-',
      carteiraB: indicadoresB ? indicadoresB.ulcerIndex.toFixed(2) : '-',
      benchmark: indicadoresBenchmark ? indicadoresBenchmark.ulcerIndex.toFixed(2) : '-',
    },
    {
      indicador: '% CDI',
      carteiraA: indicadoresA ? calcularPercentualCdi(indicadoresA.rentabilidadeAnualizada) : '-',
      carteiraB: indicadoresB ? calcularPercentualCdi(indicadoresB.rentabilidadeAnualizada) : '-',
      benchmark: '-',
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
        <Column field="benchmark" header={nomeBenchmark} />
        <Column field="percentualCdi" header="% CDI" />
      </DataTable>
    </div>
  );
}
