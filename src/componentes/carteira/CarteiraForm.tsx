import { Button } from 'primereact/button';
import LinhaAtivo from './LinhaAtivo';
import type { Ativo, Carteira } from '../../dominio/tipos';
import { calcularSomaPesos, validarSomaPesos } from '../../utils/validacoes';

interface CarteiraFormProps {
  titulo: string;
  carteira: Carteira[];
  ativos: Ativo[];
  onCarteiraChange: (carteira: Carteira[]) => void;
}

export default function CarteiraForm({
  titulo,
  carteira,
  ativos,
  onCarteiraChange,
}: CarteiraFormProps) {
  const ativosSelecionados = carteira
    .map((c) => c.ativo?.codigoAtivo)
    .filter((codigo): codigo is string => !!codigo);

  const soma = calcularSomaPesos(carteira);
  const valido = validarSomaPesos(carteira);

  function handleAtivoChange(index: number, ativo: Ativo | null) {
    const novaCarteira = [...carteira];
    novaCarteira[index] = { ...novaCarteira[index], ativo };
    onCarteiraChange(novaCarteira);
  }

  function handlePesoChange(index: number, peso: number) {
    const novaCarteira = [...carteira];
    novaCarteira[index] = { ...novaCarteira[index], peso };
    onCarteiraChange(novaCarteira);
  }

  function handleRemover(index: number) {
    const novaCarteira = carteira.filter((_, i) => i !== index);
    onCarteiraChange(novaCarteira);
  }

  function handleAdicionar() {
    onCarteiraChange([...carteira, { ativo: null, peso: 0 }]);
  }

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '60% 25% 15%', gap: '8px', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
          {titulo}
        </h3>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: valido ? '#16a34a' : '#dc2626',
            textAlign: 'center',
          }}
        >
          {soma.toFixed(1)}%
        </span>
        <span />
      </div>

      {carteira.map((_, index) => (
        <LinhaAtivo
          key={index}
          carteira={carteira}
          index={index}
          ativos={ativos}
          ativosSelecionados={ativosSelecionados}
          onAtivoChange={handleAtivoChange}
          onPesoChange={handlePesoChange}
          onRemover={handleRemover}
          desabilitarRemover={carteira.length <= 1}
        />
      ))}

      <Button
        label="Adicionar ativo"
        severity="info"
        onClick={handleAdicionar}
      />
    </div>
  );
}
