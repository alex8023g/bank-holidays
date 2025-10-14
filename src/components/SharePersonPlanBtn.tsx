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
import { sharePersonalRanges } from '@/lib/actions';
import { useState } from 'react';
import { toast } from 'sonner';
export function SharePersonPlanBtn({
  userId,
  sharedRangesId,
}: {
  userId: string | undefined;
  sharedRangesId: string;
}) {
  // const [isOpen, setIsOpen] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [name, setName] = useState('');
  const [state, setState] = useState({
    isOpen: false,
    name: '',
    isError: false,
  });
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
            onClick={() => {
              if (state.name.trim() === '') {
                setState((st) => ({ ...st, isError: true }));
              } else {
                setState((st) => ({ ...st, isOpen: false, isError: false }));
                if (!userId) {
                  toast.error('UserID is not defined');
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
