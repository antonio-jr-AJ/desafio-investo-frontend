import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import type { IndiceBenchmark } from '../../dominio/tipos';

interface ParametrosFormProps {
  dataInicio: Date | null;
  dataFim: Date | null;
  dataMinima: string;
  dataMaxima: string;
  benchmarkSelecionado: string;
  indicesBenchmark: IndiceBenchmark[];
  onDataInicioChange: (data: Date | null) => void;
  onDataFimChange: (data: Date | null) => void;
  onBenchmarkChange: (codigo: string) => void;
  onSimular: () => void;
  desabilitar: boolean;
  carregando: boolean;
}

export default function ParametrosForm({
  dataInicio,
  dataFim,
  dataMinima,
  dataMaxima,
  benchmarkSelecionado,
  indicesBenchmark,
  onDataInicioChange,
  onDataFimChange,
  onBenchmarkChange,
  onSimular,
  desabilitar,
  carregando,
}: ParametrosFormProps) {
  const minDate = dataMinima ? new Date(dataMinima + 'T00:00:00') : undefined;
  const maxDate = dataMaxima ? new Date(dataMaxima + 'T00:00:00') : undefined;

  const benchmarkOpcoes = indicesBenchmark.map((indice) => ({
    label: indice.codigoAtivo,
    value: indice.codigoAtivo,
  }));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        alignItems: 'flex-end',
        width: '100%',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <FloatLabel>
          <Calendar
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => onDataInicioChange(e.value ?? null)}
            dateFormat="dd/mm/yy"
            minDate={minDate}
            maxDate={dataFim ?? maxDate}
            showIcon
            showTime={false}
            mask="99/99/9999"
            style={{ width: '100%' }}
            inputStyle={{ width: '100%' }}
          />
          <label htmlFor="dataInicio">Data Inicial</label>
        </FloatLabel>
      </div>
      <div style={{ minWidth: 0 }}>
        <FloatLabel>
          <Calendar
            id="dataFim"
            value={dataFim}
            onChange={(e) => onDataFimChange(e.value ?? null)}
            dateFormat="dd/mm/yy"
            minDate={dataInicio ?? minDate}
            maxDate={maxDate}
            showIcon
            showTime={false}
            mask="99/99/9999"
            style={{ width: '100%' }}
            inputStyle={{ width: '100%' }}
          />
          <label htmlFor="dataFim">Data Final</label>
        </FloatLabel>
      </div>
      <div style={{ minWidth: 0 }}>
        <FloatLabel>
          <Dropdown
            id="benchmark"
            value={benchmarkSelecionado}
            options={benchmarkOpcoes}
            onChange={(e) => onBenchmarkChange(e.value)}
            showClear
          />
          <label htmlFor="benchmark">Benchmark</label>
        </FloatLabel>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <label style={{ fontSize: '13px', fontWeight: 500, visibility: 'hidden' }}>
          Ação
        </label>
        <Button
          label="Simular"
          icon="pi pi-play"
          onClick={onSimular}
          disabled={desabilitar || carregando}
          loading={carregando}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
