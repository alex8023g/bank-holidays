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
} from '@/lib/actions';
import { SessionProvider } from 'next-auth/react';

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
};

export const ThemeContext = createContext<SelectedDateContext | null>(null);

export default function ClientContainerVH({
  children,
  session,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  console.log('🚀 ~ ClientContainerVH start ');

  const [dateRanges, setDateRanges] = useLocalStorage<DateRange[]>(
    'otpuskPlanRanges',
    [],
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
              lsRangesId: JSON.parse(lsRangesData.id || ''),
              userName: session.user.name || 'Пользователь X',
            });
            console.log('🚀 ~ ClientContainerVH ~ res-2:', res);
          }
        }
      }
    })();
  }, [session]);

  useEffect(() => {
    (async () => {
      const sharedRangesRes = await getSharedRanges({
        id: lsSharedRangesData.id || null,
      });
      if (sharedRangesRes.sharedRangesWithPersonal) {
        setSharedRangesData(sharedRangesRes.sharedRangesWithPersonal);
      }
    })();
  }, [lsSharedRangesData.id]);

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
        }}
      >
        <div className='flex h-dvh flex-col'>{children}</div>
        <Toaster position='bottom-right' richColors />
      </ThemeContext.Provider>
    </SessionProvider>
  );
}
