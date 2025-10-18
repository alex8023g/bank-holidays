import { CalendarYearClassic } from '@/components/CalendarYearClassic';
import { getDays } from '@/lib/actions';
import { SharedPlanInvitationDialog } from '@/components/SharedPlanInvitationDialog';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import { ContainerMain1 } from '@/components/ContainerMain1';
import { ContainerAside } from '@/components/ContainerAside';
import ContainerRangesUsers from '@/components/ContainerRangesUsers';
import { ContainerCalendarsView } from '@/components/ContainerCalendarsView';

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
    <ContainerMainAside>
      <ContainerMain1>
        <ContainerCalendarsView days={days} session={session} />
      </ContainerMain1>
      <ContainerAside>
        <ContainerRangesUsers days={days} />
      </ContainerAside>
      {sharedplaninvitation && (
        <SharedPlanInvitationDialog
          session={session}
          sharedRangesId={sharedplaninvitation}
        />
      )}
    </ContainerMainAside>
  );
}
