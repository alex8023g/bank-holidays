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
  start: number;
  end: number;
};

type SelectedDateContext = {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  selectedDate: DateRange;
  setSelectedDate: Dispatch<SetStateAction<DateRange>>;
  dateRanges: DateRange[];
  setDateRanges: (value: DateRange[]) => void;
  // dateRanges2: DateRange2[];
  // setDateRanges2: (value: DateRange[]) => void;
  selectedDayOfYear: number | null;
  setSelectedDayOfYear: Dispatch<SetStateAction<number | null>>;
  hoverDayOfYear: number | null;
  setHoverDayOfYear: Dispatch<SetStateAction<number | null>>;
  // value: DateRange[];
  // setValue: (value: DateRange[]) => void;
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
  const [selectedDate, setSelectedDate] = useState({
    year: 0,
    start: 0,
    end: 0,
  });
  const [selectedDayOfYear, setSelectedDayOfYear] = useState<number | null>(
    null,
  );
  const [hoverDayOfYear, setHoverDayOfYear] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  // const [dateRanges, setDateRanges] = useState<DateRange[]>([]);

  return (
    <ThemeContext.Provider
      value={{
        selectedYear,
        setSelectedYear,
        selectedDate,
        setSelectedDate,
        dateRanges,
        setDateRanges,
        selectedDayOfYear,
        setSelectedDayOfYear,
        hoverDayOfYear,
        setHoverDayOfYear,
        // value,
        // setValue,
      }}
    >
      <div className='/border-2 /border-red-500 flex h-dvh flex-col'>
        {children}
      </div>
      <Toaster position='bottom-right' richColors />
    </ThemeContext.Provider>
  );
}
