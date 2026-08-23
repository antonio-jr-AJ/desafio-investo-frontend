import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import type { Ativo, Carteira } from '../../dominio/tipos';

interface LinhaAtivoProps {
  carteira: Carteira[];
  index: number;
  ativos: Ativo[];
  ativosSelecionados: string[];
  onAtivoChange: (index: number, ativo: Ativo | null) => void;
  onPesoChange: (index: number, peso: number) => void;
  onRemover: (index: number) => void;
  desabilitarRemover: boolean;
}

export default function LinhaAtivo({
  carteira,
  index,
  ativos,
  ativosSelecionados,
  onAtivoChange,
  onPesoChange,
  onRemover,
  desabilitarRemover,
}: LinhaAtivoProps) {
  const item = carteira[index];

  const opcoesAtivos = ativos
    .filter(
      (a) =>
        !ativosSelecionados.includes(a.codigoAtivo) ||
        a.codigoAtivo === item.ativo?.codigoAtivo
    )
    .map((a) => ({
      label: `${a.codigoAtivo} - ${a.etiqueta}`,
      value: a,
    }));

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Dropdown
        value={item.ativo}
        options={opcoesAtivos}
        onChange={(e) => onAtivoChange(index, e.value)}
        placeholder="Selecione um ativo"
        style={{ flex: 1 }}
        filter
        filterBy="label"
      />
      <InputNumber
        value={item.peso}
        onValueChange={(e) => onPesoChange(index, e.value ?? 0)}
        suffix="%"
        min={0}
        max={100}
        mode="decimal"
        minFractionDigits={0}
        maxFractionDigits={2}
        style={{ width: '100px' }}
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        text
        rounded
        onClick={() => onRemover(index)}
        disabled={desabilitarRemover}
      />
    </div>
  );
}
