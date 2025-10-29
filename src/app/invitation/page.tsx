import { SharedPlanInvitationDialog2 } from '@/components/SharedPlanInvitationDialog2';
import {
  getPersonalRangesById2,
  getPersonalSharedRangesByPersonalSharedIds,
  getSharedRangesById,
} from '@/lib/actions';
import { redirect } from 'next/navigation';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';
import { getPersonalRangesId } from '@/lib/getPersonalRangesId';

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
  console.log('🚀 ~ InvitationPage ~ sharedRangesRes:', sharedRangesRes);
  if (sharedRangesRes.status === 'not found') {
    errorMsg = 'shared ranges not found';
    return <div>Error: Shared ranges not found</div>;
  } else if (sharedRangesRes.status === 'error') {
    errorMsg = 'error';
    return <div>Error: {sharedRangesRes.error.message}</div>;
  }

  /*   const res = await findOrCreatePersonalRanges();
  if (!res.ok) {
    return <div>Error: {res.errorMsg}</div>;
  } */

  const personalRangesId = await getPersonalRangesId();

  const personalRangesRes = await getPersonalRangesById2({
    id: personalRangesId,
  });
  console.log('🚀 ~ InvitationPage ~ personalRangesRes:', personalRangesRes);

  if (personalRangesRes.status === 'not found') {
    return <div>Error: Personal ranges not found</div>;
  }
  if (personalRangesRes.status === 'error') {
    return <div>Error: {personalRangesRes.error.message}</div>;
  }

  return (
    <div className='flex h-full flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <main className='h-2/3 overflow-y-scroll bg-gray-100 p-5 xl:flex xl:h-full xl:flex-1'>
        <div>InvitationPage</div>
        {sharedRangesId && (
          <SharedPlanInvitationDialog2
            sharedRangesId={sharedRangesId}
            sharedRangesName={sharedRangesRes.sharedRanges.name}
            personalRangesId={personalRangesId}
            personalRangesUserName={personalRangesRes.personalRanges.userName}
            errorMsg={errorMsg}
          />
        )}
      </main>
    </div>
  );
}
