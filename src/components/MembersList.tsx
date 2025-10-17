'use client';
import { useContext } from 'react';
import { ThemeContext } from './ContainerClientProviderVH';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { twJoin } from 'tailwind-merge';
import { RangesUsersBtn } from './ContainerRangesUsers';

export function MembersList({ activeBtn }: { activeBtn: RangesUsersBtn }) {
  const ctx = useContext(ThemeContext);

  return (
    <div
      className={twJoin(
        'w-full overflow-y-hidden rounded-lg border-gray-400 md:flex md:w-1/2 md:flex-col md:border xl:h-1/2 xl:w-full',
        activeBtn === 'users' ? 'flex flex-col' : 'hidden',
      )}
    >
      <div className='/relative flex items-center justify-center'>
        <button
          className='/absolute top-2 left-2'
          onClick={() => {
            ctx?.setHiddenRangesIds((prev) =>
              prev.length > 0
                ? []
                : ctx?.sharedRangesData?.personalRanges.map(
                    (personalRange) => personalRange.id,
                  ) || [],
            );
          }}
        >
          {ctx?.hiddenRangesIds.length &&
          ctx?.hiddenRangesIds.length ===
            ctx?.sharedRangesData?.personalRanges.length ? (
            <EyeSlashIcon className='h-4 w-4 text-gray-400' />
          ) : (
            <EyeIcon className='h-4 w-4 text-gray-400' />
          )}
        </button>
        <h2 className='pl-2 text-center font-semibold'>Все участники:</h2>
      </div>
      <ul className='h-full overflow-y-scroll p-2'>
        {ctx?.sharedRangesData?.personalRanges
          .filter(
            (personalRange) =>
              personalRange.personalRanges.id !== ctx?.lsRangesData?.id,
          )
          .map((personalRange) => (
            <li
              key={personalRange.id}
              className='flex cursor-pointer items-center gap-2'
              onClick={() => {
                ctx?.setHiddenRangesIds((prev) => {
                  if (prev.includes(personalRange.id)) {
                    return prev.filter((id) => id !== personalRange.id) || [];
                  } else {
                    return [...prev, personalRange.id];
                  }
                });
              }}
            >
              {ctx?.hiddenRangesIds.includes(personalRange.id) ? (
                <EyeSlashIcon className='h-4 w-4 text-gray-400' />
              ) : (
                <EyeIcon className='h-4 w-4 text-gray-400' />
              )}
              <span className='text-gray-500'>
                {personalRange.personalRanges.userName}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
