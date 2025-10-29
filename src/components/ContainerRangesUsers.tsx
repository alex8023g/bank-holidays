'use client';
import { useContext, useState } from 'react';
import { Day } from '@/lib/createDaysArr';
import { DateRangesList } from './DateRangesList';
import { RangesUsersBtnGroup } from './RangesUsersBtnGroup';
import { SharedPlansListByPersPlanId } from '@/lib/actions';
import { ParticipantsSharedPlansList } from './ParticipantsSharedPlansList';
import { twJoin } from 'tailwind-merge';
import { LoginBtnsGroup } from './LoginBtnsGroup';
import { ThemeContext } from './ContainerClientProviderVH';

export type RangesUsersBtn = 'users' | 'total';

export default function ContainerRangesUsers({
  days,
  sharedPlansList,
}: {
  days: Day[];
  sharedPlansList: SharedPlansListByPersPlanId[];
}) {
  const [activeBtn, setActiveBtn] = useState<RangesUsersBtn>('total');
  const ctx = useContext(ThemeContext);
  const handleClick = (btn: 'users' | 'total') => {
    setActiveBtn(btn);
  };
  return (
    <>
      {!ctx?.isLoginBlockOpen ? (
        <aside className='flex h-1/3 flex-col overflow-y-hidden rounded-lg bg-white shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:min-w-3xl md:px-2 xl:h-auto xl:w-1/3 xl:min-w-0'>
          <div className='/border-2 /border-blue-500 flex h-full flex-col overflow-y-hidden md:flex-row xl:flex-col'>
            <RangesUsersBtnGroup
              activeBtn={activeBtn}
              handleClick={handleClick}
            />
            <DateRangesList days={days} activeBtn={activeBtn} />
            <div
              className={twJoin(
                '/border-gray-400 /md:border w-full overflow-y-hidden rounded-lg md:flex md:w-1/2 md:flex-col xl:h-1/2 xl:w-full',
                activeBtn === 'users' ? 'flex flex-col' : 'hidden',
              )}
            >
              <ParticipantsSharedPlansList
                activeBtn={activeBtn}
                sharedPlansList={sharedPlansList}
              />
            </div>
          </div>
        </aside>
      ) : (
        <aside className='flex h-1/2 flex-col overflow-y-hidden rounded-lg bg-white px-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:mx-auto md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
          <LoginBtnsGroup />
        </aside>
      )}
    </>
  );
}
