import { EllipsisVerticalIcon } from '@heroicons/react/16/solid';
import * as Headless from '@headlessui/react';
import { Dropdown, DropdownItem, DropdownMenu } from './catalist/dropdown';
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from './catalist/dialog';
import { Button } from './catalist/button';
import { copyTextToClipboard } from '@/lib/copyToClipboard';
import { useState } from 'react';
import { vocationScheduleText } from '@/lib/vocationScheduleText';
import { DateRange } from './ContainerClientProviderVH';
import { Day } from '@/lib/createDaysArr';

export function PlanResultMenu({
  anchor,
  dateRanges,
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
  dateRanges: DateRange[];
  days: Day[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dropdown>
        <Headless.MenuButton as='button' className='outline-none'>
          <EllipsisVerticalIcon className='size-6 cursor-pointer text-zinc-500' />
        </Headless.MenuButton>
        <DropdownMenu anchor={anchor || 'bottom end'} className='z-20'>
          <DropdownItem
            onClick={() =>
              copyTextToClipboard(vocationScheduleText({ dateRanges, days }))
            }
          >
            Копировать план отпусков в буфер обмена
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Показать план отпусков
          </DropdownItem>
          {/* <DropdownItem href='#'>Экспортировать в Excel</DropdownItem> */}
        </DropdownMenu>
      </Dropdown>

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>График отпусков</DialogTitle>
        <DialogDescription className='whitespace-pre-wrap'>
          {vocationScheduleText({ dateRanges, days })}
        </DialogDescription>

        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Закрыть
          </Button>
          <Button
            onClick={() =>
              copyTextToClipboard(vocationScheduleText({ dateRanges, days }))
            }
          >
            Копировать в буфер обмена
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
