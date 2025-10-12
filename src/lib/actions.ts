'use server';

import { prisma } from './prisma';

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

export async function createSharedRanges({ userId }: { userId: string }) {
  try {
    const sharedRanges = await prisma.sharedRanges.create({
      data: { ownerUserId: userId },
    });
    return { ok: true, sharedRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, sharedRanges: null, error: error as Error };
  }
}

export async function getSharedRanges({ id }: { id: string }) {
  try {
    const sharedRanges = await prisma.sharedRanges.findFirst({
      where: { id },
      include: {
        personalRanges: {
          include: {
            personalRanges: true,
          },
        },
      },
    });
    return { ok: true, sharedRanges };
  } catch (error) {
    console.error(error);
    return { ok: false, sharedRanges: null, error: error as Error };
  }
}
