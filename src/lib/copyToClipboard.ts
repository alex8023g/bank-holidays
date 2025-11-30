import { toast } from 'sonner';

export function copyTextToClipboard(text: string) {
  // if (!navigator.clipboard) {
  //   fallbackCopyTextToClipboard(text);
  //   return;
  // }
  navigator.clipboard.writeText(text).then(
    () => {
      console.log('Async: Copying to clipboard was successful!');
      toast.success('Antrag in die Zwischenablage kopiert');
    },
    (err) => {
      console.error('Async: Could not copy text: ', err);
      toast.error('Antrag wurde nicht in die Zwischenablage kopiert');
    },
  );
}
