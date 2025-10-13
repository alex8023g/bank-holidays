import ResultBlock from '@/components/ResultBlock';
import { VerticalYear } from '@/components/VerticalYear';
import { getDays, getSharedRanges } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function RowCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{
    year: string | undefined;
    sharedplan: string | undefined;
  }>;
}) {
  const { year, sharedplan } = await searchParams;

  if (!year) {
    redirect('/rowcalendar?year=' + new Date().getFullYear().toString());
  }

  const days = await getDays();

  const sharedRanges = await getSharedRanges({ id: sharedplan || null });
  console.dir(sharedRanges, { depth: Infinity });
  const personalRanges =
    sharedRanges.sharedRanges?.personalRanges.map(
      (range) => range.personalRanges,
    ) || [];
  console.log('🚀 ~ RowCalendarPage ~ personalRanges:', personalRanges);

  return (
    <div className='px-2 py-2'>
      <div>RowCalendarPage</div>
      <VerticalYear days={days} year={year} personalRanges={personalRanges} />
    </div>
  );
}
