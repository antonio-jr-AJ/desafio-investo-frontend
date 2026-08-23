export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarPercentual(valor: number): string {
  return (
    (valor * 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + '%'
  );
}

export function formatarDataAAAA_MM_DD(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function formatarDataDiaMes(dataISO: string): string {
  const data = new Date(dataISO + 'T00:00:00');
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function formatarDataMesAno(dataISO: string): string {
  const data = new Date(dataISO + 'T00:00:00');
  return data.toLocaleDateString('pt-BR', {
    month: '2-digit',
    year: '2-digit',
  });
}
