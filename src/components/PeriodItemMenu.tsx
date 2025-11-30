import { EllipsisVerticalIcon } from '@heroicons/react/16/solid';
import * as Headless from '@headlessui/react';

import { Dropdown, DropdownItem, DropdownMenu } from './catalist/dropdown';
import { copyTextToClipboard } from '@/lib/copyToClipboard';
import { DateRange } from './ContainerClientProviderVH';
import { Day } from '@/lib/createDaysArr';
import { requestForLeaveText } from '@/lib/requestForLeaveText';
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from './catalist/dialog';
import { Button } from './catalist/button';
import { useState } from 'react';
import { requestForLeaveWord } from '@/lib/requestForLeaveWord';

export function PeriodItemMenu({
  anchor,
  range,
  days,
}: {
  anchor?:
    | 'bottom end'
    | 'bottom start'
    | 'top end'
    | 'top start'
    | 'right end'
    | 'right start'
    | 'left end'
    | 'left start';
  days: Day[];
  range: DateRange;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dropdown>
        <Headless.MenuButton as='button' className='outline-none'>
          <EllipsisVerticalIcon className='size-6 cursor-pointer text-zinc-500' />
        </Headless.MenuButton>
        <DropdownMenu anchor={anchor || 'bottom end'} className=''>
          <DropdownItem
            onClick={() =>
              copyTextToClipboard(requestForLeaveText({ range, days }))
            }
          >
            Urlaubsantrag in die Zwischenablage kopieren
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Urlaubsantragstext anzeigen
          </DropdownItem>
          {/*           <DropdownItem
            onClick={() => {
              requestForLeaveWord(requestForLeaveText({ range, days }));
            }}
          >
            In Word exportieren
          </DropdownItem> */}
        </DropdownMenu>
      </Dropdown>

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Urlaubsantrag</DialogTitle>
        <DialogDescription>
          {requestForLeaveText({ range, days })}
        </DialogDescription>

        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Schließen
          </Button>
          <Button
            onClick={() =>
              copyTextToClipboard(requestForLeaveText({ range, days }))
            }
          >
            In die Zwischenablage kopieren
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
