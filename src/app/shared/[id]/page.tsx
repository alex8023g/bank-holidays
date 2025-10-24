import { CalendarYearVertical2 } from '@/components/CalendarYearVertical2';
import { CalendarYearVertical3 } from '@/components/CalendarYearVertical3';
import { ContainerAside } from '@/components/ContainerAside';
import { ContainerMain1 } from '@/components/ContainerMain1';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import ContainerRangesUsers from '@/components/ContainerRangesUsers';
import { ParticipantsSharedPlansList } from '@/components/ParticipantsSharedPlansList';
import {
  getDays,
  getSharedRanges,
  getSharedRangesById,
  getSharedRangesListByOwnerId,
} from '@/lib/actions';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export default async function SharedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const days = await getDays();
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return <div>You are not authorized to view this page</div>;
  }
  const sharedRangesRes = await getSharedRangesListByOwnerId({
    userId: session?.user.id || null,
  });
  const sharedRangesData = sharedRangesRes.sharedRanges?.find(
    (sharedRange) => sharedRange.id === id,
  );
  // *************************************************************
  const sharedRangesRes2 = await getSharedRangesById({ id });
  if (sharedRangesRes2.status === 'not found') {
    return <div>Общий график не найден</div>;
  } else if (sharedRangesRes2.status === 'error') {
    return <div>Сервис временно недоступен, попробуйте позже</div>;
  }
  const sharedRanges = sharedRangesRes2.sharedRanges;
  const personalRangesList = await prisma.personalSharedRanges.findMany({
    where: { sharedRangesId: id },
    include: {
      personalRanges: true,
    },
  });

  return (
    <>
      <ContainerMainAside>
        <ContainerMain1>
          <CalendarYearVertical3
            days={days}
            // year={ctx.selectedYear}
            sharedPlansList={[{ sharedRanges, personalRangesList }]}
          />
        </ContainerMain1>
        <ContainerAside>
          {/*   <ContainerRangesUsers
            days={days}
            sharedPlansList={[{ sharedRanges, personalRangesList }]}
          /> */}
          <ParticipantsSharedPlansList
            activeBtn={'users'}
            sharedPlansList={[{ sharedRanges, personalRangesList }]}
          />
        </ContainerAside>
      </ContainerMainAside>
      {/*       <div className='px-2 py-2'>
        <div>SharedPage {id}</div>
        {sharedRangesData && (
          <CalendarYearVertical2
            days={days}
            sharedRangesData={sharedRangesData}
          />
        )}
      </div> */}
    </>
  );
}
