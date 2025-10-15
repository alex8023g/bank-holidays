import { CalendarsBlock } from '@/components/CalendarsBlock';
import ResultBlock from '@/components/ResultBlock';
import { getDays } from '@/lib/actions';
import { SharedPlanInvitationDialog } from '@/components/SharedPlanInvitationDialog';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

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
    <div className='flex flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <CalendarsBlock days={days} />
      <ResultBlock days={days} />
      {sharedplaninvitation && (
        <SharedPlanInvitationDialog
          session={session}
          sharedRangesId={sharedplaninvitation}
        />
      )}
    </div>
  );
}
