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
import { useRouter } from 'next/navigation';
import {
  deletePersonalSharedRangesByPersonalRangesId,
  deletePersonalRangesById,
  getPersonalRangesByUserId,
  upsertPersonalRangesByUserIdOrLsRangesId,
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
  lsRangesId: string;
  setLsRangesId: (value: string) => void;
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
  console.log('🚀 ~ ClientContainerVH start ');
  const [dateRanges, setDateRanges] = useLocalStorage<DateRange[]>(
    'otpuskPlanRanges',
    [],
  );
  const [lsRangesId, setLsRangesId] = useLocalStorage<string>(
    'otpuskPlanLsRangesId',
    '',
  );
  const [selectedDayOfYear, setSelectedDayOfYear] = useState<number | null>(
    null,
  );
  const [hoverDayOfYear, setHoverDayOfYear] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);

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
          if (personalRangesDBRes.id !== lsRangesId && lsRangesId) {
            // и если не совпадает, то
            // 1a) удаляем из бд таблицы PersonalSharedPlan все записи с personalRangesId = id персонального плана в локальном хранилище
            deletePersonalSharedRangesByPersonalRangesId({
              personalRangesId: lsRangesId,
            });
            // 1b) удаляем из бд таблицы PersonalRanges все записи с id = id персонального плана в локальном хранилище
            deletePersonalRangesById({ id: lsRangesId });
          }

          // 2) копируем его (personalRangesDBRes.id) в локальное хранилище
          // копируем id персонального плана в локальное хранилище
          setLsRangesId(personalRangesDBRes?.id || '');
        } else {
          // если нет персонального плана в бд
          const lsRangesJson = localStorage.getItem('otpuskPlanRanges');
          const lsRangesId2 = localStorage.getItem('otpuskPlanLsRangesId');

          if (lsRangesJson) {
            const res = await upsertPersonalRangesByUserIdOrLsRangesId({
              userId: session.user.id,
              rangesJson: lsRangesJson,
              lsRangesId: JSON.parse(lsRangesId2 || ''),
            });
            console.log('🚀 ~ ClientContainerVH ~ res-2:', res);
          }
        }
      }
    })();
  }, [session]);

  return (
    <SessionProvider session={session}>
      <ThemeContext.Provider
        value={{
          selectedYear,
          setSelectedYear,
          dateRanges,
          setDateRanges,
          lsRangesId,
          setLsRangesId,
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
    </SessionProvider>
  );
}
