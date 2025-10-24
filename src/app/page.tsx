import { getDays, getSharedPlansListByPersPlanId } from '@/lib/actions';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import { ContainerMain1 } from '@/components/ContainerMain1';
import { ContainerAside } from '@/components/ContainerAside';
import ContainerRangesUsers from '@/components/ContainerRangesUsers';
import { ContainerCalendarsView } from '@/components/ContainerCalendarsView';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';

export default async function HomePage() {
  console.log('🚀 ~ HomePage ~ start');

  const days = await getDays();

  const res = await findOrCreatePersonalRanges();
  if (!res.ok) {
    return <div>Error: {res.errorMsg}</div>;
  }
  const { personalRangesId, session } = res;

  const sharedPlansListRes = await getSharedPlansListByPersPlanId({
    personalRangesId: personalRangesId,
  });

  if (sharedPlansListRes.ok) {
    console.log('🚀 ~ sharedPlansListRes:', sharedPlansListRes.sharedRanges);
  } else {
    console.error(sharedPlansListRes.error);
    return <div>Сервис временно недоступен, попробуйте позже</div>;
  }

  return (
    <ContainerMainAside>
      <ContainerMain1>
        <ContainerCalendarsView
          days={days}
          sharedPlansList={sharedPlansListRes.sharedRanges}
        />
      </ContainerMain1>
      <ContainerAside>
        <ContainerRangesUsers
          days={days}
          sharedPlansList={sharedPlansListRes.sharedRanges}
        />
      </ContainerAside>
    </ContainerMainAside>
  );
}
