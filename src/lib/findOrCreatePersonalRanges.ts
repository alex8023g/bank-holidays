'use server';

import { cookies } from 'next/headers';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from './auth';
import {
  createPersonalRangesEmpty,
  getPersonalRangesById2,
  getPersonalRangesByUserId2,
} from './actions';
import { PersonalRanges } from '../../generated/prisma/client';

export async function findOrCreatePersonalRanges(): Promise<
  | {
      ok: true;
      personalRangesId: string;
      personalRanges: PersonalRanges;
      personalRangesIdFromCookie: string | undefined;
      session: Session | null;
    }
  | {
      ok: false;
      errorMsg: string;
    }
> {
  let personalRangesId: string | undefined = undefined;
  let personalRanges: PersonalRanges | undefined = undefined;

  const cookieStore = await cookies();

  const personalRangesIdFromCookie = cookieStore.get('personalRangesId')?.value;
  console.log('🚀 ~ personalRangesIdFromCookie:', personalRangesIdFromCookie);

  const session = await getServerSession(authOptions);

  let personalRangesIdFromSession: string | undefined = undefined;

  if (session?.user.id) {
    console.log('🚀 ~ 1');
    const personalRangesRes = await getPersonalRangesByUserId2({
      userId: session.user.id,
    });

    if (personalRangesRes.status === 'success') {
      console.log('🚀 ~ 2');
      personalRangesIdFromSession = personalRangesRes.personalRanges.id;
      personalRanges = personalRangesRes.personalRanges;
    } else if (personalRangesRes.status === 'not found') {
      console.log('🚀 ~ 3');
      personalRangesIdFromSession = undefined;
    } else if (personalRangesRes.status === 'error') {
      console.log('🚀 ~ 4');
      console.error(personalRangesRes.error);
      return { ok: false, errorMsg: 'Сервис временно недоступен' };
    }
  }

  if (personalRangesIdFromSession) {
    console.log('🚀 ~ 5');
    personalRangesId = personalRangesIdFromSession;
  } else if (personalRangesIdFromCookie) {
    console.log('🚀 ~ 6');
    personalRangesId = personalRangesIdFromCookie;
    const personalRangesRes = await getPersonalRangesById2({
      id: personalRangesIdFromCookie,
    });
    if (personalRangesRes.status === 'success') {
      console.log('🚀 ~ 7');
      personalRanges = personalRangesRes.personalRanges;
    } else if (personalRangesRes.status === 'not found') {
      console.log('🚀 ~ 8');
      const res = await createPersonalRangesEmpty();
      if (res.ok) {
        console.log('🚀 ~ 9');
        personalRangesId = res.personalRanges.id;
        personalRanges = res.personalRanges;
      } else {
        return { ok: false, errorMsg: 'Сервис временно недоступен' };
      }
    } else if (personalRangesRes.status === 'error') {
      console.error(personalRangesRes.error);
      return { ok: false, errorMsg: 'Сервис временно недоступен' };
    }
  } else {
    console.log('🚀 ~ 10');
    const res = await createPersonalRangesEmpty();
    if (res.ok) {
      console.log('🚀 ~ 11');
      personalRangesId = res.personalRanges.id;
      personalRanges = res.personalRanges;
    } else {
      return { ok: false, errorMsg: 'Сервис временно недоступен' };
    }
  }

  if (!personalRanges) {
    console.log('🚀 ~ 12');
    return {
      ok: false,
      errorMsg: 'Необработанная ситуация: персональный план не создан',
    };
  }

  return {
    ok: true,
    personalRangesId,
    personalRanges,
    personalRangesIdFromCookie,
    session,
  };
}
