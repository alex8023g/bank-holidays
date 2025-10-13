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
import { getPersonalRanges, upsertPersonalRanges } from '@/lib/actions';
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
  const router = useRouter();
  console.log('🚀 ~ ClientContainerVH ~ dateRanges-1:', dateRanges);
  useEffect(() => {
    console.log('🚀 ~ ClientContainerVH ~ dateRanges-2:', dateRanges);
    (async () => {
      if (session) {
        toast.success('Успешная авторизация!');
        // router.push('/');
        const res = await getPersonalRanges({ userId: session.user.id });
        console.log('🚀 ~ ClientContainerVH ~ res-1:', res);
        if (res?.rangesJson) {
          setDateRanges(JSON.parse(res.rangesJson) as unknown as DateRange[]);
        } else {
          const lsRangesJson = localStorage.getItem('otpuskPlanRanges');
          if (lsRangesJson) {
            console.log('🚀 ~ ClientContainerVH ~ dateRanges-3:', lsRangesJson);
            const res = await upsertPersonalRanges({
              userId: session.user.id,
              rangesJson: lsRangesJson,
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
