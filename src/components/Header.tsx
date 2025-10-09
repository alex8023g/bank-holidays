'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useContext } from 'react';
import { ThemeContext } from './ClientContainerVH';
import dayjs from 'dayjs';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { Button } from './catalist/button';
import { usePathname } from 'next/navigation';
import { twJoin } from 'tailwind-merge';
import Link from 'next/link';

export default function Header({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const ctx = useContext(ThemeContext);
  if (!ctx) return;
  <div>no ctx</div>;

  const handlePrevYear = () => {
    ctx.setSelectedYear((year) => year - 1);
    ctx.setSelectedRange(null);
    ctx.setSelectedDayOfYear(0);
    ctx.setHoverDayOfYear(0);
  };
  const handleNextYear = () => {
    ctx.setSelectedYear((year) => year + 1);
    ctx.setSelectedRange(null);
    ctx.setSelectedDayOfYear(0);
    ctx.setHoverDayOfYear(0);
  };
  return (
    <header
      className={twJoin(
        'flex items-center justify-between border-b border-gray-200 px-6 py-4',
        pathname === '/login' && 'hidden',
      )}
    >
      <div className='flex items-center'>
        {ctx.selectedYear === 2023 ? (
          <button className=''>
            <ChevronLeftIcon className='size-6 text-gray-300' />
          </button>
        ) : (
          <button className='cursor-pointer' onClick={handlePrevYear}>
            <ChevronLeftIcon className='size-6' />
          </button>
        )}
        <h1 className='text-base font-semibold text-gray-900'>
          <time dateTime={'2022'}>{ctx?.selectedYear}</time>
        </h1>
        {ctx?.selectedYear && ctx.selectedYear <= dayjs().year() ? (
          <button className='cursor-pointer' onClick={handleNextYear}>
            <ChevronRightIcon className='size-6' />
          </button>
        ) : (
          <button className=''>
            <ChevronRightIcon className='size-6 text-gray-300' />
          </button>
        )}

        {session?.user.id ? (
          <Button onClick={() => signOut()}>Sign out</Button>
        ) : (
          <div className='ml-auto'>
            Для создания общего календаря необходимо{' '}
            <Link
              href='/login'
              className='font-semibold text-blue-500 underline'
            >
              войти
            </Link>{' '}
            в систему
          </div>
        )}
      </div>
    </header>
  );
}
