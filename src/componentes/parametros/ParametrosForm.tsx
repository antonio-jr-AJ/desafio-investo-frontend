import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

interface ParametrosFormProps {
  dataInicio: Date | null;
  dataFim: Date | null;
  dataMinima: string;
  dataMaxima: string;
  onDataInicioChange: (data: Date | null) => void;
  onDataFimChange: (data: Date | null) => void;
  onSimular: () => void;
  desabilitar: boolean;
  carregando: boolean;
}

export default function ParametrosForm({
  dataInicio,
  dataFim,
  dataMinima,
  dataMaxima,
  onDataInicioChange,
  onDataFimChange,
  onSimular,
  desabilitar,
  carregando,
}: ParametrosFormProps) {
  const minDate = dataMinima ? new Date(dataMinima + 'T00:00:00') : undefined;
  const maxDate = dataMaxima ? new Date(dataMaxima + 'T00:00:00') : undefined;

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '13px', fontWeight: 500 }}>Data Início</label>
        <Calendar
          value={dataInicio}
          onChange={(e) => onDataInicioChange(e.value ?? null)}
          dateFormat="dd/mm/yy"
          minDate={minDate}
          maxDate={dataFim ?? maxDate}
          placeholder="Selecione"
          showIcon
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '13px', fontWeight: 500 }}>Data Fim</label>
        <Calendar
          value={dataFim}
          onChange={(e) => onDataFimChange(e.value ?? null)}
          dateFormat="dd/mm/yy"
          minDate={dataInicio ?? minDate}
          maxDate={maxDate}
          placeholder="Selecione"
          showIcon
        />
      </div>

      <Button
        label="Simular"
        icon="pi pi-play"
        onClick={onSimular}
        disabled={desabilitar || carregando}
        loading={carregando}
      />
    </div>
  );
}
