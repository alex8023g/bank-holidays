'use server';

import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function getPersonalRangesId(): Promise<string> {
  let personalRangesId: string = '';
  const session = await getServerSession(authOptions);
  if (session?.user.id) {
    const personalRangesRes = await prisma.personalRanges.findUnique({
      where: { userId: session.user.id },
    });
    if (personalRangesRes) {
      personalRangesId = personalRangesRes.id;
    }
  } else {
    const cookieStore = await cookies();
    const personalRangesIdFromCookie =
      cookieStore.get('personalRangesId')?.value;
    if (personalRangesIdFromCookie) {
      personalRangesId = personalRangesIdFromCookie;
    }
  }
  return personalRangesId;
}
