import { BtnCopyInvitationLink2 } from '@/components/BtnCopyInvitationLink2';
import { CalendarYearVertical3 } from '@/components/CalendarYearVertical3';
import { ContainerAside } from '@/components/ContainerAside';
import { ContainerClientProviderVH } from '@/components/ContainerClientProviderVH';
import { ContainerMain1 } from '@/components/ContainerMain1';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import { ParticipantsSharedPlansList } from '@/components/ParticipantsSharedPlansList';
import {
  getDays,
  getSharedPlansListByPersPlanId,
  getSharedRangesById,
  getSharedRangesListByOwnerId,
} from '@/lib/actions';
import { authOptions } from '@/lib/auth';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';
import { getPersonalRangesId } from '@/lib/getPersonalRangesId';
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

  // *************************************************************
  const sharedRangesRes2 = await getSharedRangesById({ id });
  if (sharedRangesRes2.status === 'not found') {
    return <div>Gemeinsamer Plan nicht gefunden</div>;
  } else if (sharedRangesRes2.status === 'error') {
    return <div>Der Dienst ist vorübergehend nicht verfügbar, bitte versuchen Sie es später erneut</div>;
  }
  const sharedRanges = sharedRangesRes2.sharedRanges;
  const personalRangesList = await prisma.personalSharedRanges.findMany({
    where: { sharedRangesId: id },
    include: {
      personalRanges: true,
    },
  });

  // *************************************************************

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
    return <div>Der Dienst ist vorübergehend nicht verfügbar, bitte versuchen Sie es später erneut</div>;
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
          <div className='mb-2 rounded-lg border p-5 text-gray-500'>
            Laden Sie andere Teilnehmer zum gemeinsamen Urlaubsplan per {''}
            <BtnCopyInvitationLink2
              link={`${process.env.NEXT_PUBLIC_APP_URL}/invitation?sharedRangesId=${id}`}
              text='Link'
              className='inline'
            />{' '}
            ein
          </div>
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
    </ContainerClientProviderVH>
  );
}
