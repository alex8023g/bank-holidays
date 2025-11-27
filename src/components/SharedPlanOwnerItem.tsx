'use client';
import Link from 'next/link';
import { BtnCopyInvitationLink } from './BtnCopyInvitationLink';
import { Divider } from './catalist/divider';
import { SharedPlanItemMenu } from './SharedPlanItemMenu';
import { JsonValue } from '@prisma/client/runtime/client';
import { Switch } from './catalist/switch';
import { useState } from 'react';
import { Button } from './catalist/button';

export function SharedPlanOwnerItem({
  sharedPlanItem,
  personalRangesId,
}: {
  sharedPlanItem: {
    personalRanges: {
      personalRanges: {
        id: string;
        userId: string | null;
        rangesJson: JsonValue;
        userName: string;
        updatedAt: Date;
        user: {
          id: string;
          name: string | null;
          email: string | null;
          emailVerified: Date | null;
          image: string | null;
        } | null;
      };
      personalRangesId: string;
      sharedRangesId: string;
    }[];
    id: string;
    name: string;
    ownerUserId: string;
  };
  personalRangesId: string;
}) {
  const [showMyPlan, setShowMyPlan] = useState<boolean>(
    sharedPlanItem.personalRanges.some(
      (personalRange) => personalRange.personalRangesId === personalRangesId,
    ),
  );
  const isMyPlanShared = sharedPlanItem.personalRanges.some(
    (personalRange) => personalRange.personalRangesId === personalRangesId,
  );
  return (
    <li
      key={sharedPlanItem.id}
      className='mb-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md'
    >
      <div className='flex items-center justify-between'>
        {/* <span className='font-semibold'>название:</span> */}
        <span className='text-lg font-semibold'>{sharedPlanItem.name}</span>

        <SharedPlanItemMenu
          sharedRanges={sharedPlanItem}
          isMyPlanShared={isMyPlanShared}
          personalRangesId={personalRangesId}
        />
      </div>
      <Divider className='my-2' />
      <div className='mb-2 flex gap-2'>
        <span className='font-semibold'>количество участников:</span>
        <span>{sharedPlanItem.personalRanges.length}</span>
      </div>

      <div className='mb-2 flex gap-2'>
        <span className='font-semibold'>ссылка для приглашения:</span>
        <BtnCopyInvitationLink
          link={`${process.env.NEXT_PUBLIC_APP_URL}/invitation?sharedRangesId=${sharedPlanItem.id}`}
        />
      </div>
      {/* <div>
        {' '}
        Участники
        {isMyPlanShared ? '' : ' НЕ '} видят мой план отпусков
      </div> */}
      {/* <div className='flex items-center gap-2'>
        <span className='font-semibold'>
          показать мой план отпусков участникам:
        </span>
        <Switch checked={showMyPlan} onChange={() => {}} />
      </div> */}
      {/* <Button>Добавить свой график отпусков в общий график</Button>
      <Button>Добавить свой график отпусков</Button>
      <Button>Удалить свой график отпусков </Button> */}
      <div>
        <Link href={`/shared/${sharedPlanItem.id}`}>{'перейти ->'}</Link>
      </div>
      {/* <Link href={`/shared/ids=[${sharedPagesItem.id}]`}>
                    {'перейти ->'}
                  </Link> */}
    </li>
  );
}
