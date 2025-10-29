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
  sharePersonalRangesByPersRangId,
  updatePersonalRangesUserNameById,
} from '@/lib/actions';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';
import { PersonalRanges } from '../../generated/prisma';

export function SharedPlanInvitationDialog2({
  sharedRangesId,
  sharedRangesName,
  personalRangesId,
  personalRangesUserName,
  errorMsg,
}: {
  sharedRangesId: string;
  sharedRangesName: string;
  personalRangesId: string;
  personalRangesUserName: string | null;
  errorMsg: 'shared ranges not found' | 'error' | null;
}) {
  const [state, setState] = useState({
    isOpen: false,
    name: personalRangesUserName || '',
    isError: false,
    personPlanId: personalRangesId,
  });
  const pathname = usePathname();

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
        <DialogTitle>
          Присоединиться к общему графиком отпусков &quot;{sharedRangesName}
          &quot;?
        </DialogTitle>
        <DialogDescription>
          Все у кого будет ссылка на этот график отпусков смогут видеть ваш
          график отпусков.
        </DialogDescription>
        {personalRangesUserName && (
          <DialogBody>
            <Field>
              <Label>Имя</Label>
              <Input
                name='name'
                value={state.name}
                onChange={(e) =>
                  setState((st) => ({ ...st, name: e.target.value }))
                }
              />
            </Field>
          </DialogBody>
        )}
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setState((st) => ({ ...st, isOpen: false, name: '' }));
              if (pathname === '/invitation') {
                router.push('/');
              } else {
                router.push('/shared');
              }
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={async () => {
              if (state.name.trim() === '' && personalRangesUserName !== null) {
                setState((st) => ({ ...st, isError: true }));
              } else {
                setState((st) => ({ ...st, isOpen: false, isError: false }));
                // const res = await createPersonalSharedRangesByTwoIds({
                const res = await sharePersonalRangesByPersRangId({
                  personalRangesId: personalRangesId,
                  sharedRangesId: sharedRangesId,
                });
                if (res.ok) {
                  toast.success(
                    'График отпусков успешно добавлен в общий график',
                  );
                  if (personalRangesUserName) {
                    await updatePersonalRangesUserNameById({
                      id: personalRangesId,
                      userName: state.name,
                    });
                  }
                } else {
                  toast.error(
                    'Не удалось добавить график отпусков в общий график',
                  );
                }
                if (pathname === '/invitation') {
                  router.push('/');
                } else {
                  router.push('/shared');
                }
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
