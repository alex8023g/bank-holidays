'use client';

import { useSearchParams } from 'next/navigation';
import { getSharedRanges } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { SharedRanges } from '../../generated/prisma';

export function SharedPlansBlock() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [sharedRanges, setSharedRanges] = useState<SharedRanges | null>(null);
  useEffect(() => {
    (async () => {
      if (id) {
        const { sharedRanges } = await getSharedRanges({ id });
        console.log('🚀 ~ SharedPlansBlock ~ sharedRanges:', sharedRanges);
        if (!sharedRanges) {
          setSharedRanges(null);
        } else {
          setSharedRanges(sharedRanges);
        }
      }
    })();
  }, [id]);

  return (
    <div className='/z-10 flex h-1/3 flex-col overflow-y-hidden rounded-lg bg-white px-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:mx-auto md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
      <div>SharedPlansBlock</div>
      <div>{JSON.stringify(sharedRanges)}</div>
    </div>
  );
}
