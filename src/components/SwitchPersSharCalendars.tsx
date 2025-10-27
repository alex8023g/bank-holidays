import { UserCircleIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
    <div className='group /outline-indigo-600 /has-checked:bg-indigo-600 /dark:outline-indigo-500 /dark:has-checked:bg-indigo-500 /dark:bg-white/5 /dark:inset-ring-white/10 relative z-50 inline-flex w-15 shrink-0 rounded-lg bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 transition-colors duration-200 ease-in-out has-focus-visible:outline-2'>
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
  );
}
