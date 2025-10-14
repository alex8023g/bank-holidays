import { Button } from '@/components/catalist/button';
import { SharePersonPlanBtn } from '@/components/SharePersonPlanBtn';
import { VerticalYear } from '@/components/VerticalYear';
import { getDays, getSharedRanges } from '@/lib/actions';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function RowCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{
    year: string | undefined;
    sharedplan: string | undefined;
  }>;
}) {
  const { /* year, */ sharedplan } = await searchParams;
  const session = await getServerSession(authOptions);

  const days = await getDays();

  const sharedRangesRes = await getSharedRanges({ id: sharedplan || null });
  console.dir(sharedRangesRes, { depth: Infinity });
  if (!sharedRangesRes.sharedRanges) {
    return <div>Shared plan not found</div>;
  }
  const personalRanges =
    sharedRangesRes.sharedRanges?.personalRanges.map(
      (range) => range.personalRanges,
    ) || [];
  console.log('🚀 ~ RowCalendarPage ~ personalRanges:', personalRanges);

  return (
    <div className='px-2 py-2'>
      <div>RowCalendarPage</div>
      <h2>
        {sharedRangesRes.sharedRanges.name} на{' '}
        {sharedRangesRes.sharedRanges.year} год
      </h2>
      <SharePersonPlanBtn
        userId={session?.user.id}
        sharedRangesId={sharedRangesRes.sharedRanges.id}
      />
      <VerticalYear
        days={days}
        year={sharedRangesRes.sharedRanges.year}
        personalRanges={personalRanges}
      />
    </div>
  );
}
