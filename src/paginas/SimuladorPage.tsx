import { useState, useEffect, useRef, useMemo } from 'react';
import { Toast } from 'primereact/toast';
import { CarteiraForm } from '../componentes/carteira';
import { ParametrosForm } from '../componentes/parametros';
import { Carregando } from '../componentes/comuns';
import { GraficoRentabilidade } from '../componentes/graficos';
import { TabelaIndicadores } from '../componentes/indicadores';
import { TabelaComparacaoAnual } from '../componentes/comparacao';
import { buscarAtivos, buscarIndicesBenchmark, buscarIndicadores, buscarResumo, buscarRentabilidade } from '../api/simulacao.service';
import { obterDataMinimaEfetiva, obterDataMaximaEfetiva, validarSomaPesos, validarAtivosSelecionados, validarDuplicatas } from '../utils/validacoes';
import { formatarDataAAAA_MM_DD } from '../utils/formatadores';
import type { Ativo, Carteira, IndiceBenchmark, Indicadores, Resumo, RentabilidadeCarteira } from '../dominio/tipos';

export default function SimuladorPage() {
  const toast = useRef<Toast>(null);
  const resultadosRef = useRef<HTMLDivElement>(null);

  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [carregandoAtivos, setCarregandoAtivos] = useState(true);

  const [indicesBenchmark, setIndicesBenchmark] = useState<IndiceBenchmark[]>([]);
  const [carregandoIndices, setCarregandoIndices] = useState(true);

  const [carteiraA, setCarteiraA] = useState<Carteira[]>([{ ativo: null, peso: 100 }]);
  const [carteiraB, setCarteiraB] = useState<Carteira[]>([{ ativo: null, peso: 100 }]);

  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [benchmarkSelecionado, setBenchmarkSelecionado] = useState<string>('');

  const [indicadoresA, setIndicadoresA] = useState<Indicadores | null>(null);
  const [indicadoresB, setIndicadoresB] = useState<Indicadores | null>(null);
  const [indicadoresBenchmark, setIndicadoresBenchmark] = useState<Indicadores | null>(null);
  const [resumoA, setResumoA] = useState<Resumo | null>(null);
  const [resumoB, setResumoB] = useState<Resumo | null>(null);
  const [resumoBenchmark, setResumoBenchmark] = useState<Resumo | null>(null);
  const [rentabilidadeA, setRentabilidadeA] = useState<RentabilidadeCarteira | null>(null);
  const [rentabilidadeB, setRentabilidadeB] = useState<RentabilidadeCarteira | null>(null);
  const [rentabilidadeBenchmark, setRentabilidadeBenchmark] = useState<RentabilidadeCarteira | null>(null);

  const [carregandoSimulacao, setCarregandoSimulacao] = useState(false);
  const [resultadosVisiveis, setResultadosVisiveis] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resAtivos, resIndices] = await Promise.all([
          buscarAtivos(),
          buscarIndicesBenchmark(),
        ]);
        setAtivos(resAtivos.ativos);
        setIndicesBenchmark(resIndices.ativos);
      } catch {
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados. Tente novamente.',
          life: 4000,
        });
      } finally {
        setCarregandoAtivos(false);
        setCarregandoIndices(false);
      }
    }
    carregarDados();
  }, []);

  const todosAtivos = useMemo(() => {
    const codigos = new Set<string>();
    const lista: Ativo[] = [];
    for (const item of [...carteiraA, ...carteiraB]) {
      if (item.ativo && !codigos.has(item.ativo.codigoAtivo)) {
        codigos.add(item.ativo.codigoAtivo);
        lista.push(item.ativo);
      }
    }
    return lista;
  }, [carteiraA, carteiraB]);

  function extrairCodigosEPesos(carteira: Carteira[]): { codigos: string[]; pesos: number[] } {
    const codigos: string[] = [];
    const pesos: number[] = [];

    for (const item of carteira) {
      if (item.ativo) {
        codigos.push(item.ativo.codigoAtivo);
        pesos.push(item.peso);
      }
    }

    return { codigos, pesos };
  }

  async function handleSimular() {
    if (!validarSomaPesos(carteiraA)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Pesos inválidos',
        detail: 'A composição dos pesos da Carteira A deve somar 100%.',
        life: 4000,
      });
      return;
    }

    if (!validarSomaPesos(carteiraB)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Pesos inválidos',
        detail: 'A composição dos pesos da Carteira B deve somar 100%.',
        life: 4000,
      });
      return;
    }

    if (!validarAtivosSelecionados(carteiraA)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Ativos incompletos',
        detail: 'Selecione pelo menos um ativo em cada linha da Carteira A.',
        life: 4000,
      });
      return;
    }

    if (!validarAtivosSelecionados(carteiraB)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Ativos incompletos',
        detail: 'Selecione pelo menos um ativo em cada linha da Carteira B.',
        life: 4000,
      });
      return;
    }

    if (!validarDuplicatas(carteiraA)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Ativos duplicados',
        detail: 'A Carteira A contém ativos duplicados. Remova as duplicatas.',
        life: 4000,
      });
      return;
    }

    if (!validarDuplicatas(carteiraB)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Ativos duplicados',
        detail: 'A Carteira B contém ativos duplicados. Remova as duplicatas.',
        life: 4000,
      });
      return;
    }

    if (!benchmarkSelecionado) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Benchmark obrigatório',
        detail: 'Selecione um benchmark para a simulação.',
        life: 4000,
      });
      return;
    }

    if (!dataInicio || !dataFim) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Datas obrigatórias',
        detail: 'Selecione as datas de início e fim.',
        life: 4000,
      });
      return;
    }

    if (todosAtivos.length > 0) {
      const minEfetiva = obterDataMinimaEfetiva(todosAtivos);
      const maxEfetiva = obterDataMaximaEfetiva(todosAtivos);
      const dataInicioStr = formatarDataAAAA_MM_DD(dataInicio);
      const dataFimStr = formatarDataAAAA_MM_DD(dataFim);

      if (minEfetiva && dataInicioStr < minEfetiva) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Data inicial inválida',
          detail: `A data inicial não pode ser anterior a ${minEfetiva.split('-').reverse().join('/')}.`,
          life: 4000,
        });
        return;
      }

      if (maxEfetiva && dataFimStr > maxEfetiva) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Data final inválida',
          detail: `A data final não pode ser posterior a ${maxEfetiva.split('-').reverse().join('/')}.`,
          life: 4000,
        });
        return;
      }
    }

    setCarregandoSimulacao(true);
    setResultadosVisiveis(false);

    const { codigos: codigosA, pesos: pesosA } = extrairCodigosEPesos(carteiraA);
    const { codigos: codigosB, pesos: pesosB } = extrairCodigosEPesos(carteiraB);

    const codigosBenchmark = [benchmarkSelecionado];
    const pesosBenchmark = [100];

    const dataInicioStr = formatarDataAAAA_MM_DD(dataInicio);
    const dataFimStr = formatarDataAAAA_MM_DD(dataFim);

    try {
      const [indA, resA, rentA, indB, resB, rentB, indBench, resBench, rentBench] = await Promise.all([
        buscarIndicadores(codigosA, pesosA),
        buscarResumo(codigosA, pesosA),
        buscarRentabilidade(codigosA, pesosA, dataInicioStr, dataFimStr),
        buscarIndicadores(codigosB, pesosB),
        buscarResumo(codigosB, pesosB),
        buscarRentabilidade(codigosB, pesosB, dataInicioStr, dataFimStr),
        buscarIndicadores(codigosBenchmark, pesosBenchmark),
        buscarResumo(codigosBenchmark, pesosBenchmark),
        buscarRentabilidade(codigosBenchmark, pesosBenchmark, dataInicioStr, dataFimStr),
      ]);

      setIndicadoresA(indA);
      setResumoA(resA);
      setRentabilidadeA(rentA);
      setIndicadoresB(indB);
      setResumoB(resB);
      setRentabilidadeB(rentB);
      setIndicadoresBenchmark(indBench);
      setResumoBenchmark(resBench);
      setRentabilidadeBenchmark(rentBench);
      setResultadosVisiveis(true);

      toast.current?.show({
        severity: 'success',
        summary: 'Simulação concluída',
        detail: 'Resultados carregados com sucesso.',
        life: 3000,
      });

      setTimeout(() => {
        resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (erro: unknown) {
      tratarErro(erro);
    } finally {
      setCarregandoSimulacao(false);
    }
  }

  function tratarErro(erro: unknown) {
    if (erro && typeof erro === 'object' && 'response' in erro) {
      const axiosErro = erro as { response?: { status: number; data?: { message?: string } } };
      const status = axiosErro.response?.status;
      const message = axiosErro.response?.data?.message;

      if (status === 400) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Pesos inválidos',
          detail: message ?? 'A composição dos pesos deve somar 100%.',
          life: 4000,
        });
      } else if (status === 412) {
        toast.current?.show({
          severity: 'error',
          summary: 'Datas inválidas',
          detail: message ?? 'Verifique as datas selecionadas.',
          life: 4000,
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Algo deu errado. Tente novamente.',
          life: 4000,
        });
      }
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro de conexão',
        detail: 'Tente novamente.',
        life: 4000,
      });
    }
  }

  const dataMinimaEfetiva = obterDataMinimaEfetiva(todosAtivos);
  const dataMaximaEfetiva = obterDataMaximaEfetiva(todosAtivos);

  const pesosValidos = validarSomaPesos(carteiraA) && validarSomaPesos(carteiraB);

  return (
    <div>
      <Toast ref={toast} />

      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
        Comparador de Carteiras
      </h1>

      {carregandoAtivos || carregandoIndices ? (
        <Carregando />
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <CarteiraForm
              titulo="Carteira A"
              carteira={carteiraA}
              ativos={ativos}
              onCarteiraChange={setCarteiraA}
            />
            <CarteiraForm
              titulo="Carteira B"
              carteira={carteiraB}
              ativos={ativos}
              onCarteiraChange={setCarteiraB}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <ParametrosForm
              dataInicio={dataInicio}
              dataFim={dataFim}
              dataMinima={dataMinimaEfetiva}
              dataMaxima={dataMaximaEfetiva}
              benchmarkSelecionado={benchmarkSelecionado}
              indicesBenchmark={indicesBenchmark}
              onDataInicioChange={setDataInicio}
              onDataFimChange={setDataFim}
              onBenchmarkChange={setBenchmarkSelecionado}
              onSimular={handleSimular}
              desabilitar={!pesosValidos}
              carregando={carregandoSimulacao}
            />
          </div>

          {carregandoSimulacao && <Carregando />}

          {resultadosVisiveis && !carregandoSimulacao && (
            <div ref={resultadosRef} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {rentabilidadeA && rentabilidadeB && rentabilidadeBenchmark && (
                <GraficoRentabilidade
                  rentabilidadeA={rentabilidadeA.historico}
                  rentabilidadeB={rentabilidadeB.historico}
                  rentabilidadeBenchmark={rentabilidadeBenchmark.historico}
                />
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '16px',
                  width: '100%',
                }}
              >
                <TabelaIndicadores
                  indicadoresA={indicadoresA}
                  indicadoresB={indicadoresB}
                  indicadoresBenchmark={indicadoresBenchmark}
                />
                <TabelaComparacaoAnual
                  resumoA={resumoA}
                  resumoB={resumoB}
                  resumoBenchmark={resumoBenchmark}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
