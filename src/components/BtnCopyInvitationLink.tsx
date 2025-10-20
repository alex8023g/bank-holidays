'use client';

import { copyTextToClipboard } from '@/lib/copyToClipboard';
import { toast } from 'sonner';

export function BtnCopyInvitationLink({ link }: { link: string }) {
  return (
    <button
      className='cursor-pointer'
      onClick={() => {
        navigator.clipboard.writeText(link).then(
          () => {
            console.log('Async: Copying to clipboard was successful!');
            toast.success('Ссылка скопирована в буфер обмена: ' + link);
          },
          (err) => {
            console.error('Async: Could not copy text: ', err);
            toast.error('Ссылка не скопирована в буфер обмена');
          },
        );
      }}
    >
      скопировать ссылку
    </button>
  );
}
