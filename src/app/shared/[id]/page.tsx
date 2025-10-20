import { CalendarYearVertical2 } from '@/components/CalendarYearVertical2';
import {
  getDays,
  getSharedRanges,
  getSharedRangesListByUserId,
} from '@/lib/actions';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function SharedPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const sharedRanges = await getSharedRanges({ id });
  const days = await getDays();
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return <div>You are not authorized to view this page</div>;
  }
  const sharedRangesRes = await getSharedRangesListByUserId({
    userId: session?.user.id || null,
  });
  const sharedRangesData = sharedRangesRes.sharedRanges?.find(
    (sharedRange) => sharedRange.id === id,
  );
  return (
    <div className='px-2 py-2'>
      <div>SharedPage {id}</div>
      {sharedRangesData && (
        <CalendarYearVertical2
          days={days}
          year={sharedRanges.sharedRangesWithPersonal?.year || 0}
          session={session}
          sharedRangesData={sharedRangesData}
        />
      )}
    </div>
  );
}
