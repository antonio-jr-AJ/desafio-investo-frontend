import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import type { Ativo, Carteira } from '../../dominio/tipos';
import { COR_VERMELHO, COR_PRETO } from '../../dominio/constantes';

interface LinhaAtivoProps {
  carteira: Carteira[];
  index: number;
  ativos: Ativo[];
  ativosSelecionados: string[];
  onAtivoChange: (index: number, ativo: Ativo | undefined) => void;
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
    <div style={{ display: 'grid', gridTemplateColumns: '60% 25% 15%', gap: '12px', alignItems: 'center' }}>
      <div style={{ minWidth: 0 }}>
        <FloatLabel>
          <Dropdown
            id={`ativo-${index}`}
            value={item.ativo}
            options={opcoesAtivos}
            onChange={(e) => onAtivoChange(index, e.value ?? undefined)}
            filter
            filterBy="label"
            style={{ width: '100%' }}
            showClear
          />
          <label htmlFor={`ativo-${index}`}>Ativo</label>
        </FloatLabel>
      </div>
      <div style={{ width: '100%', minWidth: 0 }}>
        <FloatLabel>
          <InputNumber
            id={`peso-${index}`}
            value={item.peso}
            onValueChange={(e) => onPesoChange(index, e.value ?? 0)}
            suffix="%"
            min={0}
            max={100}
            mode="decimal"
            minFractionDigits={0}
            maxFractionDigits={2}
            style={{ width: '100%' }}
            inputStyle={{ width: '100%' }}
          />
          <label htmlFor={`peso-${index}`}>Peso</label>
        </FloatLabel>
      </div>
      <div style={{ minWidth: 0 }}>
        <Button
          icon="pi pi-trash"
          severity="danger"
          onClick={() => onRemover(index)}
          disabled={desabilitarRemover}
          style={{ backgroundColor: COR_VERMELHO, color: COR_PRETO, border: 'none' }}
        />
      </div>
    </div>
  );
}
