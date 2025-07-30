'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { useLocalStorage } from '@react-hooks-library/core';

export type DateRange = { start: string; end: string };

type SelectedDateContext = {
  selectedDate: DateRange;
  setSelectedDate: Dispatch<SetStateAction<DateRange>>;
  dateRanges: DateRange[];
  setDateRanges: Dispatch<SetStateAction<DateRange[]>>;
  value: DateRange[];
  setValue: (value: DateRange[]) => void;
};

export const ThemeContext = createContext<SelectedDateContext | null>(null);

export default function ClientContainerVH({
  children,
}: {
  children: ReactNode;
}) {
  const [value, setValue] = useLocalStorage<DateRange[]>(
    'useLocalsStorageKey',
    [],
  );
  console.log('🚀 ~ ClientContainerVH ~ value:', value);
  const [selectedDate, setSelectedDate] = useState({ start: '', end: '' });
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);

  return (
    <ThemeContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        dateRanges,
        setDateRanges,
        value,
        setValue,
      }}
    >
      <div className='flex h-dvh flex-col border-2 border-red-500'>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
