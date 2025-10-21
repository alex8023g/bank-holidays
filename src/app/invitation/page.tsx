import { SharedPlanInvitationDialog2 } from '@/components/SharedPlanInvitationDialog2';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getPersonalSharedRangesByPersonalSharedIds,
  getSharedRangesById,
} from '@/lib/actions';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';

export default async function InvitationPage({
  searchParams,
}: {
  searchParams: Promise<{
    sharedRangesId: string | undefined;
  }>;
}) {
  const {
    sharedRangesId,
  }: {
    sharedRangesId: string | undefined;
  } = await searchParams;

  let errorMsg: 'shared ranges not found' | 'error' | null = null;

  const sharedRangesRes = await getSharedRangesById({
    id: sharedRangesId || '',
  });
  if (sharedRangesRes.status === 'not found') {
    errorMsg = 'shared ranges not found';
  } else if (sharedRangesRes.status === 'error') {
    errorMsg = 'error';
  }

  const res = await findOrCreatePersonalRanges();
  if (!res.ok) {
    return <div>Error: {res.errorMsg}</div>;
  }

  const personalSharedRangesRes =
    await getPersonalSharedRangesByPersonalSharedIds({
      personalRangesId: res.personalRangesId,
      sharedRangesId: sharedRangesId || '',
    });
  if (personalSharedRangesRes.status === 'success') {
    redirect('/');
  }
  return (
    <div className='flex h-full flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <main className='h-2/3 overflow-y-scroll bg-gray-100 p-5 xl:flex xl:h-full xl:flex-1'>
        <div>InvitationPage</div>
        {sharedRangesId && (
          <SharedPlanInvitationDialog2
            sharedRangesId={sharedRangesId}
            personalRanges={res.personalRanges}
            errorMsg={errorMsg}
          />
        )}
      </main>
    </div>
  );
}
