'use client';

import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export function BtnCopyInvitationLink({ link }: { link: string }) {
  return (
    <button
      className='group flex cursor-pointer items-center gap-2'
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
        Link kopieren
      </span>
      <DocumentDuplicateIcon className='/stroke-[#6a7282] h-4 w-4 transition-colors duration-200 ease-in-out group-hover:stroke-[#4a5565]' />
    </button>
  );
}
