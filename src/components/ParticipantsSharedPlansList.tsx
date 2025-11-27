'use client';
import { useContext } from 'react';
import { ThemeContext } from './ContainerClientProviderVH';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { twJoin } from 'tailwind-merge';
import { RangesUsersBtn } from './ContainerRangesUsers';
import { SharedPlansListByPersPlanId } from '@/lib/actions';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BtnCopyInvitationLink2 } from './BtnCopyInvitationLink2';

export function ParticipantsSharedPlansList({
  activeBtn,
  sharedPlansList,
}: {
  activeBtn: RangesUsersBtn;
  sharedPlansList: SharedPlansListByPersPlanId[];
}) {
  const ctx = useContext(ThemeContext);
  const pathname = usePathname();

  return (
    <>
      {/* <div
       className={twJoin(
         '/border-gray-400 /md:border w-full overflow-y-hidden rounded-lg md:flex md:w-1/2 md:flex-col xl:h-1/2 xl:w-full',
         activeBtn === 'users' ? 'flex flex-col' : 'hidden',
       )}
     > */}
      {!pathname.includes('shared') && (
        <div className='flex items-center justify-center pt-1 md:py-2 md:pb-2 md:shadow-sm'>
          <h2 className='pl-2 text-center font-semibold'>Общие планы:</h2>
        </div>
      )}
      {sharedPlansList.length > 0 ? (
        <ul className='h-full overflow-y-scroll p-2 pt-0.5 md:p-2'>
          {sharedPlansList.map((sharedPlan) => (
            <li key={sharedPlan.sharedRanges.id} className=''>
              <button
                className='flex cursor-pointer items-center gap-2'
                onClick={() =>
                  ctx?.setHiddenRangesIds((prev) =>
                    sharedPlan.personalRangesList.every((personalRange) =>
                      prev.includes(personalRange.personalRanges.id),
                    )
                      ? prev.filter(
                          (id) =>
                            !sharedPlan.personalRangesList.some(
                              (personalRange) =>
                                personalRange.personalRanges.id === id,
                            ),
                        )
                      : [
                          ...prev,
                          ...sharedPlan.personalRangesList.map(
                            (personalRange) => personalRange.personalRanges.id,
                          ),
                        ],
                  )
                }
              >
                {
                  // ctx?.hiddenSharedPlansIds.includes(
                  //   sharedPlan.sharedRanges.id,
                  sharedPlan.personalRangesList.every((personalRange) =>
                    ctx?.hiddenRangesIds.includes(
                      personalRange.personalRanges.id,
                    ),
                  ) ? (
                    <EyeSlashIcon className='h-4 w-4 text-gray-400' />
                  ) : (
                    <EyeIcon className='h-4 w-4 text-gray-400' />
                  )
                }

                <span className='font-semibold'>
                  {sharedPlan.sharedRanges.name}
                </span>
              </button>

              <ul className='pl-5'>
                {sharedPlan.personalRangesList.map((personalRange) => (
                  <li
                    key={personalRange.personalRanges.id}
                    className='flex cursor-pointer items-center gap-2'
                    onClick={() => {
                      ctx?.setHiddenRangesIds((prev) => {
                        if (prev.includes(personalRange.personalRanges.id)) {
                          return (
                            prev.filter(
                              (id) => id !== personalRange.personalRanges.id,
                            ) || []
                          );
                        } else {
                          return [...prev, personalRange.personalRanges.id];
                        }
                      });
                    }}
                  >
                    {ctx?.hiddenRangesIds.includes(
                      personalRange.personalRanges.id,
                    ) ? (
                      <EyeSlashIcon className='h-4 w-4 text-gray-400' />
                    ) : (
                      <EyeIcon className='h-4 w-4 text-gray-400' />
                    )}
                    <span className='text-gray-500'>
                      {personalRange.personalRanges.userName}
                    </span>
                  </li>
                ))}
                <li className='pl-2 text-sm text-gray-500'>
                  пригласить участников по{' '}
                  <BtnCopyInvitationLink2
                    link={`${process.env.NEXT_PUBLIC_APP_URL}/invitation?sharedRangesId=${sharedPlan.sharedRanges.id}`}
                    text='ссылке'
                    className='inline'
                  />
                </li>
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <div className='flex h-full flex-col items-center justify-center pt-1 md:py-2 md:pb-2 md:shadow-sm'>
          <span className='mb-2 px-10 text-center text-gray-700'>
            Вы пока не присоединились ни к одному общему графику отпусков.
          </span>
          <span className='px-10 text-center text-gray-500'>
            Вы можете
            <Link href='/shared' className='text-blue-500 underline'>
              {' '}
              создать
            </Link>{' '}
            свой общий график отпусков и пригласить других участников.
          </span>
        </div>
      )}
      {/* </div> */}
    </>
  );
}
