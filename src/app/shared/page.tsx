import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateSharedCalendBtn } from '@/components/CreateSharedCalendBtn';
import { LoginBtnsGroup } from '@/components/LoginBtnsGroup';
import { getDays, getSharedRangesListByUserId } from '@/lib/actions';
import { div } from 'motion/react-client';
import Link from 'next/link';

export default async function SharedPage() {
  const session = await getServerSession(authOptions);

  const sharedRangesRes = await getSharedRangesListByUserId({
    userId: session?.user.id || null,
  });
  const days = await getDays();
  console.log(
    '🚀 ~ SharedPage ~ days:',
    days.at(-1)?.year,
    new Date().getFullYear(),
  );

  const currentYear = new Date().getFullYear();
  const lastYearInDays = days.at(-1)?.year || currentYear;

  const calendarsAmount = sharedRangesRes.sharedRanges?.length || 0;
  console.log('🚀 ~ SharedPage ~ calendarsAmount:', calendarsAmount);

  return (
    <div className='flex h-full flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <main className='h-2/3 overflow-y-scroll bg-gray-100 xl:flex xl:h-full xl:flex-1'>
        {session?.user.id ? (
          <>
            <div>
              {sharedRangesRes.sharedRanges?.map((sharedPagesItem) => (
                <div
                  key={sharedPagesItem.id}
                  className='flex items-center gap-2'
                >
                  <div>{sharedPagesItem.name}</div>
                  <div>{sharedPagesItem.year}</div>
                  <Link href={`/rowcalendar/?sharedplan=${sharedPagesItem.id}`}>
                    {'перейти ->'}
                  </Link>
                </div>
              ))}
            </div>
            <CreateSharedCalendBtn
              userId={session?.user.id}
              currentYear={currentYear}
              lastYearInDays={lastYearInDays}
              calendarsAmount={calendarsAmount}
            />
          </>
        ) : (
          <h2 className='m-auto max-w-lg text-center text-2xl font-semibold'>
            Для создания и редактирования общих графиков отпусков необходимо
            войти в систему
          </h2>
        )}
      </main>
      {!session?.user.id && (
        <aside className='flex h-1/2 flex-col overflow-y-hidden rounded-lg bg-white px-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:mx-auto md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
          <LoginBtnsGroup />
        </aside>
      )}
    </div>
  );
}
