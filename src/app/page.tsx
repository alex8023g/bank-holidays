import { CalendarYearClassic } from '@/components/CalendarYearClassic';
import { getDays } from '@/lib/actions';
import { SharedPlanInvitationDialog } from '@/components/SharedPlanInvitationDialog';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import { ContainerMain1 } from '@/components/ContainerMain1';
import { ContainerAside } from '@/components/ContainerAside';
import ContainerRangesUsers from '@/components/ContainerRangesUsers';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    sharedplaninvitation: string | undefined;
  }>;
}) {
  const { sharedplaninvitation } = await searchParams;
  console.log('🚀 ~ HomePage ~ sharedplaninvitation:', sharedplaninvitation);

  const days = await getDays();
  const session = await getServerSession(authOptions);

  return (
    // <div className='flex flex-col overflow-y-hidden bg-gray-100 xl:flex-row'> //
    <ContainerMainAside>
      <ContainerMain1>
        <CalendarYearClassic days={days} session={session} />
      </ContainerMain1>
      <ContainerAside>
        <ContainerRangesUsers days={days} />
        {/* <div className='h-full border border-red-500'>
          <h2>ResultBlock</h2>
        </div> */}
      </ContainerAside>
      {sharedplaninvitation && (
        <SharedPlanInvitationDialog
          session={session}
          sharedRangesId={sharedplaninvitation}
        />
      )}
    </ContainerMainAside>
    // </div> //
  );
}
