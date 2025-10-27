'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import dayjs from 'dayjs';
import { Toaster } from 'sonner';
import { Session } from 'next-auth';
import {
  SharedWithPersonalRangesRes,
  setCookiePersonalRangesId,
} from '@/lib/actions';
import { SessionProvider } from 'next-auth/react';
import { PersonalRanges } from '../../generated/prisma';

export type DateRange = {
  year: number;
  start: { dayOfYear: number; dateStr: string };
  end: { dayOfYear: number; dateStr: string };
};

export type SelectedDateContext = {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  dateRanges: DateRange[];
  setDateRanges: Dispatch<SetStateAction<DateRange[]>>;

  selectedDayOfYear: number | null;
  setSelectedDayOfYear: Dispatch<SetStateAction<number | null>>;
  hoverDayOfYear: number | null;
  setHoverDayOfYear: Dispatch<SetStateAction<number | null>>;
  selectedRange: DateRange | null;
  setSelectedRange: Dispatch<SetStateAction<DateRange | null>>;
  sharedRangesData: SharedWithPersonalRangesRes | null;
  setSharedRangesData: Dispatch<
    SetStateAction<SharedWithPersonalRangesRes | null>
  >;
  hiddenRangesIds: string[];
  setHiddenRangesIds: Dispatch<SetStateAction<string[]>>;
  clickPlace: 'calendarCell' | 'resultBlock';
  setClickPlace: Dispatch<SetStateAction<'calendarCell' | 'resultBlock'>>;
  calendarView: 'calendar' | 'list';
  setCalendarView: Dispatch<SetStateAction<'calendar' | 'list'>>;
  isLoginBlockOpen: boolean;
  setIsLoginBlockOpen: Dispatch<SetStateAction<boolean>>;

  personalRangesId: string;
  personalRangesName: string;
};

export const ThemeContext = createContext<SelectedDateContext | null>(null);

export function ContainerClientProviderVH({
  children,
  session,
  personalRangesId,
  personalRangesName,
  personalRangesIdFromCookie,
  personalRanges,
}: {
  session: Session | null;
  children: ReactNode;
  personalRangesId: string;
  personalRangesName: string;
  personalRangesIdFromCookie: string | undefined;
  personalRanges: PersonalRanges;
}) {
  console.log('🚀 ~ ContainerClientProviderVH start ');

  const [dateRanges, setDateRanges] = useState<DateRange[]>(
    personalRanges.rangesJson
      ? JSON.parse(personalRanges.rangesJson as string)
      : [],
  );

  const [selectedDayOfYear, setSelectedDayOfYear] = useState<number | null>(
    null,
  );
  const [hoverDayOfYear, setHoverDayOfYear] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);
  const [sharedRangesData, setSharedRangesData] =
    useState<SharedWithPersonalRangesRes | null>(null);
  const [hiddenRangesIds, setHiddenRangesIds] = useState<string[]>([]);
  const [clickPlace, setClickPlace] = useState<'calendarCell' | 'resultBlock'>(
    'calendarCell',
  );
  const [calendarView, setCalendarView] = useState<'calendar' | 'list'>(
    'calendar',
  );
  const [isLoginBlockOpen, setIsLoginBlockOpen] = useState(false);
  useEffect(() => {
    if (personalRangesIdFromCookie !== personalRangesId) {
      setCookiePersonalRangesId({ personalRangesId });
    }
  }, [personalRangesIdFromCookie, personalRangesId]);

  return (
    <SessionProvider session={session}>
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
          sharedRangesData,
          setSharedRangesData,
          hiddenRangesIds,
          setHiddenRangesIds,
          clickPlace,
          setClickPlace,
          calendarView,
          setCalendarView,
          personalRangesId,
          personalRangesName,
          isLoginBlockOpen,
          setIsLoginBlockOpen,
        }}
      >
        <div className='flex h-dvh flex-col'>{children}</div>
        <Toaster position='bottom-right' richColors />
      </ThemeContext.Provider>
    </SessionProvider>
  );
}
