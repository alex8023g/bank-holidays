'use server';

import * as fs from 'fs';
import { Day } from './createDaysArr';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import {
  PersonalRanges,
  PersonalSharedRanges,
  SharedRanges,
  User,
} from '../../generated/prisma';
import { cookies } from 'next/headers';

export async function createPersonalRangesEmpty(): Promise<
  | {
      ok: true;
      personalRanges: PersonalRanges;
    }
  | {
      ok: false;
      error: Error;
    }
> {
  try {
    const personalRanges = await prisma.personalRanges.create({
      data: {
        userId: null,
        rangesJson: JSON.stringify([]),
        userName: '',
      },
    });
    return { ok: true, personalRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function upsertPersonalRanges({
  userId,
  rangesJson,
}: {
  userId: string;
  rangesJson: string;
}) {
  console.log('🚀 ~ createPersonalRanges!!!!! ~ rangesJson:', rangesJson);
  try {
    const personalRanges = await prisma.personalRanges.upsert({
      where: { userId },
      update: { rangesJson },
      create: { userId, rangesJson },
    });
    return { ok: true, personalRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}
export async function updatePersonalRangesById({
  id,
  rangesJson,
}: {
  id: string;
  rangesJson: string;
}) {
  try {
    await prisma.personalRanges.update({
      where: { id },
      data: { rangesJson },
    });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function updatePersonalRangesUserNameById({
  id,
  userName,
}: {
  id: string;
  userName: string;
}) {
  try {
    await prisma.personalRanges.update({
      where: { id },
      data: { userName },
    });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function upsertPersonalRangesNoUser({
  personalRangesId,
  rangesJson,
}: {
  personalRangesId: string;
  rangesJson: string;
}) {
  try {
    const personalRanges = await prisma.personalRanges.upsert({
      where: { id: personalRangesId },
      update: { rangesJson },
      create: { id: personalRangesId, rangesJson },
    });
    return { ok: true, personalRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function upsertPersonalRangesByUserIdOrLsRangesId({
  userId,
  rangesJson,
  lsRangesId,
  userName,
}: {
  userId: string;
  rangesJson: string;
  lsRangesId: string;
  userName: string;
}) {
  try {
    const personalRanges = await prisma.personalRanges.findUnique({
      where: { userId },
    });

    if (personalRanges) {
      const res = await prisma.personalRanges.update({
        where: { id: personalRanges.id },
        data: { rangesJson, userName },
      });
      return { ok: true, personalRanges: res };
    } else {
      const personalRanges2 = await prisma.personalRanges.findUnique({
        where: { id: lsRangesId },
      });

      if (personalRanges2) {
        const res2 = await prisma.personalRanges.update({
          where: { id: personalRanges2.id },
          data: { rangesJson, userId, userName },
        });
        return { ok: true, personalRanges: res2 };
      } else {
        const res3 = await prisma.personalRanges.create({
          data: { userId, rangesJson, userName },
        });
        return { ok: true, personalRanges: res3 };
      }
    }
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function createSharedPersonalRangesNoUser({
  rangesJson,
  sharedRangesId,
  userName,
}: {
  rangesJson: string;
  sharedRangesId: string;
  userName: string;
}) {
  try {
    const personalRanges = await prisma.personalRanges.create({
      data: { rangesJson, userName },
    });
    const sharedRanges = await prisma.sharedRanges.findUnique({
      where: { id: sharedRangesId },
    });
    if (!sharedRanges) {
      return { ok: false, error: new Error('Shared ranges not found') };
    }
    const personalSharedRanges = await prisma.personalSharedRanges.create({
      data: {
        personalRangesId: personalRanges.id,
        sharedRangesId: sharedRanges.id,
      },
    });
    return { ok: true, personalRanges, sharedRanges, personalSharedRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export type GetPersonalRangesRes = {
  ok: boolean;
  rangesJson: string | null;
  id: string;
  userName: string;
  // errorType?:
  //   | 'No personal ranges by userId found'
  //   | 'Error getting personal ranges by userId';
  errorMsg?: string;
};
export async function getPersonalRangesByUserId({
  userId,
}: {
  userId: string;
}): Promise<GetPersonalRangesRes> {
  try {
    const personalRanges = await prisma.personalRanges.findUnique({
      where: { userId },
    });
    if (personalRanges) {
      return {
        ok: true,
        rangesJson: personalRanges.rangesJson as string | null,
        id: personalRanges.id,
        userName: personalRanges.userName,
      };
    } else {
      return {
        ok: false,
        rangesJson: null,
        id: '',
        userName: '',
        // errorType: 'No personal ranges by userId found',
        errorMsg: 'No personal ranges by userId found',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      rangesJson: null,
      id: '',
      userName: '',
      // errorType: 'Error getting personal ranges by userId',
      errorMsg: (error as Error).message,
    };
  }
}

export async function getPersonalRangesByUserId2({
  userId,
}: {
  userId: string;
}): Promise<
  | { status: 'success'; personalRanges: PersonalRanges }
  | { status: 'not found' }
  | { status: 'error'; error: Error }
> {
  try {
    const personalRanges = await prisma.personalRanges.findUnique({
      where: { userId },
    });
    if (personalRanges) {
      return {
        status: 'success',
        personalRanges,
      };
    } else {
      return {
        status: 'not found',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      error: error as Error,
    };
  }
}

export async function getPersonalRangesById({
  id,
}: {
  id: string;
}): Promise<GetPersonalRangesRes> {
  try {
    const personalRanges = await prisma.personalRanges.findUnique({
      where: { id },
    });
    if (personalRanges) {
      return {
        ok: true,
        rangesJson: personalRanges.rangesJson as string | null,
        id: personalRanges.id,
        userName: personalRanges.userName,
      };
    } else {
      return {
        ok: false,
        rangesJson: null,
        id: '',
        userName: '',
        // errorType: 'No personal ranges by userId found',
        errorMsg: 'No personal ranges by userId found',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      rangesJson: null,
      id: '',
      userName: '',
      // errorType: 'Error getting personal ranges by userId',
      // errorMsg: 'Error getting personal ranges by userId',
      errorMsg: (error as Error).message,
    };
  }
}
export async function getPersonalRangesById2({
  id,
}: {
  id: string;
}): Promise<
  | { status: 'success'; personalRanges: PersonalRanges }
  | { status: 'not found' }
  | { status: 'error'; error: Error }
> {
  try {
    const personalRanges = await prisma.personalRanges.findUnique({
      where: { id },
    });
    if (personalRanges) {
      return {
        status: 'success',
        personalRanges,
      };
    } else {
      return {
        status: 'not found',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      error: error as Error,
    };
  }
}

export async function createSharedRanges({
  userId,
  name,
  year,
}: {
  userId: string;
  name: string;
  year: number;
}) {
  console.log('🚀 ~ createSharedRanges ~ name:', name);
  console.log('🚀 ~ createSharedRanges ~ year:', year);
  if (!userId) {
    return {
      ok: false,
      sharedRanges: null,
      error: new Error('userId and planName are required'),
    };
  }
  try {
    const sharedRanges = await prisma.sharedRanges.create({
      data: { ownerUserId: userId, name },
    });
    revalidatePath('/shared');
    return { ok: true, sharedRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, sharedRanges: null, error: error as Error };
  }
}

export type SharedWithPersonalRangesRes =
  | (SharedRanges & {
      personalRanges: ({
        personalRanges: PersonalRanges & {
          user: User | null;
        };
      } & PersonalSharedRanges)[];
    })
  | null;

export async function getSharedRanges({ id }: { id: string | null }): Promise<{
  ok: boolean;
  sharedRangesWithPersonal: SharedWithPersonalRangesRes | null;
  error?: Error;
}> {
  if (!id) {
    return { ok: true, sharedRangesWithPersonal: null };
  }
  try {
    const sharedRangesWithPersonal = await prisma.sharedRanges.findUnique({
      where: { id },
      include: {
        personalRanges: {
          include: {
            personalRanges: { include: { user: true } },
          },
        },
      },
    });
    console.log(
      '🚀 ~ getSharedRanges!! ~ sharedRanges:',
      sharedRangesWithPersonal,
    );
    return { ok: true, sharedRangesWithPersonal };
  } catch (error) {
    console.error(error);
    return { ok: false, sharedRangesWithPersonal: null, error: error as Error };
  }
}

export async function getSharedRangesById({ id }: { id: string }): Promise<
  | {
      status: 'success';
      sharedRanges: SharedRanges;
    }
  | {
      status: 'not found';
    }
  | {
      status: 'error';
      error: Error;
    }
> {
  try {
    const sharedRanges = await prisma.sharedRanges.findUnique({
      where: { id },
    });
    if (sharedRanges) {
      return { status: 'success', sharedRanges };
    } else {
      return { status: 'not found' };
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', error: error as Error };
  }
}

export async function getSharedRangesListByOwnerId({
  userId,
}: {
  userId: string | null;
}) {
  if (!userId) {
    return { ok: true, sharedRanges: [] };
  }
  try {
    const sharedRanges = await prisma.sharedRanges.findMany({
      where: { ownerUserId: userId },
      include: {
        personalRanges: {
          include: {
            personalRanges: { include: { user: true } },
          },
        },
      },
    });
    console.log(
      '🚀 ~ getSharedRangesListByUserId ~ sharedRanges:',
      sharedRanges,
    );
    return { ok: true, sharedRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, sharedRanges: null, error: error as Error };
  }
}

export async function getDays() {
  let fileData = '';

  try {
    fileData = await fs.promises.readFile(
      process.cwd() + '/src/constant/calendars.json',
      'utf8',
    );
  } catch (err) {
    console.error(err);
  }

  const days: Day[] = JSON.parse(fileData);
  return days;
}

export async function sharePersonalRangesByUserId({
  userId,
  sharedRangesId,
}: {
  userId: string;
  sharedRangesId: string;
}) {
  const personalRanges = await prisma.personalRanges.findUnique({
    where: { userId },
  });
  if (!personalRanges) {
    return { ok: false, error: new Error('Personal ranges not found') };
  }
  const sharedRanges = await prisma.sharedRanges.findUnique({
    where: { id: sharedRangesId },
  });
  if (!sharedRanges) {
    return { ok: false, error: new Error('Shared ranges not found') };
  }
  const personalSharedRanges = await prisma.personalSharedRanges.create({
    data: {
      personalRangesId: personalRanges.id,
      sharedRangesId: sharedRanges.id,
    },
  });
  revalidatePath('/shared');
  return { ok: true, personalSharedRanges };
}

export async function sharePersonalRangesByPersonalRangesId({
  personalRangesId,
  sharedRangesId,
}: {
  personalRangesId: string;
  sharedRangesId: string;
}) {
  const personalRanges = await prisma.personalRanges.findUnique({
    where: { id: personalRangesId },
  });
  if (!personalRanges) {
    return { ok: false, error: new Error('Personal ranges not found') };
  }
  const sharedRanges = await prisma.sharedRanges.findUnique({
    where: { id: sharedRangesId },
  });
  if (!sharedRanges) {
    return { ok: false, error: new Error('Shared ranges not found') };
  }

  if (!personalRanges) {
    return { ok: false, error: new Error('Shared ranges not found') };
  }

  const res = await prisma.personalSharedRanges.upsert({
    where: {
      personalRangesId_sharedRangesId: { personalRangesId, sharedRangesId },
    },
    update: { sharedRangesId },
    create: { personalRangesId, sharedRangesId },
  });

  revalidatePath('/shared');
  return { ok: true, res };
}

export async function deletePersonalSharedRangesByPersonalRangesId({
  personalRangesId,
}: {
  personalRangesId: string;
}) {
  try {
    await prisma.personalSharedRanges.deleteMany({
      where: { personalRangesId },
    });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function deletePersSharRangByPersSharRangIds({
  personalRangesId,
  sharedRangesId,
}: {
  personalRangesId: string;
  sharedRangesId: string;
}) {
  try {
    await prisma.personalSharedRanges.delete({
      where: {
        personalRangesId_sharedRangesId: { personalRangesId, sharedRangesId },
      },
    });
    revalidatePath('/shared');
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function deleteSharedRangesById({ id }: { id: string }) {
  try {
    await prisma.personalSharedRanges.deleteMany({
      where: { sharedRangesId: id },
    });
    await prisma.sharedRanges.delete({ where: { id } });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function setCookiePersonalRangesId({
  personalRangesId,
}: {
  personalRangesId: string;
}) {
  const cookieStore = await cookies();
  cookieStore.set('personalRangesId', personalRangesId, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 36500), // 36500 days
  });
  // revalidatePath('/');
  return { ok: true };
}

export async function deleteCookiePersonalRangesId() {
  const cookieStore = await cookies();
  cookieStore.delete('personalRangesId');
  revalidatePath('/');
  return { ok: true };
}

export type SharedPlansListByPersPlanId = {
  sharedRanges: SharedRanges;
  personalRangesList: ({
    personalRanges: PersonalRanges;
  } & PersonalSharedRanges)[];
};

export async function getSharedPlansListByPersPlanId({
  personalRangesId,
}: {
  personalRangesId: string;
}): Promise<
  | {
      ok: true;
      sharedRanges: SharedPlansListByPersPlanId[];
    }
  | {
      ok: false;
      error: Error;
    }
> {
  try {
    const sharedRanges = await prisma.personalSharedRanges.findMany({
      where: { personalRangesId },
      include: {
        sharedRanges: true,
      },
    });

    const res = await Promise.all(
      sharedRanges.map(async (sharedRange) => {
        const personalRangesList = await prisma.personalSharedRanges.findMany({
          where: { sharedRangesId: sharedRange.sharedRangesId },
          include: {
            personalRanges: true,
          },
        });
        return {
          sharedRanges: sharedRange.sharedRanges,
          personalRangesList: personalRangesList.filter(
            (personalRange) =>
              personalRange.personalRangesId !== personalRangesId,
          ),
        };
      }),
    );

    console.dir(res, { depth: 9 });
    return { ok: true, sharedRanges: res };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function getPersonalSharedRangesByPersonalSharedIds({
  personalRangesId,
  sharedRangesId,
}: {
  personalRangesId: string;
  sharedRangesId: string;
}): Promise<
  | {
      status: 'success';
      personalSharedRanges: PersonalSharedRanges;
    }
  | {
      status: 'not found';
    }
  | {
      status: 'error';
      error: Error;
    }
> {
  try {
    const personalSharedRanges = await prisma.personalSharedRanges.findUnique({
      where: {
        personalRangesId_sharedRangesId: { personalRangesId, sharedRangesId },
      },
    });
    if (personalSharedRanges) {
      return { status: 'success', personalSharedRanges };
    } else {
      return { status: 'not found' };
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', error: error as Error };
  }
}

export async function createPersonalSharedRangesByTwoIds({
  personalRangesId,
  sharedRangesId,
}: {
  personalRangesId: string;
  sharedRangesId: string;
}) {
  const personalRanges = await prisma.personalRanges.findUnique({
    where: { id: personalRangesId },
  });
  if (!personalRanges) {
    return { ok: false, error: new Error('Personal ranges not found') };
  }
  const sharedRanges = await prisma.sharedRanges.findUnique({
    where: { id: sharedRangesId },
  });
  if (!sharedRanges) {
    return { ok: false, error: new Error('Shared ranges not found') };
  }
  const personalSharedRanges = await prisma.personalSharedRanges.create({
    data: {
      personalRangesId: personalRanges.id,
      sharedRangesId: sharedRanges.id,
    },
  });
  // revalidatePath('/shared');
  return { ok: true, personalSharedRanges };
}
