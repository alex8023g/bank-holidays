import {
  getDays,
  getSharedPlansListByPersPlanId,
  SharedPlansListByPersPlanId,
} from '@/lib/actions';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import { ContainerMain1 } from '@/components/ContainerMain1';
import { ContainerAside } from '@/components/ContainerAside';
import ContainerRangesUsers from '@/components/ContainerRangesUsers';
import { ContainerCalendarsView } from '@/components/ContainerCalendarsView';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getPersonalRangesId } from '@/lib/getPersonalRangesId';
import { ContainerClientProviderVH } from '@/components/ContainerClientProviderVH';
import Header2 from '@/components/Header2';

export default async function HomePage() {
  console.log('🚀 ~ HomePage ~ start');

  const days = await getDays();

  // const res = await findOrCreatePersonalRanges({ whereUsed: 'HomePage' });
  // if (!res.ok) {
  //   return <div>Error: {res.errorMsg}</div>;
  // }
  // const { personalRangesId, session } = res;

  /*   let personalRangesId: string = '';

  const session = await getServerSession(authOptions);
  if (session?.user.id) {
    const personalRangesRes = await prisma.personalRanges.findUnique({
      where: { userId: session.user.id },
    });
    if (personalRangesRes) {
      personalRangesId = personalRangesRes.id;
    }
  } else {
    const cookieStore = await cookies();
    const personalRangesIdFromCookie =
      cookieStore.get('personalRangesId')?.value;
    if (personalRangesIdFromCookie) {
      personalRangesId = personalRangesIdFromCookie;
    }
  } */

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

  // await new Promise((resolve) => setTimeout(resolve, 10000));
  return (
    <ContainerClientProviderVH
      session={res.session}
      personalRangesId={res.personalRangesId}
      personalRangesName={res.personalRanges.userName}
      personalRangesIdFromCookie={res.personalRangesIdFromCookie}
      personalRanges={res.personalRanges}
    >
      {/* <Header2 session={res.session} /> */}
      <ContainerMainAside>
        <ContainerMain1>
          <ContainerCalendarsView
            days={days}
            sharedPlansList={sharedPlansList}
          />
        </ContainerMain1>
        {/* <ContainerAside> */}
        <ContainerRangesUsers days={days} sharedPlansList={sharedPlansList} />
        {/* </ContainerAside> */}
      </ContainerMainAside>
    </ContainerClientProviderVH>
  );
}
