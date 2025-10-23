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
import { useState } from 'react';
import { Select } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/20/solid';

export function CreateSharedCalendBtn({
  userId,
  currentYear,
  lastYearInDays,
  calendarsAmount,
}: {
  userId: string | undefined;
  currentYear: number;
  lastYearInDays: number;
  calendarsAmount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedYear, setSelectedYear] = useState(0);

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

              <Field>
                <Label>на </Label>
                {currentYear === lastYearInDays ? (
                  <Label>{currentYear}</Label>
                ) : (
                  <Select
                    name='status cursor-pointer'
                    defaultValue={lastYearInDays}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setSelectedYear(Number(e.target.value));
                    }}
                  >
                    <option value={currentYear}>{currentYear}</option>
                    <option value={lastYearInDays}>{lastYearInDays}</option>
                  </Select>
                )}
                <Label> год</Label>
              </Field>
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
                    year: selectedYear || lastYearInDays,
                    name:
                      name || `Общий график отпусков №${calendarsAmount + 1}`,
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
