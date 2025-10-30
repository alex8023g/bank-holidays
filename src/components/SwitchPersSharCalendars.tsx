import { UserCircleIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { twJoin } from 'tailwind-merge';

const tabs = [
  { name: 'Персональный', href: '/', current: true },
  { name: 'Общие', href: '/shared', current: false },
];

export function SwitchPersSharCalendars() {
  const pathname = usePathname();
  const router = useRouter();
  const [page, setPage] = useState(pathname);

  useEffect(() => {
    router.push(page);
  }, [page]);

  const handleChange = () => {
    setPage(page === '/' ? '/shared' : '/');
  };

  return (
    <>
      <div className='hidden md:block'>
        <nav aria-label='Tabs' className='-mb-px flex space-x-4'>
          {tabs.map((tab) => (
            <button
              key={tab.name}
              // href={tab.href}
              onClick={() => setPage(tab.href)}
              aria-current={tab.href === pathname ? 'page' : undefined}
              className={twJoin(
                'cursor-pointer',
                tab.href === pathname
                  ? 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                'rounded-md px-3 py-2 text-sm font-medium',
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className='group relative z-50 inline-flex w-15 shrink-0 rounded-lg bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 transition-colors duration-200 ease-in-out has-focus-visible:outline-2 md:hidden'>
        <span className='absolute top-1 left-1'>
          <UserCircleIcon className='/dark:text-gray-600 size-6 text-gray-400' />
        </span>
        <span className='absolute top-1 right-1'>
          <ShareIcon className='/dark:text-gray-600 size-6 text-gray-400' />
        </span>
        <span className='relative size-7 rounded-md bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-7'>
          <span
            aria-hidden='true'
            className='absolute inset-0 flex size-full items-center justify-center opacity-100 transition-opacity duration-200 ease-in group-has-checked:opacity-0 group-has-checked:duration-100 group-has-checked:ease-out'
          >
            <UserCircleIcon className='/dark:text-gray-600 size-10 text-gray-500' />
          </span>
          <span
            aria-hidden='true'
            className='absolute inset-0 flex size-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-has-checked:opacity-100 group-has-checked:duration-200 group-has-checked:ease-in'
          >
            <ShareIcon className='/dark:text-gray-600 size-10 text-gray-500' />
          </span>
        </span>
        <input
          name='setting'
          type='checkbox'
          aria-label='Use setting'
          className='absolute inset-0 appearance-none focus:outline-hidden'
          checked={pathname === '/shared'}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
