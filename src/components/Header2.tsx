'use client';

import { SelectYear } from './SelectYear';
import { Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twJoin } from 'tailwind-merge';
import { Button } from './catalist/button';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { AvatarDropDown } from './AvatarDropDown';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { DateRange } from './ContainerClientProviderVH';
import dayjs from 'dayjs';
import { NavBar } from './NavBar';

export type HeaderContextT = {
  isLoginBlockOpen: boolean;
  setIsLoginBlockOpen: Dispatch<SetStateAction<boolean>>;
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  selectedDayOfYear: number | null;
  setSelectedDayOfYear: Dispatch<SetStateAction<number | null>>;
  hoverDayOfYear: number | null;
  setHoverDayOfYear: Dispatch<SetStateAction<number | null>>;
  selectedRange: DateRange | null;
  setSelectedRange: Dispatch<SetStateAction<DateRange | null>>;
  calendarView: 'calendar' | 'list';
  setCalendarView: Dispatch<SetStateAction<'calendar' | 'list'>>;
};
export const HeaderContext = createContext<HeaderContextT | null>(null);

export default function Header2({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoginBlockOpen, setIsLoginBlockOpen] = useState(false);
  const [hoverDayOfYear, setHoverDayOfYear] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedDayOfYear, setSelectedDayOfYear] = useState<number | null>(
    null,
  );
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);
  const [calendarView, setCalendarView] = useState<'calendar' | 'list'>(
    'calendar',
  );
  return (
    <HeaderContext.Provider
      value={{
        isLoginBlockOpen,
        setIsLoginBlockOpen,
        selectedYear,
        setSelectedYear,
        selectedDayOfYear,
        setSelectedDayOfYear,
        hoverDayOfYear,
        setHoverDayOfYear,
        selectedRange,
        setSelectedRange,
        calendarView,
        setCalendarView,
      }}
    >
      <header className='border-b border-gray-200 bg-white'>
        <div
          aria-label='Global'
          className='flex items-center justify-start p-3 md:px-8'
        >
          <div className='mr-4 flex md:flex'>
            <Link href='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>OtpuskPlan.ru</span>
              <img alt='' src='/calendar.svg' className='h-8 w-auto' />
            </Link>
            <h1 className='hidden px-4 text-2xl font-medium md:block'>
              UrlaubsPlaner.pro
            </h1>
            <div
              className={twJoin(
                'flex items-center gap-3 transition-transform duration-200 ease-in-out',
                pathname === '/' ? 'scale-100' : 'scale-0',
              )}
            >
              <SelectYear />
              {/* <SwitchCalendarView /> */}
            </div>
          </div>
          <div className='mr-auto flex items-center gap-3 text-sm/6 font-semibold text-gray-900'>
            {/* {(pathname === '/' || pathname?.includes('/management')) && (
              <SwitchPersSharCalendars />
            )} */}
            <NavBar />
          </div>
          <div
            className={twJoin(
              '/py-2 flex items-center gap-3 transition-transform duration-200 ease-in-out',
              // pathname !== '/' && 'scale-0',
            )}
          >
            {session?.user.id ? (
              <AvatarDropDown user={session.user} />
            ) : isLoginBlockOpen ? (
              <Button
                plain
                className='cursor-pointer text-sm/6'
                onClick={() => setIsLoginBlockOpen(false)}
              >
                Закрыть
              </Button>
            ) : (
              <Button
                plain
                className='cursor-pointer text-sm/6'
                onClick={() => setIsLoginBlockOpen(true)}
              >
                <ArrowRightEndOnRectangleIcon className='size-5' />
                Войти
              </Button>
            )}
          </div>
        </div>
      </header>
      {children}
    </HeaderContext.Provider>
  );
}
