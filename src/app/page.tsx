import { getDays } from '@/lib/actions';
import { SharedPlanInvitationDialog } from '@/components/SharedPlanInvitationDialog';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import { ContainerMain1 } from '@/components/ContainerMain1';
import { ContainerAside } from '@/components/ContainerAside';
import ContainerRangesUsers from '@/components/ContainerRangesUsers';
import { ContainerCalendarsView } from '@/components/ContainerCalendarsView';
import { cookies } from 'next/headers';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    sharedplaninvitation: string | undefined;
  }>;
}) {
  const { sharedplaninvitation } = await searchParams;

  const days = await getDays();
  const session = await getServerSession(authOptions);

  const cookieStore = await cookies();
  const personalRangesId = cookieStore.get('personalRangesId')?.value;

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
