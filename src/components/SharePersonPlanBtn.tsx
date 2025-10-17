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
  sharePersonalRanges,
} from '@/lib/actions';
import { ThemeContext } from '@/components/ContainerClientProviderVH';
import { useContext, useState } from 'react';
import { toast } from 'sonner';
export function SharePersonPlanBtn({
  userId,
  sharedRangesId,
}: {
  userId: string | undefined;
  sharedRangesId: string;
}) {
  const [state, setState] = useState({
    isOpen: false,
    name: '',
    isError: false,
  });
  const ctx = useContext(ThemeContext);
  return (
    <>
      <Button
        type='button'
        onClick={() => setState({ isOpen: true, name: '', isError: false })}
      >
        Добавить свой график отпусков в общий график
      </Button>
      <Dialog
        open={state.isOpen}
        onClose={() => setState((st) => ({ ...st, isOpen: false }))}
      >
        <DialogTitle>Поделиться своим графиком отпусков</DialogTitle>
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
                if (!userId) {
                  const res = await createSharedPersonalRangesNoUser({
                    rangesJson: JSON.stringify(ctx?.dateRanges || []),
                    sharedRangesId,
                    userName: state.name,
                  });
                  if (res.personalSharedRanges) {
                    toast.success(
                      'График отпусков успешно добавлен в общий график',
                    );
                    ctx?.setLsRangesData({
                      ...ctx?.lsRangesData,
                      id: res.personalRanges.id,
                    });
                    ctx?.setSharedRangesData({
                      ...ctx?.sharedRangesData,
                      name: res.sharedRanges.name,
                    });
                  } else {
                    toast.error(
                      'Не удалось добавить график отпусков в общий график',
                    );
                  }
                } else {
                  sharePersonalRanges({
                    userId,
                    sharedRangesId,
                  });
                }
              }
            }}
          >
            Поделиться
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
