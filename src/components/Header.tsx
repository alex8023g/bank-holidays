'use client';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useContext } from 'react';
import { ThemeContext } from './ClientContainerVH';
import dayjs from 'dayjs';

export default function Header() {
  const handlePrevYear = () => {
    ctx?.setSelectedYear((year) => year - 1);
  };
  const handleNextYear = () => {
    ctx?.setSelectedYear((year) => year + 1);
  };
  const ctx = useContext(ThemeContext);
  return (
    <header className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center'>
        <button className='cursor-pointer' onClick={handlePrevYear}>
          <ChevronLeftIcon className='size-6' />
        </button>
        <h1 className='text-base font-semibold text-gray-900'>
          <time dateTime={'2022'}>{ctx?.selectedYear}</time>
        </h1>
        {ctx?.selectedYear && ctx.selectedYear <= dayjs().year() ? (
          <button className='cursor-pointer' onClick={handleNextYear}>
            <ChevronRightIcon className='size-6' />
          </button>
        ) : (
          <button className='cursor-pointer'>
            <ChevronRightIcon className='size-6 text-gray-300' />
          </button>
        )}
      </div>
      <div className='flex items-center'>
        <div className='relative flex items-center rounded-md bg-white shadow-xs md:items-stretch'>
          <button
            type='button'
            className='flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50'
          >
            <span className='sr-only'>Previous year</span>
            <ChevronLeftIcon aria-hidden='true' className='size-5' />
          </button>
          <button
            type='button'
            className='hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block'
          >
            Today
          </button>
          <span className='relative -mx-px h-5 w-px bg-gray-300 md:hidden' />
          <button
            type='button'
            className='flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50'
          >
            <span className='sr-only'>Next year</span>
            <ChevronRightIcon aria-hidden='true' className='size-5' />
          </button>
        </div>
        <div className='hidden md:ml-4 md:flex md:items-center'>
          <Menu as='div' className='relative'>
            <MenuButton
              type='button'
              className='flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50'
            >
              Year view
              <ChevronDownIcon
                aria-hidden='true'
                className='-mr-1 size-5 text-gray-400'
              />
            </MenuButton>

            <MenuItems
              transition
              className='absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in'
            >
              <div className='py-1'>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Day view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Week view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Month view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Year view
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          <div className='ml-6 h-6 w-px bg-gray-300' />
          <button
            type='button'
            className='ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
          >
            Add event
          </button>
        </div>
        <div className='ml-6 md:hidden'>
          <Menu as='div' className='relative'>
            <MenuButton className='relative flex items-center rounded-full border border-transparent text-gray-400 outline-offset-8 hover:text-gray-500'>
              <span className='absolute -inset-2' />
              <span className='sr-only'>Open menu</span>
              <EllipsisHorizontalIcon aria-hidden='true' className='size-5' />
            </MenuButton>

            <MenuItems
              transition
              className='absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in'
            >
              <div className='py-1'>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Create event
                  </a>
                </MenuItem>
              </div>
              <div className='py-1'>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Go to today
                  </a>
                </MenuItem>
              </div>
              <div className='py-1'>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Day view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Week view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Month view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'
                  >
                    Year view
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </header>
  );
}
