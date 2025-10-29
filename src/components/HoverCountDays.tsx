'use client';
import { useContext } from 'react';
import { ThemeContext } from './ContainerClientProviderVH';
import { useMouse } from '@react-hooks-library/core';
import { holidaysCount } from '@/lib/holidaysCount';
import { Day } from '@/lib/createDaysArr';

export function HoverCountDays({ days }: { days: Day[] }) {
  const ctx = useContext(ThemeContext);
  const { x, y } = useMouse();
  if (!ctx) {
    return <div>no ctx</div>;
  }
  return (
    <>
      {ctx.selectedDayOfYear &&
        ctx?.hoverDayOfYear &&
        ctx.selectedDayOfYear <= ctx.hoverDayOfYear && (
          <div
            className={`fixed z-50 hidden rounded-md p-2 font-semibold shadow-xl backdrop-blur-sm md:block`}
            style={{
              left: `${x + 30}px`,
              top: `${y - 5}px`,
            }}
          >
            {ctx?.hoverDayOfYear &&
              ctx?.selectedDayOfYear &&
              ctx?.hoverDayOfYear -
                ctx?.selectedDayOfYear +
                1 -
                holidaysCount({
                  range: {
                    year: ctx.selectedYear,
                    start: { dayOfYear: ctx?.selectedDayOfYear },
                    end: { dayOfYear: ctx?.hoverDayOfYear },
                  },
                  days,
                }) +
                ' к.д.'}
          </div>
        )}
    </>
  );
}
