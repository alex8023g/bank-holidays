import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateSharedCalendBtn } from '@/components/CreateSharedCalendBtn';
import { LoginBtnsGroup } from '@/components/LoginBtnsGroup';
import { getDays, getSharedRangesListByUserId } from '@/lib/actions';
import Link from 'next/link';
import { copyTextToClipboard } from '@/lib/copyToClipboard';
import { BtnCopyInvitationLink } from '@/components/BtnCopyInvitationLink';

export default async function SharedPage() {
  const session = await getServerSession(authOptions);

  const sharedRangesRes = await getSharedRangesListByUserId({
    userId: session?.user.id || null,
  });
  const days = await getDays();

  const currentYear = new Date().getFullYear();
  const lastYearInDays = days.at(-1)?.year || currentYear;

  const calendarsAmount = sharedRangesRes.sharedRanges?.length || 0;
  console.log('🚀 ~ SharedPage ~ calendarsAmount:', calendarsAmount);

  return (
    <div className='flex h-full flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <main className='h-2/3 overflow-y-scroll bg-gray-100 p-5 xl:flex xl:h-full xl:flex-1'>
        {session?.user.id ? (
          <div>
            <div>
              {sharedRangesRes.sharedRanges?.map((sharedPagesItem) => (
                <div
                  key={sharedPagesItem.id}
                  className='mb-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md'
                >
                  <div className='flex gap-2'>
                    <span className='font-semibold'>название:</span>
                    <span>{sharedPagesItem.name}</span>
                  </div>
                  <div className='flex gap-2'>
                    <span className='font-semibold'>
                      год: лучше убрать из параметров общих календарей
                    </span>
                    <span>{sharedPagesItem.year}</span>
                  </div>
                  <div className='flex gap-2'>
                    <span className='font-semibold'>
                      количество участников:
                    </span>
                    <span>{sharedPagesItem.personalRanges.length}</span>
                  </div>
                  <div className='flex gap-2'>
                    <span className='font-semibold'>
                      ссылка для приглашения:
                    </span>
                    <BtnCopyInvitationLink
                      link={`${process.env.NEXT_PUBLIC_APP_URL}/?sharedplaninvitation=${sharedPagesItem.id}`}
                    />
                  </div>
                  <div className='flex gap-2'>
                    <span className='font-semibold'>
                      ссылка для приглашения v2:
                    </span>
                    <BtnCopyInvitationLink
                      link={`${process.env.NEXT_PUBLIC_APP_URL}/invitation?sharedRangesId=${sharedPagesItem.id}`}
                    />
                  </div>
                  <div className='flex gap-2'>
                    <span className='font-semibold'>
                      показать мой план отпусков участникам:
                    </span>
                    <div className='group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-indigo-500 dark:has-checked:bg-indigo-500'>
                      <span className='size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5' />
                      <input
                        name='setting'
                        type='checkbox'
                        aria-label='Use setting'
                        className='absolute inset-0 appearance-none focus:outline-hidden'
                      />
                    </div>
                  </div>
                  <Link href={`/shared/${sharedPagesItem.id}`}>
                    {'перейти ->'}
                  </Link>
                  {/* <Link href={`/shared/ids=[${sharedPagesItem.id}]`}>
                    {'перейти ->'}
                  </Link> */}
                </div>
              ))}
            </div>
            <CreateSharedCalendBtn
              userId={session?.user.id}
              currentYear={currentYear}
              lastYearInDays={lastYearInDays}
              calendarsAmount={calendarsAmount}
            />
          </div>
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
