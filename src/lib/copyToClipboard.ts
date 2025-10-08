import { toast } from 'sonner';

export function copyTextToClipboard(text: string) {
  // if (!navigator.clipboard) {
  //   fallbackCopyTextToClipboard(text);
  //   return;
  // }
  navigator.clipboard.writeText(text).then(
    () => {
      console.log('Async: Copying to clipboard was successful!');
      toast.success('Заявление скопировано в буфер обмена');
    },
    (err) => {
      console.error('Async: Could not copy text: ', err);
      toast.error('Заявление не скопировано в буфер обмена');
    },
  );
}
