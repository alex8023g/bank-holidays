'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  use,
  useEffect,
  useState,
} from 'react';
import { useLocalStorage } from '@react-hooks-library/core';
import dayjs from 'dayjs';
import { toast, Toaster } from 'sonner';
import { Session } from 'next-auth';

export type DateRange = {
  year: number;
  start: { dayOfYear: number; dateStr: string };
  end: { dayOfYear: number; dateStr: string };
};

export type SelectedDateContext = {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  dateRanges: DateRange[];
  setDateRanges: (value: DateRange[]) => void;
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
  session,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  console.log('🚀 ~ ClientContainerVH ~ ');
  const [dateRanges, setDateRanges] = useLocalStorage<DateRange[]>(
    'otpuskPlanRanges',
    [],
  );
  const [selectedDayOfYear, setSelectedDayOfYear] = useState<number | null>(
    null,
  );
  const [hoverDayOfYear, setHoverDayOfYear] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);

  useEffect(() => {
    if (session) {
      toast.success('Успешная авторизация!');
    }
  }, [session]);

  return (
    <ThemeContext.Provider
      value={{
        selectedYear,
        setSelectedYear,
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
