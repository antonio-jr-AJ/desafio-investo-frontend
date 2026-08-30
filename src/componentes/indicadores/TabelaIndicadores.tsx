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
  nomeBenchmark: string;
}

interface LinhaIndicador {
  carteira: string;
  rentabilidade: string;
  sharpe: string;
  volatilidade: string;
  drawdown: string;
  percentualCDI: string;
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
  nomeBenchmark,
}: TabelaIndicadoresProps) {
  if (!indicadoresA && !indicadoresB && !indicadoresBenchmark) return null;

  const cores: Record<string, string> = {
    [nomeCarteiraA]: COR_CARTEIRA_A,
    [nomeCarteiraB]: COR_CARTEIRA_B,
    [nomeBenchmark]: COR_BENCHMARK,
  };

  function calcularPercentualCDI(rentabilidadeCarteira: number | undefined): string {
    if (!indicadoresBenchmark || rentabilidadeCarteira === undefined) return '-';
    const cdi = indicadoresBenchmark.rentabilidadeAnualizada;
    if (cdi === 0) return '-';
    return (rentabilidadeCarteira / cdi * 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + '%';
  }

  const dados: LinhaIndicador[] = [
    {
      carteira: nomeCarteiraA,
      rentabilidade: indicadoresA ? formatarPercentual(indicadoresA.rentabilidadeAnualizada) : '-',
      sharpe: indicadoresA ? indicadoresA.sharpe.toFixed(2) : '-',
      volatilidade: indicadoresA ? formatarPercentual(indicadoresA.volatilidadeAnualizada) : '-',
      drawdown: indicadoresA ? formatarPercentual(indicadoresA.maxDrawdown) : '-',
      percentualCDI: calcularPercentualCDI(indicadoresA?.rentabilidadeAnualizada),
    },
    {
      carteira: nomeCarteiraB,
      rentabilidade: indicadoresB ? formatarPercentual(indicadoresB.rentabilidadeAnualizada) : '-',
      sharpe: indicadoresB ? indicadoresB.sharpe.toFixed(2) : '-',
      volatilidade: indicadoresB ? formatarPercentual(indicadoresB.volatilidadeAnualizada) : '-',
      drawdown: indicadoresB ? formatarPercentual(indicadoresB.maxDrawdown) : '-',
      percentualCDI: calcularPercentualCDI(indicadoresB?.rentabilidadeAnualizada),
    },
    {
      carteira: nomeBenchmark,
      rentabilidade: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.rentabilidadeAnualizada) : '-',
      sharpe: indicadoresBenchmark ? indicadoresBenchmark.sharpe.toFixed(2) : '-',
      volatilidade: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.volatilidadeAnualizada) : '-',
      drawdown: indicadoresBenchmark ? formatarPercentual(indicadoresBenchmark.maxDrawdown) : '-',
      percentualCDI: '100%',
    },
  ];

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
        Indicadores
      </h3>
      <DataTable
        value={dados}
        size="small"
        emptyMessage="Sem dados disponíveis"
        tableStyle={{ minWidth: '100%', borderCollapse: 'collapse' }}
      >
        <Column
          field="carteira"
          header={<span style={headerStyle}>Carteira</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: '#1F5484', fontWeight: 600, textAlign: 'left' }}>
              {row.carteira}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
        <Column
          field="rentabilidade"
          header={<span style={headerStyle}>Rentabilidade</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: valorEhNegativo(row.rentabilidade) ? '#ef4444' : undefined, textAlign: 'right' }}>
              {row.rentabilidade}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
        <Column
          field="sharpe"
          header={<span style={headerStyle}>Sharpe</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: valorEhNegativo(row.sharpe) ? '#ef4444' : undefined, textAlign: 'right' }}>
              {row.sharpe}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
        <Column
          field="volatilidade"
          header={<span style={headerStyle}>Volatilidade</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: valorEhNegativo(row.volatilidade) ? '#ef4444' : undefined, textAlign: 'right' }}>
              {row.volatilidade}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
        <Column
          field="drawdown"
          header={<span style={headerStyle}>Drawdown</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: valorEhNegativo(row.drawdown) ? '#ef4444' : undefined, textAlign: 'right' }}>
              {row.drawdown}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
        <Column
          field="percentualCDI"
          header={<span style={headerStyle}>% CDI</span>}
          body={(row) => (
            <span style={{ ...cellStyle, color: valorEhNegativo(row.percentualCDI) ? '#ef4444' : undefined, fontWeight: 600, textAlign: 'right' }}>
              {row.percentualCDI}
            </span>
          )}
          headerStyle={headerStyle}
          bodyStyle={cellStyle}
        />
      </DataTable>
    </div>
  );
}
