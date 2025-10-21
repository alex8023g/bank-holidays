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
  createPersonalSharedRangesByTwoIds,
  updatePersonalRangesUserNameById,
} from '@/lib/actions';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PersonalRanges } from '../../generated/prisma';

export function SharedPlanInvitationDialog2({
  sharedRangesId,
  personalRanges,
  errorMsg,
}: {
  sharedRangesId: string;
  personalRanges: PersonalRanges;
  errorMsg: 'shared ranges not found' | 'error' | null;
}) {
  const [state, setState] = useState({
    isOpen: false,
    name: personalRanges.userName || '',
    isError: false,
    personPlanId: personalRanges.id,
  });

  const router = useRouter();
  useEffect(() => {
    setState((st) => ({ ...st, isOpen: true }));
  }, []);

  if (errorMsg !== 'shared ranges not found' && errorMsg !== 'error') {
    return (
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
              defaultValue={state.name}
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
                const res = await createPersonalSharedRangesByTwoIds({
                  personalRangesId: personalRanges.id,
                  sharedRangesId: sharedRangesId,
                });
                if (res.ok) {
                  toast.success(
                    'График отпусков успешно добавлен в общий график',
                  );
                  await updatePersonalRangesUserNameById({
                    id: personalRanges.id,
                    userName: state.name,
                  });
                } else {
                  toast.error(
                    'Не удалось добавить график отпусков в общий график',
                  );
                }
                router.push('/');
              }
            }}
          >
            Присоединиться
          </Button>
        </DialogActions>
      </Dialog>
    );
  } else {
    return (
      <Dialog
        open={state.isOpen}
        onClose={() => setState((st) => ({ ...st, isOpen: false }))}
      >
        {
          <DialogTitle>
            {errorMsg === 'shared ranges not found'
              ? 'Ссылка для приглашения устарела, запросите новую у владельца общего графика отпусков'
              : 'Сервис временно недоступен'}
          </DialogTitle>
        }
        <DialogActions>
          <Button onClick={() => router.push('/')}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
