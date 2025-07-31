import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/ru'; // Importing Russian locale for dayjs
import Header from '@/components/Header';
import ResultBlock from '@/components/ResultBlock';
import CalendarsBlock from '@/components/CalendarsBlock';
import ClientContainerVH from '@/components/ClientContainerVH';
dayjs.locale('ru');
dayjs.extend(isoWeek);
// Importing dayjs with isoWeek plugin for week calculations
// Importing Russian locale for dayjs

export default async function HomePage() {
  return (
    <ClientContainerVH>
      <Header />
      <div className='flex flex-col overflow-y-hidden border-2 border-blue-500 xl:flex-row'>
        <CalendarsBlock />
        <ResultBlock />
      </div>
    </ClientContainerVH>
  );
}
