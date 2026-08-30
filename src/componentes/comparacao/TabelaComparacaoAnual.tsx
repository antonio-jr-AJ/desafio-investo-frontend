import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Resumo } from '../../dominio/tipos';
import { formatarPercentual } from '../../utils/formatadores';
import { COR_CARTEIRA_A, COR_CARTEIRA_B, COR_BENCHMARK } from '../../dominio/constantes';

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

function valorEhNegativo(texto: string): boolean {
  if (texto === '-') return false;
  const numero = parseFloat(texto.replace('%', '').replace(',', '.'));
  return !isNaN(numero) && numero < 0;
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

  const headerStyle = {
    backgroundColor: '#1F5484',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '14px',
    padding: '12px 16px',
    textAlign: 'center' as const,
  };

  const cellStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
  };

  return (
    <div
      style={{
        border: '1px solid #1F5484',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#1F5484' }}>
        Comparativo
      </h3>
      <DataTable
        value={dados}
        size="small"
        emptyMessage="Sem dados disponíveis"
        tableStyle={{ minWidth: '100%', borderCollapse: 'collapse' }}
      >
        <Column
          field="ano"
          header={<span style={headerStyle}>Ano</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: '#1F5484', fontWeight: 600, textAlign: 'center' }}>
              {row.ano}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
        <Column
          field="carteiraA"
          header={<span style={headerStyle}>{nomeCarteiraA}</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: valorEhNegativo(row.carteiraA) ? '#ef4444' : undefined, textAlign: 'right' }}>
              {row.carteiraA}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
        <Column
          field="carteiraB"
          header={<span style={headerStyle}>{nomeCarteiraB}</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: valorEhNegativo(row.carteiraB) ? '#ef4444' : undefined, textAlign: 'right' }}>
              {row.carteiraB}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
        <Column
          field="benchmark"
          header={<span style={headerStyle}>{nomeBenchmark}</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: valorEhNegativo(row.benchmark) ? '#ef4444' : undefined, textAlign: 'right' }}>
              {row.benchmark}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
      </DataTable>
    </div>
  );
}
