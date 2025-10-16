'use client';
import { useContext } from 'react';
import { ThemeContext } from './ClientContainerVH';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
export function MembersList() {
  const ctx = useContext(ThemeContext);

  return (
    <div className='border-1 border-red-500'>
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
      <ul className='p-2'>
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

// function MemberItem({
//   personalRange,
// }: {
//   personalRange: {
//     personalRanges: PersonalRanges;
//   } & {
//     id: string;
//     personalRangesId: string;
//     sharedRangesId: string;
//   };
// }) {
//   return (
//     <li className='flex cursor-pointer items-center gap-2'>
//       <EyeIcon className='h-4 w-4 text-gray-400' />
//       <span className='text-gray-500'>
//         {personalRange.personalRanges.userName}
//       </span>
//     </li>
//   );
// }
