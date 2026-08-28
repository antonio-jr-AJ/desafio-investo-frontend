import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { HistoricoRentabilidade } from '../../dominio/tipos';
import { COR_CARTEIRA_A, COR_CARTEIRA_B, COR_BENCHMARK } from '../../dominio/constantes';
import { formatarDataMesAno, formatarDataDiaMes } from '../../utils/formatadores';

interface PontoGrafico {
  data: string;
  carteiraA?: number;
  carteiraB?: number;
  benchmark?: number;
}

interface GraficoRentabilidadeProps {
  rentabilidadeA: HistoricoRentabilidade[];
  rentabilidadeB: HistoricoRentabilidade[];
  rentabilidadeBenchmark: HistoricoRentabilidade[];
  nomeCarteiraA?: string;
  nomeCarteiraB?: string;
  nomeBenchmark: string;
}

export default function GraficoRentabilidade({
  rentabilidadeA,
  rentabilidadeB,
  rentabilidadeBenchmark,
  nomeCarteiraA = 'Carteira A',
  nomeCarteiraB = 'Carteira B',
  nomeBenchmark,
}: GraficoRentabilidadeProps) {
  const dados = agruparDados(rentabilidadeA, rentabilidadeB, rentabilidadeBenchmark);

  const diffMeses = calcularDiffMeses(dados);
  const usarMesAno = diffMeses > 12;
  const formatadorX = (label: string) => usarMesAno ? formatarDataMesAno(label) : formatarDataDiaMes(label);

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
        Rentabilidade (%)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="data"
            tickFormatter={formatadorX}
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis
            tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
            tick={{ fontSize: 12 }}
          />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Tooltip
            formatter={(value: any) => `${(Number(value) * 100).toFixed(2)}%`}
            labelFormatter={(label: any) => formatadorX(String(label))}
          />
          <Legend content={<LegendaCustomizada nomeBenchmark={nomeBenchmark} />} />
          <Line
            type="monotone"
            dataKey="carteiraA"
            name={nomeCarteiraA}
            stroke={COR_CARTEIRA_A}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="carteiraB"
            name={nomeCarteiraB}
            stroke={COR_CARTEIRA_B}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="benchmark"
            name={nomeBenchmark}
            stroke={COR_BENCHMARK}
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function calcularDiffMeses(dados: PontoGrafico[]): number {
  if (dados.length < 2) return 0;
  const primeira = new Date(dados[0].data.split('T')[0]);
  const ultima = new Date(dados[dados.length - 1].data.split('T')[0]);
  const diffAnos = ultima.getFullYear() - primeira.getFullYear();
  const diffMeses = ultima.getMonth() - primeira.getMonth();
  return diffAnos * 12 + diffMeses;
}

function agruparDados(
  rentabilidadeA: HistoricoRentabilidade[],
  rentabilidadeB: HistoricoRentabilidade[],
  rentabilidadeBenchmark: HistoricoRentabilidade[]
): PontoGrafico[] {
  const mapa = new Map<string, PontoGrafico>();

  if (rentabilidadeA.length > 0) {
    for (const ponto of rentabilidadeA[0].rentabilidade) {
      mapa.set(ponto.data, { data: ponto.data, carteiraA: ponto.acumulado });
    }
  }

  if (rentabilidadeB.length > 0) {
    for (const ponto of rentabilidadeB[0].rentabilidade) {
      const existente = mapa.get(ponto.data);
      if (existente) {
        existente.carteiraB = ponto.acumulado;
      } else {
        mapa.set(ponto.data, { data: ponto.data, carteiraB: ponto.acumulado });
      }
    }
  }

  if (rentabilidadeBenchmark.length > 0) {
    for (const ponto of rentabilidadeBenchmark[0].rentabilidade) {
      const existente = mapa.get(ponto.data);
      if (existente) {
        existente.benchmark = ponto.acumulado;
      } else {
        mapa.set(ponto.data, { data: ponto.data, benchmark: ponto.acumulado });
      }
    }
  }

  return Array.from(mapa.values()).sort((a, b) =>
    a.data.localeCompare(b.data)
  );
}

function LegendaCustomizada({ nomeBenchmark }: { nomeBenchmark: string }) {
  const itens = [
    { nome: 'Carteira A', cor: COR_CARTEIRA_A, tracejada: false },
    { nome: 'Carteira B', cor: COR_CARTEIRA_B, tracejada: false },
    { nome: nomeBenchmark, cor: COR_BENCHMARK, tracejada: true },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', paddingTop: '8px' }}>
      {itens.map((item) => (
        <div key={item.nome} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '16px',
              height: '3px',
              backgroundColor: item.cor,
              display: 'inline-block',
              borderTop: item.tracejada ? '2px dashed' : 'none',
            }}
          />
          <span style={{ fontSize: '12px' }}>{item.nome}</span>
        </div>
      ))}
    </div>
  );
}
