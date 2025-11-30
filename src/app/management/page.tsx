import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateSharedCalendBtn } from '@/components/CreateSharedCalendBtn';
import { LoginBtnsGroup } from '@/components/LoginBtnsGroup';
import {
  getSharedRangesListByOwnerId,
  getSharedPlansListByPersPlanId,
} from '@/lib/actions';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';
import { BtnLeaveSharedPlan } from '@/components/BtnLeaveSharedPlan';
import { Divider } from '@/components/catalist/divider';
import { ViewColumnsIcon } from '@heroicons/react/24/outline';
import { getPersonalRangesId } from '@/lib/getPersonalRangesId';
import { SharedPlanOwnerItem } from '@/components/SharedPlanOwnerItem';
import { Suspense } from 'react';
import { ContainerClientProviderVH } from '@/components/ContainerClientProviderVH';

export default async function SharedPage() {
  const session = await getServerSession(authOptions);

  const sharedRangesByOwnerRes = await getSharedRangesListByOwnerId({
    userId: session?.user.id || null,
  });

  const calendarsAmount = sharedRangesByOwnerRes.sharedRanges?.length || 0;
  console.log('🚀 ~ SharedPage ~ calendarsAmount:', calendarsAmount);

  const personalRangesId = await getPersonalRangesId();
  const sharedPlansByPersPlanIdListRes = await getSharedPlansListByPersPlanId({
    personalRangesId,
  });
  if (sharedPlansByPersPlanIdListRes.ok) {
    console.log(
      '🚀 ~ sharedPlansByPersPlanIdListRes:',
      sharedPlansByPersPlanIdListRes.sharedRanges,
    );
  } else {
    console.error(sharedPlansByPersPlanIdListRes.error);
    return <div>Der Dienst ist vorübergehend nicht verfügbar, bitte versuchen Sie es später erneut</div>;
  }

  const res = await findOrCreatePersonalRanges();
  if (!res.ok) {
    return <div>Error: {res.errorMsg}</div>;
  }

  return (
    <ContainerClientProviderVH
      session={res.session}
      personalRangesId={res.personalRangesId}
      personalRangesName={res.personalRanges.userName}
      personalRangesIdFromCookie={res.personalRangesIdFromCookie}
      personalRanges={res.personalRanges}
    >
      {/* <Header2 session={res.session} /> */}
      <div className='flex h-full flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
        <main className='h-2/3 overflow-y-scroll bg-gray-100 p-5 xl:flex xl:h-full xl:flex-1'>
          <Suspense>
            <div>
              <h3 className='mb-2 text-xl font-semibold'>
                Gemeinsame Urlaubspläne, an denen Sie teilnehmen:
              </h3>
              {sharedPlansByPersPlanIdListRes.sharedRanges?.length ? (
                <ul>
                  {sharedPlansByPersPlanIdListRes.sharedRanges.map(
                    (sharedRange) => (
                      <li
                        key={sharedRange.sharedRanges.id}
                        className='mb-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md'
                      >
                        <div className='flex gap-2'>
                          {/* <span className='font-semibold'>Название:</span> */}
                          <span className='text-lg font-semibold'>
                            {sharedRange.sharedRanges.name}
                          </span>
                        </div>
                        <Divider className='my-2' />
                        <div className='flex gap-2'>
                          <span className='font-semibold'>
                            Anzahl der Teilnehmer:
                          </span>
                          <span>
                            {sharedRange.personalRangesList.length + 1}
                          </span>
                        </div>
                        <div className='flex justify-end'>
                          <BtnLeaveSharedPlan
                            sharedRanges={sharedRange.sharedRanges}
                            personalRangesId={personalRangesId}
                          />
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <div>Keine gemeinsamen Urlaubspläne, an denen Sie teilnehmen</div>
              )}
              <h3 className='mb-2 text-xl font-semibold'>
                Gemeinsame Urlaubspläne, in denen Sie Administrator sind:
              </h3>
              {sharedRangesByOwnerRes.sharedRanges?.length ? (
                <ul>
                  {sharedRangesByOwnerRes.sharedRanges?.map(
                    (sharedPagesItem) => (
                      <SharedPlanOwnerItem
                        key={sharedPagesItem.id}
                        sharedPlanItem={sharedPagesItem}
                        personalRangesId={personalRangesId}
                      />
                    ),
                  )}
                </ul>
              ) : (
                <div>
                  Keine gemeinsamen Urlaubspläne, in denen Sie der Besitzer sind
                </div>
              )}
            </div>
          </Suspense>
        </main>
        <aside className='flex h-1/2 flex-col overflow-y-hidden rounded-lg bg-white px-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:mx-auto md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
          {!session?.user.id ? (
            <LoginBtnsGroup />
          ) : (
            <div className='/border flex h-full flex-col items-center'>
              <div className='/border flex h-full px-3 py-5'>
                <div className='flex flex-col items-center justify-center rounded-lg border border-gray-400 p-5'>
                  <span className='mb-10 text-center'>
                    Erstellen Sie gemeinsame Urlaubspläne, teilen Sie den Link zum
                    Hinzufügen von Mitarbeitern.
                  </span>
                  <CreateSharedCalendBtn
                    userId={session?.user.id}
                    calendarsAmount={calendarsAmount}
                  />
                  <ol className='list-inside list-decimal p-5'>
                    <li>Erstellen Sie einen gemeinsamen Urlaubsplan</li>
                    <li>Kopieren Sie den Link zur Einladung von Teilnehmern</li>
                    <li>Senden Sie den Link an Mitarbeiter</li>
                    <li>
                      Mitarbeiter treten dem gemeinsamen Urlaubsplan über den
                      Link bei
                    </li>
                    <li className=''>
                      öffnen Sie den persönlichen Kalender, dort erscheinen alle Teilnehmer
                      des gemeinsamen Urlaubsplans (möglicherweise müssen Sie die
                      Seite aktualisieren)
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </ContainerClientProviderVH>
  );
}
