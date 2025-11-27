import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateSharedCalendBtn } from '@/components/CreateSharedCalendBtn';
import { LoginBtnsGroup } from '@/components/LoginBtnsGroup';
import {
  getSharedRangesListByOwnerId,
  getSharedPlansListByPersPlanId,
} from '@/lib/actions';
import Link from 'next/link';
import { BtnCopyInvitationLink } from '@/components/BtnCopyInvitationLink';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';
import { BtnLeaveSharedPlan } from '@/components/BtnLeaveSharedPlan';
import { Divider } from '@/components/catalist/divider';
import { SharedPlanItemMenu } from '@/components/SharedPlanItemMenu';
import {
  ClipboardDocumentIcon,
  DocumentDuplicateIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';
import { getPersonalRangesId } from '@/lib/getPersonalRangesId';
import { SharedPlanOwnerItem } from '@/components/SharedPlanOwnerItem';
import { Suspense } from 'react';
import { ContainerClientProviderVH } from '@/components/ContainerClientProviderVH';

export default async function SharedPage() {
  const session = await getServerSession(authOptions);

  const sharedRangesByOwnerRes = await getSharedRangesListByOwnerId({
    userId: session?.user.id || null,
  });

  const calendarsAmount = sharedRangesByOwnerRes.sharedRanges?.length || 0;
  console.log('🚀 ~ SharedPage ~ calendarsAmount:', calendarsAmount);

  const personalRangesId = await getPersonalRangesId();
  const sharedPlansByPersPlanIdListRes = await getSharedPlansListByPersPlanId({
    personalRangesId,
  });
  if (sharedPlansByPersPlanIdListRes.ok) {
    console.log(
      '🚀 ~ sharedPlansByPersPlanIdListRes:',
      sharedPlansByPersPlanIdListRes.sharedRanges,
    );
  } else {
    console.error(sharedPlansByPersPlanIdListRes.error);
    return <div>Сервис временно недоступен, попробуйте позже</div>;
  }

  const res = await findOrCreatePersonalRanges();
  if (!res.ok) {
    return <div>Error: {res.errorMsg}</div>;
  }

  return (
    <ContainerClientProviderVH
      session={res.session}
      personalRangesId={res.personalRangesId}
      personalRangesName={res.personalRanges.userName}
      personalRangesIdFromCookie={res.personalRangesIdFromCookie}
      personalRanges={res.personalRanges}
    >
      {/* <Header2 session={res.session} /> */}
      <div className='flex h-full flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
        <main className='h-2/3 overflow-y-scroll bg-gray-100 p-5 xl:flex xl:h-full xl:flex-1'>
          <Suspense>
            <div>
              <h3 className='mb-2 text-xl font-semibold'>
                Общие графики отпусков, в которых вы участвуете:
              </h3>
              {sharedPlansByPersPlanIdListRes.sharedRanges?.length ? (
                <ul>
                  {sharedPlansByPersPlanIdListRes.sharedRanges.map(
                    (sharedRange) => (
                      <li
                        key={sharedRange.sharedRanges.id}
                        className='mb-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md'
                      >
                        <div className='flex gap-2'>
                          {/* <span className='font-semibold'>Название:</span> */}
                          <span className='text-lg font-semibold'>
                            {sharedRange.sharedRanges.name}
                          </span>
                        </div>
                        <Divider className='my-2' />
                        <div className='flex gap-2'>
                          <span className='font-semibold'>
                            Количество участников:
                          </span>
                          <span>
                            {sharedRange.personalRangesList.length + 1}
                          </span>
                        </div>
                        <div className='flex justify-end'>
                          <BtnLeaveSharedPlan
                            sharedRanges={sharedRange.sharedRanges}
                            personalRangesId={personalRangesId}
                          />
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <div>Нет общих графиков отпусков, в которых вы участвуете</div>
              )}
              <h3 className='mb-2 text-xl font-semibold'>
                Общие графики отпусков, в которых вы являетесь администратором:
              </h3>
              {sharedRangesByOwnerRes.sharedRanges?.length ? (
                <ul>
                  {sharedRangesByOwnerRes.sharedRanges?.map(
                    (sharedPagesItem) => (
                      <SharedPlanOwnerItem
                        key={sharedPagesItem.id}
                        sharedPlanItem={sharedPagesItem}
                        personalRangesId={personalRangesId}
                      />
                      /* 
                  <li>
                  <div className='flex gap-2'>
                  <span className='font-semibold'>
                  ссылка для приглашения:
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
                  <div>
                  <Link href={`/shared/${sharedPagesItem.id}`}>
                  {'перейти ->'}
                  </Link>
                  </div>
                  </li> */
                    ),
                  )}
                </ul>
              ) : (
                <div>
                  Нет общих графиков отпусков, в которых вы являетесь владельцем
                </div>
              )}
              {/* <CreateSharedCalendBtn
            userId={session?.user.id}
            currentYear={currentYear}
            lastYearInDays={lastYearInDays}
            calendarsAmount={calendarsAmount}
            /> */}
            </div>
          </Suspense>
          {/*         ) : (
          <h2 className='m-auto max-w-lg text-center text-2xl font-semibold'>
          Для создания и редактирования общих графиков отпусков необходимо
          войти в систему
          </h2>
          )} */}
        </main>
        <aside className='flex h-1/2 flex-col overflow-y-hidden rounded-lg bg-white px-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:mx-auto md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
          {!session?.user.id ? (
            <LoginBtnsGroup />
          ) : (
            <div className='/border flex h-full flex-col items-center'>
              {/* <div className='/border flex h-1/2 items-center justify-center'>
              <CreateSharedCalendBtn
              userId={session?.user.id}
              currentYear={currentYear}
              lastYearInDays={lastYearInDays}
              calendarsAmount={calendarsAmount}
              />
              </div> */}
              <div className='/border flex h-full px-3 py-5'>
                <div className='flex flex-col items-center justify-center rounded-lg border border-gray-400 p-5'>
                  <span className='mb-10 text-center'>
                    Создавайте общие графики отпусков, делитесь ссылкой для
                    добавления сотрудников.
                  </span>
                  <CreateSharedCalendBtn
                    userId={session?.user.id}
                    calendarsAmount={calendarsAmount}
                  />
                  <ol className='list-inside list-decimal p-5'>
                    <li>Создайте общий график отпусков</li>
                    <li>Скопируйте ссылку для приглашения участников</li>
                    <li>Разошлите ссылку сотрудникам</li>
                    <li>
                      Сотрудники присоединяются к общему графику отпусков по
                      ссылке
                    </li>
                    <li className=''>
                      откройте персональный календарь в режиме{' '}
                      <ViewColumnsIcon className='inline size-6' /> там появятся
                      все участники общего графика отпусков (возможно
                      потребуется обновить страницу)
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </ContainerClientProviderVH>
  );
}
