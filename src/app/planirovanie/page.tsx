import {
  getDays,
  getSharedPlansListByPersPlanId,
  SharedPlansListByPersPlanId,
} from '@/lib/actions';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import { ContainerMain1 } from '@/components/ContainerMain1';
import ContainerRangesUsers from '@/components/ContainerRangesUsers';
import { ContainerCalendarsView } from '@/components/ContainerCalendarsView';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';
import { getPersonalRangesId } from '@/lib/getPersonalRangesId';
import { ContainerClientProviderVH } from '@/components/ContainerClientProviderVH';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Планирование отпуска',
  description:
    'Планировщик отпуска работников онлайн. Программа для планирования отпусков сотрудников.',
};

export default async function PlanirovaniePage() {
  const days = await getDays();

  const personalRangesId = await getPersonalRangesId();

  const sharedPlansList: SharedPlansListByPersPlanId[] = [];

  if (personalRangesId) {
    const sharedPlansListRes = await getSharedPlansListByPersPlanId({
      personalRangesId,
    });
    if (sharedPlansListRes.ok) {
      sharedPlansList.push(...sharedPlansListRes.sharedRanges);
    } else {
      console.error(sharedPlansListRes.error);
      return <div>Сервис временно недоступен, попробуйте позже</div>;
    }
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
      <ContainerMainAside>
        <ContainerMain1>
          <ContainerCalendarsView
            days={days}
            sharedPlansList={sharedPlansList}
          />
          <div className='glass bg-opacity-10 sticky bottom-2 z-30 mx-8 hidden justify-center rounded-xl border border-gray-200 p-4 shadow-md backdrop-blur-sm backdrop-filter xl:flex'>
            <div className=''>
              Сервис для планирования отпусков сотрудников. Создавайте графики
              отпусков на календаре бесплатно онлайн.
            </div>
          </div>
        </ContainerMain1>
        <ContainerRangesUsers days={days} sharedPlansList={sharedPlansList} />
      </ContainerMainAside>
    </ContainerClientProviderVH>
  );
}
