'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { useLocalStorage } from '@react-hooks-library/core';
import dayjs from 'dayjs';
import { Toaster } from 'sonner';

// export type DateRange = { start: string; end: string };

export type DateRange = {
  year: number;
  start: { dayOfYear: number; dateStr: string };
  end: { dayOfYear: number; dateStr: string };
};

type SelectedDateContext = {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  // selectedDate: DateRange;
  // setSelectedDate: Dispatch<SetStateAction<DateRange>>;
  dateRanges: DateRange[];
  setDateRanges: (value: DateRange[]) => void;
  // dateRanges2: DateRange2[];
  // setDateRanges2: (value: DateRange[]) => void;
  selectedDayOfYear: number | null;
  setSelectedDayOfYear: Dispatch<SetStateAction<number | null>>;
  hoverDayOfYear: number | null;
  setHoverDayOfYear: Dispatch<SetStateAction<number | null>>;
  selectedRange: DateRange | null;
  setSelectedRange: Dispatch<SetStateAction<DateRange | null>>;
};

export const ThemeContext = createContext<SelectedDateContext | null>(null);

export default function ClientContainerVH({
  children,
}: {
  children: ReactNode;
}) {
  const [dateRanges, setDateRanges] = useLocalStorage<DateRange[]>(
    'useLocalsStorageKey',
    [],
  );
  // console.log('🚀 ~ ClientContainerVH ~ value:', dateRanges);
  // const [selectedDate, setSelectedDate] = useState({
  //   year: 0,
  //   start: { dayOfYear: 0, dateStr: '' },
  //   end: { dayOfYear: 0, dateStr: '' },
  // });
  const [selectedDayOfYear, setSelectedDayOfYear] = useState<number | null>(
    null,
  );
  const [hoverDayOfYear, setHoverDayOfYear] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);

  return (
    <ThemeContext.Provider
      value={{
        selectedYear,
        setSelectedYear,
        // selectedDate,
        // setSelectedDate,
        dateRanges,
        setDateRanges,
        selectedDayOfYear,
        setSelectedDayOfYear,
        hoverDayOfYear,
        setHoverDayOfYear,
        selectedRange,
        setSelectedRange,
      }}
    >
      <div className='flex h-dvh flex-col'>{children}</div>
      <Toaster position='bottom-right' richColors />
    </ThemeContext.Provider>
  );
}
