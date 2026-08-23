import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Resumo } from '../../dominio/tipos';
import { formatarPercentual } from '../../utils/formatadores';

interface TabelaComparacaoAnualProps {
  resumoA: Resumo | null;
  resumoB: Resumo | null;
  nomeCarteiraA?: string;
  nomeCarteiraB?: string;
}

interface LinhaAnual {
  ano: string;
  carteiraA: string;
  carteiraB: string;
}

export default function TabelaComparacaoAnual({
  resumoA,
  resumoB,
  nomeCarteiraA = 'Carteira A',
  nomeCarteiraB = 'Carteira B',
}: TabelaComparacaoAnualProps) {
  if (!resumoA && !resumoB) return null;

  const anosA = resumoA?.anos ?? [];
  const anosB = resumoB?.anos ?? [];

  const mapaAnos = new Map<string, LinhaAnual>();

  for (const ano of anosA) {
    mapaAnos.set(ano.label, {
      ano: ano.label,
      carteiraA: formatarPercentual(ano.rentabilidadePeriodo),
      carteiraB: '-',
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
      </DataTable>
    </div>
  );
}
