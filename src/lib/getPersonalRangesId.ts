'use server';

import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function getPersonalRangesId(): Promise<string> {
  let personalRangesId: string = '';
  const session = await getServerSession(authOptions);
  if (session?.user.id) {
    // if session
    const personalRangesRes = await prisma.personalRanges.findUnique({
      where: { userId: session.user.id },
    });
    console.log(
      '🚀 ~ getPersonalRangesId ~ personalRangesRes:',
      personalRangesRes,
    );
    if (personalRangesRes) {
      // if personalRanges found (and session)
      personalRangesId = personalRangesRes.id;
    } else {
      // if personalRanges not found (and session)
      // find personalRanges from cookie
      const cookieStore = await cookies();
      const personalRangesIdFromCookie =
        cookieStore.get('personalRangesId')?.value;
      if (personalRangesIdFromCookie) {
        personalRangesId = personalRangesIdFromCookie;
        // update personalRanges in database
        await prisma.personalRanges.update({
          where: { id: personalRangesId },
          data: { userId: session.user.id },
        });
      }
    }
  } else {
    // if no no session
    const cookieStore = await cookies();
    const personalRangesIdFromCookie =
      cookieStore.get('personalRangesId')?.value;
    console.log(
      '🚀 ~ getPersonalRangesId ~ personalRangesIdFromCookie:',
      personalRangesIdFromCookie,
    );
    if (personalRangesIdFromCookie) {
      personalRangesId = personalRangesIdFromCookie;
    }
  }
  return personalRangesId;
}
