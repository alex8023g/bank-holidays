'use client';
import { Button } from '@/components/catalist/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/catalist/dialog';
import { ErrorMessage, Field, Label } from '@/components/catalist/fieldset';
import { Input } from '@/components/catalist/input';
import {
  createSharedPersonalRangesNoUser,
  getSharedRanges,
  sharePersonalRanges,
} from '@/lib/actions';
import { ThemeContext } from '@/components/ContainerClientProviderVH';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
export function SharedPlanInvitationDialog({
  session,
  sharedRangesId,
}: {
  session: Session | null;
  sharedRangesId: string;
}) {
  const [state, setState] = useState({
    isOpen: false,
    name: '',
    isError: false,
  });
  const ctx = useContext(ThemeContext);
  const userId = session?.user.id;
  const router = useRouter();
  useEffect(() => {
    if (sharedRangesId === ctx?.lsSharedRangesData.id) {
      router.push('/');
    } else {
      setState((st) => ({ ...st, isOpen: true }));
    }
  }, [ctx?.lsSharedRangesData.id, sharedRangesId]);

  return (
    <>
      <Dialog
        open={state.isOpen}
        onClose={() => setState((st) => ({ ...st, isOpen: false }))}
      >
        <DialogTitle>Присоединиться к общему графиком отпусков?</DialogTitle>
        <DialogDescription>
          Все у кого будет ссылка на этот график отпусков смогут видеть ваш
          график отпусков.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Ваше имя</Label>
            <Input
              name='name'
              placeholder='Введите ваше имя'
              autoFocus
              invalid={state.isError}
              onChange={(e) =>
                setState((st) => ({ ...st, name: e.target.value }))
              }
            />
            {state.isError && (
              <ErrorMessage>Это поле обязательно для заполнения</ErrorMessage>
            )}
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setState((st) => ({ ...st, isOpen: false, name: '' }));
              router.push('/');
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={async () => {
              if (state.name.trim() === '') {
                setState((st) => ({ ...st, isError: true }));
              } else {
                setState((st) => ({ ...st, isOpen: false, isError: false }));
                // ctx?.setSharedRangesId(sharedRangesId);

                // ctx?.setLsRangesData({
                //   ...ctx?.lsRangesData,
                //   userName: state.name,
                // });
                if (!userId) {
                  const res = await createSharedPersonalRangesNoUser({
                    rangesJson: JSON.stringify(ctx?.dateRanges || []),
                    sharedRangesId: sharedRangesId,
                    userName: state.name,
                  });
                  if (res.personalSharedRanges && res.sharedRanges) {
                    toast.success(
                      'График отпусков успешно добавлен в общий график',
                    );
                    ctx?.setLsRangesData({
                      userName: state.name,
                      id: res.personalRanges.id,
                    });
                    ctx?.setLsSharedRangesData({
                      id: res.sharedRanges.id,
                      name: res.sharedRanges.name,
                      year: res.sharedRanges.year,
                    });
                  } else {
                    toast.error(
                      'Не удалось добавить график отпусков в общий график',
                    );
                  }
                } else {
                  const res = await getSharedRanges({ id: sharedRangesId });
                  if (res.sharedRangesWithPersonal) {
                    sharePersonalRanges({
                      userId,
                      sharedRangesId,
                    });
                    ctx?.setLsSharedRangesData({
                      id: sharedRangesId,
                      name: state.name,
                      year: res.sharedRangesWithPersonal?.year || 0,
                    });
                  } else {
                    toast.error(
                      'Не удалось добавить график отпусков в общий график',
                    );
                  }
                }
              }
            }}
          >
            Присоединиться
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
