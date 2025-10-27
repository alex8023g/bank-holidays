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
              'Ссылка скопирована в буфер обмена. Разошлите её другим участникам для приглашения.',
              {
                duration: 5000,
              },
            );
          },
          (err) => {
            console.error('Async: Could not copy text: ', err);
            toast.error('Ссылка не скопирована в буфер обмена');
          },
        );
      }}
    >
      <span className='underline transition-colors duration-200 ease-in-out group-hover:text-gray-600'>
        скопировать ссылку
      </span>
      <DocumentDuplicateIcon className='/stroke-[#6a7282] h-4 w-4 transition-colors duration-200 ease-in-out group-hover:stroke-[#4a5565]' />
    </button>
  );
}
