import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateSharedCalendBtn } from '@/components/CreateSharedCalendBtn';
import { LoginBtnsGroup } from '@/components/LoginBtnsGroup';
import {
  getSharedRangesListByOwnerId,
  getSharedPlansListByPersPlanId,
} from '@/lib/actions';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';
import { BtnLeaveSharedPlan } from '@/components/BtnLeaveSharedPlan';
import { Divider } from '@/components/catalist/divider';
import { ViewColumnsIcon } from '@heroicons/react/24/outline';
import { getPersonalRangesId } from '@/lib/getPersonalRangesId';
import { SharedPlanOwnerItem } from '@/components/SharedPlanOwnerItem';
import { Suspense } from 'react';
import { ContainerClientProviderVH } from '@/components/ContainerClientProviderVH';
import { Stepper } from '@/components/Stepper';

const steps = [
  {
    name: 'Войти',
    description: 'Войдите в систему, чтобы продолжить.',
    href: '#',
    status: 'current',
  },
  {
    name: 'Создать график отпусков',
    description: 'Создайте общий график отпусков отдела или компании.',
    href: '#',
    status: 'upcoming',
  },
  {
    name: 'Скопировать ссылку',
    description: 'Кликните по ссылке чтобы её скопировать.',
    href: '#',
    status: 'upcoming',
  },
  {
    name: 'Отправить ссылку',
    description: 'Отправьте ссылку сотрудникам по почте или мессенджеру.',
    href: '#',
    status: 'upcoming',
  },
  {
    name: 'Перейти в Общий график отпусков',
    description:
      'Перейдите в раздел Общие и просмотрите график отпусков (возможно, потребуется обновить страницу).',
    href: '/?shared',
    status: 'upcoming',
  },
];

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

  if (session?.user.name) {
    steps[0].status = 'complete';
    if (calendarsAmount > 0) {
      steps[1].status = 'complete';
      steps[2].status = 'current';
      steps[3].status = 'upcoming';
    } else {
      steps[1].status = 'current';
      steps[2].status = 'upcoming';
      steps[3].status = 'upcoming';
    }
  } else {
    steps[0].status = 'current';
    steps[1].status = 'upcoming';
    steps[2].status = 'upcoming';
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
            {sharedPlansByPersPlanIdListRes.sharedRanges?.length ||
            sharedRangesByOwnerRes.sharedRanges?.length ? (
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
                  <div>
                    Нет общих графиков отпусков, в которых вы участвуете
                  </div>
                )}
                <h3 className='mb-2 text-xl font-semibold'>
                  Общие графики отпусков, в которых вы являетесь
                  администратором:
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
                      ),
                    )}
                  </ul>
                ) : (
                  <div>
                    Нет общих графиков отпусков, в которых вы являетесь
                    владельцем
                  </div>
                )}
              </div>
            ) : session?.user.name ? (
              <div className='m-auto'>
                <CreateSharedCalendBtn
                  userId={session?.user.id}
                  calendarsAmount={calendarsAmount}
                />
              </div>
            ) : (
              <LoginBtnsGroup />
            )}
          </Suspense>
        </main>
        <aside className='flex h-1/2 flex-col overflow-y-hidden rounded-lg bg-white p-5 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:mx-auto md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
          {/* {!session?.user.id ? ( */}
          {sharedPlansByPersPlanIdListRes.sharedRanges?.some(
            (item) => item.personalRangesList.length > 0,
          ) ||
          sharedRangesByOwnerRes.sharedRanges?.some(
            (item) => item.personalRanges.length > 1,
          ) ? (
            <div className='/border flex h-full flex-col items-center'>
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
                      откройте персональный календарь там появятся все участники
                      общего графика отпусков (возможно потребуется обновить
                      страницу)
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            // <LoginBtnsGroup />
            <div className='flex h-full flex-col items-center justify-center rounded-lg border border-gray-400 p-5'>
              <h3 className='/font-medium mb-10 text-center'>
                Создавайте общие графики отпусков, делитесь ссылкой для
                добавления сотрудников.
              </h3>
              <Stepper
                session={session}
                steps={steps}
                isSharedPlansExists={calendarsAmount > 0}
              />
            </div>
          )}
        </aside>
      </div>
    </ContainerClientProviderVH>
  );
}
