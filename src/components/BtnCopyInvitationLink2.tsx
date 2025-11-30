'use client';

import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function BtnCopyInvitationLink2({
  link,
  text,
  className,
}: {
  link: string;
  text: string;
  className?: string;
}) {
  return (
    <button
      className={twMerge(
        'group flex cursor-pointer items-center gap-2',
        className,
      )}
      onClick={() => {
        navigator.clipboard.writeText(link).then(
          () => {
            console.log('Async: Copying to clipboard was successful!');
            toast.success(
              'Link in die Zwischenablage kopiert. Senden Sie ihn anderen Teilnehmern zur Einladung.',
              {
                duration: 20000,
              },
            );
          },
          (err) => {
            console.error('Async: Could not copy text: ', err);
            toast.error('Link wurde nicht in die Zwischenablage kopiert');
          },
        );
      }}
    >
      <span className='underline transition-colors duration-200 ease-in-out group-hover:text-gray-600'>
        {text}
      </span>
    </button>
  );
}
