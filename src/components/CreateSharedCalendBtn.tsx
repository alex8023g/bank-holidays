'use client';

import { createSharedRanges } from '@/lib/actions';
import { Button } from '@/components/catalist/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/catalist/dialog';
import { Field, Label } from '@/components/catalist/fieldset';
import { Input } from '@/components/catalist/input';
import { useContext, useState } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Switch } from './catalist/switch';
import { ThemeContext } from './ContainerClientProviderVH';
import { Divider } from './catalist/divider';

export function CreateSharedCalendBtn({
  userId,
  calendarsAmount,
}: {
  userId: string | undefined;
  calendarsAmount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [sharePersonalRanges, setSharePersonalRanges] = useState(true);
  const ctx = useContext(ThemeContext);

  return (
    <>
      {userId ? (
        <>
          <Button
            className='/mу-auto cursor-pointer'
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <div className='flex items-center gap-2 px-4 py-10'>
              <PlusIcon className='size-10' />
              <span className='text-lg font-semibold'>
                создать общий график отпусков
              </span>
            </div>
          </Button>
          <Dialog open={isOpen} onClose={setIsOpen}>
            <DialogTitle>Создание общего графика отпусков</DialogTitle>
            <DialogDescription>
              После создания общего графика отпусков,поделитесь ссылкой для
              добавления сотрудников .
            </DialogDescription>
            <DialogBody>
              <Field className='mb-4'>
                <Label>Название</Label>
                <Input
                  name='name'
                  defaultValue={`Общий график отпусков №${calendarsAmount + 1}`}
                  placeholder={`Общий график отпусков №${calendarsAmount + 1}`}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              {/* <Field className='mb-4 flex items-center gap-2'>
                <Switch
                  name='allow_embedding'
                  checked={sharePersonalRanges}
                  onChange={setSharePersonalRanges}
                />
                <Label>Добавить свой график отпусков в общий график</Label>
              </Field> */}
            </DialogBody>
            <DialogActions>
              <Button
                plain
                className='cursor-pointer'
                onClick={() => setIsOpen(false)}
              >
                Отмена
              </Button>
              <Button
                className='cursor-pointer'
                onClick={() => {
                  setIsOpen(false);
                  createSharedRanges({
                    userId,
                    name:
                      name || `Общий график отпусков №${calendarsAmount + 1}`,
                    personalRangesId: sharePersonalRanges
                      ? ctx?.personalRangesId
                      : undefined,
                  });
                }}
              >
                Создать
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Button disabled>Создать общий график отпусков</Button>
      )}
    </>
  );
}
