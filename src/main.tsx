import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { addLocale, locale } from 'primereact/api'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import './index.css'
import App from './App.tsx'

addLocale('pt', {
  chooseDate: 'Escolher data',
  chooseMonth: 'Escolher mês',
  chooseYear: 'Escolher ano',
  prevMonth: 'Mês anterior',
  nextMonth: 'Próximo mês',
  prevYear: 'Ano anterior',
  nextYear: 'Próximo ano',
  prevDecade: 'Década anterior',
  nextDecade: 'Próxima década',
  today: 'Hoje',
  clear: 'Limpar',
  dateFormat: 'dd/mm/yy',
  weekHeader: 'Sm',
  monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  firstDayOfWeek: 0,
})

locale('pt')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
