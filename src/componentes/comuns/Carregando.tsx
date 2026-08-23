import { ProgressSpinner } from 'primereact/progressspinner';

export default function Carregando() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <ProgressSpinner />
    </div>
  );
}
