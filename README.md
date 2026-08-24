# Comparador de Carteiras Investo

Aplicação frontend desenvolvida em **React + TypeScript** para o desafio técnico da Investo ETF. Permite comparar a rentabilidade de duas carteiras de ativos financeiros contra um benchmark (CDI).

## Funcionalidades

- **Carteiras A e B**: Seleção dinâmica de ativos com pesos (%)
- **Gráfico de Rentabilidade**: LineChart com ambas as carteiras e benchmark
- **Tabela de Indicadores**: Rentabilidade, Sharpe, Volatilidade, Drawdown e % CDI
- **Tabela Comparativa Anual**: Desempenho por ano (2021–2025)
- **Validações automáticas**: Soma dos pesos, duplicatas, datas no range, benchmark obrigatório
- **Tratamento de erros**: Toasts para erros 400, 412, de rede e inesperados

## Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18
- npm

## Instalação

```bash
npm install
```

## Execução

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> O proxy CORS já está configurado no `vite.config.ts` para redirecionar chamadas `/api` ao backend da Investo.

### Build para produção

```bash
npm run build
```

Os arquivos gerados ficam em `dist/`.

### Visualizar build de produção

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Estrutura do Projeto

```
src/
├── api/
│   ├── cliente.ts              # Cliente Axios (baseURL + timeout)
│   └── simulacao.service.ts    # Funções de chamada à API
├── dominio/
│   ├── tipos.ts                # Interfaces TypeScript (espelham a API)
│   └── constantes.ts           # URLs, cores, timeouts, benchmarks
├── componentes/
│   ├── carteira/               # CarteiraForm, LinhaAtivo
│   ├── parametros/             # ParametrosForm (datas, benchmark, botão simular)
│   ├── graficos/               # GraficoRentabilidade (ReCharts)
│   ├── indicadores/            # TabelaIndicadores (inclui coluna % CDI)
│   ├── comparacao/             # TabelaComparacaoAnual
│   └── comuns/                 # Carregando (ProgressSpinner)
├── utils/
│   ├── formatadores.ts         # formatarMoeda, formatarPercentual, formatarData
│   └── validacoes.ts           # Validação de pesos, duplicatas, datas
└── paginas/
    └── SimuladorPage.tsx       # Página principal com estado e fluxo
```

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React 19 | Biblioteca UI |
| TypeScript 6 | Tipagem estática |
| Vite 8 | Bundler e dev server |
| PrimeReact 10 | Componentes de interface (DataTable, Calendar, Dropdown, Toast) |
| ReCharts 3 | Gráfico de linhas |
| Axios | Cliente HTTP |
| Oxlint | Linter |

## API

A aplicação consome a API REST da Investo ETF:

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/simulacao/ativos` | GET | Lista ativos disponíveis |
| `/api/simulacao/indicadores` | GET | Indicadores da carteira |
| `/api/simulacao/resumo` | GET | Resumo por período |
| `/api/simulacao/rentabilidade-carteira` | GET | Rentabilidade diária |

## Regras de Negócio

- Pesos das carteiras devem somar **100%** (tolerância para ponto flutuante)
- Pesos são enviados como decimal (0–1) para a API
- Datas restritas à interseção dos ativos selecionados
- Benchmark tratado como carteira com 1 ativo (CDI, peso 100%)
- Valores financeiros em juros compostos (backend), frontend apenas exibe
