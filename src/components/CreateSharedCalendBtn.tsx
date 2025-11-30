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
  const ctx = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState(
    ctx?.personalRangesName || 'Benutzer Nr. 1',
  );
  // const [sharePersonalRanges, setSharePersonalRanges] = useState(true);

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
                gemeinsamen Urlaubsplan erstellen
              </span>
            </div>
          </Button>
          <Dialog open={isOpen} onClose={setIsOpen}>
            <DialogTitle>Gemeinsamen Urlaubsplan erstellen</DialogTitle>
            <DialogDescription>
              Nach der Erstellung des gemeinsamen Urlaubsplans teilen Sie den Link zum
              Hinzufügen von Mitarbeitern.
            </DialogDescription>
            <DialogBody>
              <Field className='mb-4'>
                <Label>Name des gemeinsamen Urlaubsplans</Label>
                <Input
                  name='name'
                  defaultValue={`Gemeinsamer Urlaubsplan Nr. ${calendarsAmount + 1}`}
                  placeholder={`Gemeinsamer Urlaubsplan Nr. ${calendarsAmount + 1}`}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field className='mb-4'>
                <Label>Ihr Name im gemeinsamen Urlaubsplan</Label>
                <Input
                  name='userName'
                  // defaultValue={`Пользователь № 1`}
                  // placeholder={`Общий график отпусков №${calendarsAmount + 1}`}
                  // autoFocus
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Field>

              {/* <Field className='mb-4 flex items-center gap-2'>
                <Switch
                  name='allow_embedding'
                  checked={sharePersonalRanges}
                  onChange={setSharePersonalRanges}
                />
                <Label>Ihren Urlaubsplan zum gemeinsamen Plan hinzufügen</Label>
              </Field> */}
            </DialogBody>
            <DialogActions>
              <Button
                plain
                className='cursor-pointer'
                onClick={() => setIsOpen(false)}
              >
                Abbrechen
              </Button>
              <Button
                className='cursor-pointer'
                onClick={() => {
                  setIsOpen(false);
                  createSharedRanges({
                    userId,
                    sharedPlanName:
                      name || `Gemeinsamer Urlaubsplan Nr. ${calendarsAmount + 1}`,
                    personalRangesId: ctx?.personalRangesId,
                    userName: userName || 'Benutzer Nr. 1',
                    // personalRangesId: sharePersonalRanges
                    //   ? ctx?.personalRangesId
                    //   : undefined,
                  });
                }}
              >
                Erstellen
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Button disabled>Gemeinsamen Urlaubsplan erstellen</Button>
      )}
    </>
  );
}
