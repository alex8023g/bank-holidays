import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/ru'; // Importing Russian locale for dayjs
dayjs.locale('ru');
dayjs.extend(isoWeek);
// Importing dayjs with isoWeek plugin for week calculations
// Importing Russian locale for dayjs

type Month = {
  monthNum: number;
  monthName: string;
  days: (string | null)[];
}[];

const year = new Date().getFullYear();
console.log('🚀 ~ year:', year);
// const year = 2022; // Fixed year for testing
const months: Month = new Array(12).fill(0).map((_, i) => {
  const month = (i + 1).toString().padStart(2, '0'); // Format month as two digits
  const monthName = dayjs(`${year}-${month}-01`).format('MMMM');
  const weekday = dayjs(`${year}-${month}-01`).isoWeekday();
  console.log('🚀 ~ weekday', weekday, monthName);

  return {
    monthNum: i,
    monthName,
    days: new Array(42)
      .fill(null)
      .map((_, j) =>
        j < weekday - 1 || j > weekday + dayjs(`${year}-${month}-01`).daysInMonth() - 2
          ? null
          : (j - weekday + 2).toString()
      ),
  };
});
// console.log('🚀 ~ P1Page ~ months:', months, year);

export default async function P1Page() {
  return (
    <div>
      <header className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
        <h1 className='text-base font-semibold text-gray-900'>
          <time dateTime={'2022'}>{year}</time>
        </h1>
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
      <div className='bg-white'>
        <div className='mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-3 xl:px-8 2xl:grid-cols-4'>
          {months.map((month) => (
            <section key={month.monthName} className='text-center'>
              <h2 className='text-sm font-semibold text-gray-900'>{month.monthName}</h2>
              <div className='mt-6 grid grid-cols-7 text-xs/6 text-gray-500'>
                <div>ПН</div>
                <div>ВТ</div>
                <div>СР</div>
                <div>ЧТ</div>
                <div>ПТ</div>
                <div>СБ</div>
                <div>ВС</div>
              </div>
              <div className='isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200'>
                {month.days.map((day, i) => (
                  <button
                    key={i}
                    type='button'
                    // data-is-today={day.isToday ? '' : undefined}
                    data-is-current-month={day ? '' : undefined}
                    className='bg-gray-50 py-1.5 text-gray-400 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 data-is-current-month:bg-white data-is-current-month:text-gray-900 data-is-current-month:hover:bg-gray-100 nth-36:rounded-bl-lg nth-7:rounded-tr-lg'
                  >
                    <time
                      dateTime={day || ''}
                      className='mx-auto flex size-7 items-center justify-center rounded-full in-data-is-today:bg-indigo-600 in-data-is-today:font-semibold in-data-is-today:text-white'
                    >
                      {day}
                    </time>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
