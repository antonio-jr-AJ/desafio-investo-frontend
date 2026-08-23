import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Resumo } from '../../dominio/tipos';
import { formatarPercentual } from '../../utils/formatadores';

interface TabelaComparacaoAnualProps {
  resumoA: Resumo | null;
  resumoB: Resumo | null;
  resumoBenchmark: Resumo | null;
  nomeCarteiraA?: string;
  nomeCarteiraB?: string;
  nomeBenchmark?: string;
}

interface LinhaAnual {
  ano: string;
  carteiraA: string;
  carteiraB: string;
  benchmark: string;
}

export default function TabelaComparacaoAnual({
  resumoA,
  resumoB,
  resumoBenchmark,
  nomeCarteiraA = 'Carteira A',
  nomeCarteiraB = 'Carteira B',
  nomeBenchmark = 'Benchmark',
}: TabelaComparacaoAnualProps) {
  if (!resumoA && !resumoB && !resumoBenchmark) return null;

  const anosA = resumoA?.anos ?? [];
  const anosB = resumoB?.anos ?? [];
  const anosBenchmark = resumoBenchmark?.anos ?? [];

  const mapaAnos = new Map<string, LinhaAnual>();

  for (const ano of anosA) {
    mapaAnos.set(ano.label, {
      ano: ano.label,
      carteiraA: formatarPercentual(ano.rentabilidadePeriodo),
      carteiraB: '-',
      benchmark: '-',
    });
  }

  for (const ano of anosB) {
    const existente = mapaAnos.get(ano.label);
    if (existente) {
      existente.carteiraB = formatarPercentual(ano.rentabilidadePeriodo);
    } else {
      mapaAnos.set(ano.label, {
        ano: ano.label,
        carteiraA: '-',
        carteiraB: formatarPercentual(ano.rentabilidadePeriodo),
        benchmark: '-',
      });
    }
  }

  for (const ano of anosBenchmark) {
    const existente = mapaAnos.get(ano.label);
    if (existente) {
      existente.benchmark = formatarPercentual(ano.rentabilidadePeriodo);
    } else {
      mapaAnos.set(ano.label, {
        ano: ano.label,
        carteiraA: '-',
        carteiraB: '-',
        benchmark: formatarPercentual(ano.rentabilidadePeriodo),
      });
    }
  }

  const dados = Array.from(mapaAnos.values()).sort((a, b) =>
    b.ano.localeCompare(a.ano)
  );

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
        Comparativo Anual
      </h3>
      <DataTable value={dados} size="small" stripedRows>
        <Column field="ano" header="Ano" />
        <Column field="carteiraA" header={nomeCarteiraA} />
        <Column field="carteiraB" header={nomeCarteiraB} />
        <Column field="benchmark" header={nomeBenchmark} />
      </DataTable>
    </div>
  );
}
