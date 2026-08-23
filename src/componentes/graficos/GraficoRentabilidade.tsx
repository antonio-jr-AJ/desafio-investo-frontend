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
import { COR_CARTEIRA_A, COR_CARTEIRA_B } from '../../dominio/constantes';
import { formatarDataMesAno } from '../../utils/formatadores';

interface PontoGrafico {
  data: string;
  carteiraA?: number;
  carteiraB?: number;
}

interface GraficoRentabilidadeProps {
  rentabilidadeA: HistoricoRentabilidade[];
  rentabilidadeB: HistoricoRentabilidade[];
  nomeCarteiraA?: string;
  nomeCarteiraB?: string;
}

export default function GraficoRentabilidade({
  rentabilidadeA,
  rentabilidadeB,
  nomeCarteiraA = 'Carteira A',
  nomeCarteiraB = 'Carteira B',
}: GraficoRentabilidadeProps) {
  const dados = agruparDados(rentabilidadeA, rentabilidadeB);

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
        Rentabilidade Acumulada
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="data"
            tickFormatter={formatarDataMesAno}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
            tick={{ fontSize: 12 }}
          />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Tooltip
            formatter={(value: any) => `${(Number(value) * 100).toFixed(2)}%`}
            labelFormatter={(label: any) => formatarDataMesAno(String(label))}
          />
          <Legend />
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function agruparDados(
  rentabilidadeA: HistoricoRentabilidade[],
  rentabilidadeB: HistoricoRentabilidade[]
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

  return Array.from(mapa.values()).sort((a, b) =>
    a.data.localeCompare(b.data)
  );
}
