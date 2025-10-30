'use client';

import { SelectYear } from './SelectYear';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SwitchCalendarView } from './SwitchCalendarView';
import { deleteCookiePersonalRangesId } from '@/lib/actions';
import { SwitchPersSharCalendars } from './SwitchPersSharCalendars';
import { twJoin } from 'tailwind-merge';
import { Button } from './catalist/button';
import { useContext } from 'react';
import { ThemeContext } from './ContainerClientProviderVH';
import { AvatarDropDown } from './AvatarDropDown';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Header2({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const ctx = useContext(ThemeContext);
  const searchParams = useSearchParams();
  const isLogin = searchParams.has('login');

  return (
    <header className='border-b border-gray-200 bg-white'>
      <nav
        aria-label='Global'
        className='flex items-center justify-start p-3 md:px-8'
      >
        <div className='mr-4 flex md:flex'>
          <Link href='/' className='-m-1.5 p-1.5'>
            <span className='sr-only'>OtpuskPlan.ru</span>
            <img alt='' src='/calendar.svg' className='h-8 w-auto' />
          </Link>
          <h1 className='hidden px-4 text-2xl font-medium md:block'>
            OtpuskPlan.ru
          </h1>
          <div
            className={twJoin(
              'flex items-center gap-3 transition-transform duration-200 ease-in-out',
              pathname === '/' ? 'scale-100' : 'scale-0',
            )}
          >
            <SelectYear />
            <SwitchCalendarView />
          </div>
        </div>
        <div className='mr-auto flex items-center gap-3 text-sm/6 font-semibold text-gray-900'>
          {(pathname === '/' || pathname === '/shared') && (
            <SwitchPersSharCalendars />
          )}
        </div>

        <div
          className={twJoin(
            'flex items-center gap-3 py-2 transition-transform duration-200 ease-in-out',
            // pathname !== '/' && 'scale-0',
          )}
        >
          {session?.user.id ? (
            <AvatarDropDown user={session.user} />
          ) : ctx?.isLoginBlockOpen ? (
            <Button
              plain
              className='cursor-pointer text-sm/6'
              onClick={() => ctx?.setIsLoginBlockOpen(false)}
            >
              Закрыть
            </Button>
          ) : (
            <Button
              plain
              className='cursor-pointer text-sm/6'
              onClick={() => ctx?.setIsLoginBlockOpen(true)}
            >
              <ArrowRightEndOnRectangleIcon className='size-5' />
              Войти
            </Button>
          )}
        </div>
      </nav>
      {/* <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className='md:hidden'
      >
        <div className='fixed inset-0 z-50' />
        <DialogPanel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <Link href='#' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Your Company</span>
              <img alt='' src='/calendar.svg' className='h-8 w-auto' />
            </Link>
            <button
              type='button'
              onClick={() => setMobileMenuOpen(false)}
              className='-m-2.5 rounded-md p-2.5 text-gray-700'
            >
              <span className='sr-only'>Close menu</span>
              <XMarkIcon aria-hidden='true' className='size-6' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className='py-6'>
                <Link
                  href='/?login'
                  className='-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog> */}
    </header>
  );
}
