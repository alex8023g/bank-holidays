import { ChevronUpIcon, EllipsisVerticalIcon } from '@heroicons/react/16/solid';
import * as Headless from '@headlessui/react';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownButton,
} from './catalist/dropdown';

export function PlanResultMenu({
  anchor,
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
}) {
  return (
    <Dropdown>
      <Headless.MenuButton as='button' className='outline-none'>
        <EllipsisVerticalIcon className='size-6 cursor-pointer text-zinc-500' />
      </Headless.MenuButton>
      <DropdownMenu anchor={anchor || 'bottom end'} className=''>
        <DropdownItem href='#'>
          Копировать план отпусков в буфер обмена
        </DropdownItem>
        <DropdownItem href='#'>Показать план отпусков</DropdownItem>
        <DropdownItem href='#'>Экспортировать в Excel</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
