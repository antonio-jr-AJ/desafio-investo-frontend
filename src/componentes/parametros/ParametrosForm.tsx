import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { BENCHMARKS_DISPONIVEIS } from '../../dominio/constantes';

interface ParametrosFormProps {
  dataInicio: Date | null;
  dataFim: Date | null;
  dataMinima: string;
  dataMaxima: string;
  benchmarkSelecionado: string;
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
  onDataInicioChange,
  onDataFimChange,
  onBenchmarkChange,
  onSimular,
  desabilitar,
  carregando,
}: ParametrosFormProps) {
  const minDate = dataMinima ? new Date(dataMinima + 'T00:00:00') : undefined;
  const maxDate = dataMaxima ? new Date(dataMaxima + 'T00:00:00') : undefined;

  const benchmarkOpcoes = BENCHMARKS_DISPONIVEIS.map((b) => ({
    label: b.nome,
    value: b.codigo,
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <label style={{ fontSize: '13px', fontWeight: 500 }}>Data Inicial</label>
        <Calendar
          value={dataInicio}
          onChange={(e) => onDataInicioChange(e.value ?? null)}
          dateFormat="dd/mm/yy"
          minDate={minDate}
          maxDate={dataFim ?? maxDate}
          placeholder="Selecione"
          showIcon
          showTime={false}
          mask="99/99/9999"
          style={{ width: '100%' }}
          inputStyle={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <label style={{ fontSize: '13px', fontWeight: 500 }}>Data Final</label>
        <Calendar
          value={dataFim}
          onChange={(e) => onDataFimChange(e.value ?? null)}
          dateFormat="dd/mm/yy"
          minDate={dataInicio ?? minDate}
          maxDate={maxDate}
          placeholder="Selecione"
          showIcon
          showTime={false}
          mask="99/99/9999"
          style={{ width: '100%' }}
          inputStyle={{ width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <label style={{ fontSize: '13px', fontWeight: 500 }}>Benchmark</label>
        <Dropdown
          value={benchmarkSelecionado}
          options={benchmarkOpcoes}
          onChange={(e) => onBenchmarkChange(e.value)}
          placeholder="Selecione"
          showClear
        />
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
