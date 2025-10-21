'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useLocalStorage } from '@react-hooks-library/core';
import dayjs from 'dayjs';
import { toast, Toaster } from 'sonner';
import { Session } from 'next-auth';
import {
  deletePersonalSharedRangesByPersonalRangesId,
  deletePersonalRangesById,
  getPersonalRangesByUserId,
  upsertPersonalRangesByUserIdOrLsRangesId,
  getSharedRanges,
  SharedWithPersonalRangesRes,
  createPersonalRangesAndSetCookiePersonalRangesId,
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
  // setDateRanges: (value: DateRange[]) => void;
  // lsRangesData: {
  //   id: string;
  //   userName: string;
  // };
  setDateRanges: Dispatch<SetStateAction<DateRange[]>>;
  lsRangesData: {
    id: string;
    userName: string;
  };
  setLsRangesData: (value: { id: string; userName: string }) => void;
  lsSharedRangesData: {
    id: string;
    name: string;
    year: number;
  };
  setLsSharedRangesData: (value: {
    id: string;
    name: string;
    year: number;
  }) => void;
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
  personalRangesId: string;
};

export const ThemeContext = createContext<SelectedDateContext | null>(null);

export function ContainerClientProviderVH({
  children,
  session,
  personalRangesId,
  personalRangesIdFromCookie,
  personalRanges,
}: {
  session: Session | null;
  children: ReactNode;
  personalRangesId: string;
  personalRangesIdFromCookie: string | undefined;
  personalRanges: PersonalRanges;
}) {
  console.log('🚀 ~ ContainerClientProviderVH start ');

  // const [dateRanges, setDateRanges] = useLocalStorage<DateRange[]>(
  //   'otpuskPlanRanges',
  //   [],
  // );
  const [dateRanges, setDateRanges] = useState<DateRange[]>(
    personalRanges.rangesJson
      ? JSON.parse(personalRanges.rangesJson as string)
      : [],
  );

  const [lsRangesData, setLsRangesData] = useLocalStorage<{
    id: string;
    userName: string;
  }>('otpuskPlanLsRangesData', {
    id: '',
    userName: '',
  });

  const [lsSharedRangesData, setLsSharedRangesData] = useLocalStorage<{
    id: string;
    name: string;
    year: number;
  }>('otpuskPlanSharedRangesData', {
    id: '',
    name: '',
    year: 0,
  });

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

  useEffect(() => {
    // в случае авторизации пользователя выполняем:
    (async () => {
      if (session) {
        toast.success('Успешная авторизация!');
        // router.push('/');
        const personalRangesDBRes = await getPersonalRangesByUserId({
          userId: session.user.id,
        });

        if (personalRangesDBRes?.rangesJson) {
          // если есть персональный план в бд, то копируем его в локальное хранилище
          setDateRanges(
            JSON.parse(personalRangesDBRes.rangesJson) as DateRange[],
          );
          // проверка на совпадение id персонального плана в локальном хранилище и в бд
          if (personalRangesDBRes.id !== lsRangesData.id && lsRangesData.id) {
            // и если не совпадает, то
            // 1a) удаляем из бд таблицы PersonalSharedPlan все записи с personalRangesId = id персонального плана в локальном хранилище
            deletePersonalSharedRangesByPersonalRangesId({
              personalRangesId: lsRangesData.id,
            });
            // 1b) удаляем из бд таблицы PersonalRanges все записи с id = id персонального плана в локальном хранилище
            deletePersonalRangesById({ id: lsRangesData.id });
          }

          // 2) копируем его (personalRangesDBRes.id) в локальное хранилище
          // копируем id персонального плана в локальное хранилище
          setLsRangesData({
            id: personalRangesDBRes?.id || '',
            userName: session.user.name || 'Пользователь X',
          });
        } else {
          // если нет персонального плана в бд
          const lsRangesJson = localStorage.getItem('otpuskPlanRanges');
          // const lsRangesData2 = localStorage.getItem('otpuskPlanLsRangesId');

          if (lsRangesJson) {
            const res = await upsertPersonalRangesByUserIdOrLsRangesId({
              userId: session.user.id,
              rangesJson: lsRangesJson,
              lsRangesId: JSON.parse(lsRangesData.id || '""'),
              userName: session.user.name || 'Пользователь X',
            });
            console.log('🚀 ~ ContainerClientProviderVH ~ res-2:', res);
          }
        }
      }
    })();
  }, [session]);

  useEffect(() => {
    (async () => {
      console.log(
        '🚀 ~ ContainerClientProviderVH ~ useEffect ~ await getSharedRanges',
      );
      const sharedRangesRes = await getSharedRanges({
        id: lsSharedRangesData.id || null,
      });
      if (sharedRangesRes.sharedRangesWithPersonal) {
        setSharedRangesData(sharedRangesRes.sharedRangesWithPersonal);
      }
    })();
  }, [lsSharedRangesData.id]);

  useEffect(() => {
    (async () => {
      if (!personalRangesId) {
        await createPersonalRangesAndSetCookiePersonalRangesId();
      }
    })();
  }, []);

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
          lsRangesData,
          setLsRangesData,
          lsSharedRangesData,
          setLsSharedRangesData,
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
        }}
      >
        <div className='flex h-dvh flex-col'>{children}</div>
        <Toaster position='bottom-right' richColors />
      </ThemeContext.Provider>
    </SessionProvider>
  );
}
