'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { SelectYear } from './SelectYear';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from './catalist/button';
import { createSharedRanges } from '@/lib/actions';
import { toast } from 'sonner';

const navigation = [
  { name: 'Персональный', href: '/' },
  { name: 'Общие графики отпусков', href: '/shared' },
  // { name: 'Мои отпуска', href: '#' },
  // { name: 'Управление', href: '#' },
];

export default function Header2({ session }: { session: Session | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const isLogin = searchParams.has('login');

  return (
    <header className='border-b border-gray-200 bg-white'>
      <nav
        aria-label='Global'
        className='flex items-center justify-between p-3 md:px-8'
      >
        <div className='flex md:flex-1'>
          <a href='#' className='-m-1.5 p-1.5'>
            <span className='sr-only'>Your Company</span>
            <img alt='' src='/calendar.svg' className='h-8 w-auto' />
          </a>
          <SelectYear />
        </div>
        <div className='flex md:hidden'>
          <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
          >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon aria-hidden='true' className='size-6' />
          </button>
        </div>
        <div className='hidden md:flex md:gap-x-12'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='text-sm/6 font-semibold text-gray-900'
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Button
          className='cursor-pointer'
          onClick={() => {
            if (session?.user.id) {
              createSharedRanges({ userId: session?.user.id });
            } else {
              toast.error(
                'Пожалуйста, авторизуйтесь для создания общего графика отпусков',
              );
            }
          }}
        >
          Создать общий график отпусков
        </Button>
        <div className='hidden md:flex md:flex-1 md:justify-end'>
          {session?.user.id ? (
            <span
              className='rounded-md border px-4 py-2 text-sm/6 font-semibold text-gray-900'
              onClick={() => signOut()}
            >
              Sign out
            </span>
          ) : isLogin ? (
            <Link
              href='/'
              className='cursor-pointer rounded-md border px-4 py-2 text-sm/6 font-semibold text-gray-900'
            >
              close
            </Link>
          ) : (
            <Link
              href='/?login'
              className='cursor-pointer rounded-md border px-4 py-2 text-sm/6 font-semibold text-gray-900'
            >
              Log in
              {/* <span aria-hidden='true'>&rarr;</span> */}
            </Link>
          )}
        </div>
      </nav>
      <Dialog
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
      </Dialog>
    </header>
  );
}
