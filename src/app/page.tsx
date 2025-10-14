import { CalendarsBlock } from '@/components/CalendarsBlock';
import ResultBlock from '@/components/ResultBlock';
import { getDays } from '@/lib/actions';

export default async function HomePage() {
  // let fileData = '';

  // try {
  //   fileData = await fs.promises.readFile(
  //     process.cwd() + '/src/constant/calendars.json',
  //     'utf8',
  //   );
  // } catch (err) {
  //   console.error(err);
  //   return (
  //     <div>
  //       file /src/constant/calendars.json doesn`t exist, exec &quot;npm run
  //       createjsoncalendar&quot;
  //     </div>
  //   );
  // }

  // const days: Day[] = JSON.parse(fileData);
  const days = await getDays();

  return (
    <div className='flex flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <CalendarsBlock days={days} />
      <ResultBlock days={days} />
    </div>
  );
}
