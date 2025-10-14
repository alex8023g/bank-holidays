'use server';

import * as fs from 'fs';
import { Day } from './createDaysArr';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

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

export async function upsertPersonalRangesNoUser({
  rangesJson,
  personalRangesId,
}: {
  rangesJson: string;
  personalRangesId: string;
}) {
  console.log(
    '🚀 ~ upsertPersonalRangesNoUser ~ personalRangesId:',
    personalRangesId,
  );
  console.log('🚀 ~ upsertPersonalRangesNoUser ~ rangesJson:', rangesJson);
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

export async function createSharePersonalRangesNoUser({
  rangesJson,
  sharedRangesId,
}: {
  rangesJson: string;
  sharedRangesId: string;
}) {
  try {
    const personalRanges = await prisma.personalRanges.create({
      data: { rangesJson },
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
    return { ok: true, personalRanges, personalSharedRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, error: error as Error };
  }
}

export async function getPersonalRanges({
  userId,
}: {
  userId: string;
}): Promise<{
  ok: boolean;
  rangesJson: string | null;
  error: Error | null;
}> {
  try {
    const personalRanges = await prisma.personalRanges.findFirst({
      where: { userId },
    });
    return {
      ok: true,
      rangesJson: personalRanges?.rangesJson as string | null,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return { ok: false, rangesJson: null, error: error as Error };
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
      data: { ownerUserId: userId, name, year },
    });
    revalidatePath('/shared');
    return { ok: true, sharedRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, sharedRanges: null, error: error as Error };
  }
}

export async function getSharedRanges({ id }: { id: string | null }) {
  if (!id) {
    return { ok: true, sharedRanges: null };
  }
  try {
    const sharedRanges = await prisma.sharedRanges.findFirst({
      where: { id },
      include: {
        personalRanges: {
          include: {
            personalRanges: { include: { user: true } },
          },
        },
      },
    });
    console.log('🚀 ~ getSharedRanges ~ sharedRanges:', sharedRanges);
    return { ok: true, sharedRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, sharedRanges: null, error: error as Error };
  }
}
export async function getSharedRangesListByUserId({
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
    console.log('🚀 ~ getSharedRanges ~ sharedRanges:', sharedRanges);
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

export async function sharePersonalRanges({
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
  revalidatePath('/rowcalendar');
  return { ok: true, personalSharedRanges };
}
