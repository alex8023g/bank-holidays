import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { ThemeContext } from './ClientContainerVH';
import { useContext } from 'react';
import dayjs from 'dayjs';

export function SelectYear() {
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
    </div>
  );
}
