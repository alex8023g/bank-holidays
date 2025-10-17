import { RangesUsersBtn } from './ContainerRangesUsers';

export function RangesUsersBtnGroup({
  handleClick,
  activeBtn,
}: {
  activeBtn: RangesUsersBtn;
  handleClick: (btn: RangesUsersBtn) => void;
}) {
  return (
    <span className='isolate inline-flex w-full rounded-md shadow-xs md:hidden dark:shadow-none'>
      <button
        type='button'
        className='/-ml-px relative inline-flex w-1/2 items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 focus:z-10'
        onClick={() => handleClick('users')}
      >
        <span className='mx-auto'>Участники</span>
      </button>
      {/* <button
        type='button'
        className='relative inline-flex w-1/2 items-center rounded-l-md border bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 focus:z-10 dark:bg-white/10 dark:text-white dark:inset-ring-gray-700 dark:hover:bg-white/20'
        onClick={() => handleClick('ranges')}
      >
        <span className='mx-auto'>План </span>
      </button> */}
      <button
        type='button'
        className='relative inline-flex w-1/2 items-center rounded-r-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 focus:z-10'
        onClick={() => handleClick('total')}
      >
        <span className='mx-auto'>Итого</span>
      </button>
    </span>
  );
}
