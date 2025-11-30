import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/catalist/dropdown';
import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import { deleteCookiePersonalRangesId } from '@/lib/actions';
import { User } from 'next-auth';

export function AvatarDropDown({ user }: { user: User }) {
  return (
    <Dropdown>
      <DropdownButton
        as='button'
        className='size-8 cursor-pointer p-0 outline-none'
        aria-label='More options'
      >
        <UserCircleIcon className='size-8' />
      </DropdownButton>
      <DropdownMenu>
        <DropdownHeader>
          <div className='pr-6'>
            <div className='text-xs text-zinc-500 dark:text-zinc-400'>
              {user.name}
            </div>
            <div className='text-sm/7 font-semibold text-zinc-800 dark:text-white'>
              {user.email}
            </div>
          </div>
        </DropdownHeader>
        <DropdownDivider />
        <DropdownItem
          className='text-red-700 data-focus:bg-red-700'
          onClick={() => {
            signOut();
            deleteCookiePersonalRangesId();
          }}
        >
          <ArrowRightStartOnRectangleIcon className='text-red-700' />
          <DropdownLabel>Abmelden</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
