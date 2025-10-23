'use client';

import { SharedRanges } from '../../generated/prisma';
import { Button } from './catalist/button';
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '@/components/catalist/dialog';
import { deletePersSharRangByPersSharRangIds } from '@/lib/actions';
import { useState } from 'react';
import { toast } from 'sonner';
export function BtnLeaveSharedPlan({
  sharedRanges,
  personalRangesId,
}: {
  sharedRanges: SharedRanges;
  personalRangesId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        color='red'
        className='cursor-pointer'
        onClick={() => {
          setIsOpen(true);
          console.log('🚀 ~ BtnLeaveSharedPlan ~ sharedRange:', sharedRanges);
        }}
      >
        Покинуть общий график
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Покинуть {sharedRanges.name}?</DialogTitle>
        <DialogDescription>
          Другие участники не будут видеть ваш план отпусков, вы не будете
          видеть планы отпусков других участников.
        </DialogDescription>
        {/* <DialogBody>
          <Field>
            <Label>Amount</Label>
            <Input name='amount' placeholder='$0.00' />
          </Field>
        </DialogBody> */}
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Отмена
          </Button>
          <Button
            onClick={async () => {
              setIsOpen(false);
              const res = await deletePersSharRangByPersSharRangIds({
                personalRangesId,
                sharedRangesId: sharedRanges.id,
              });
              if (!res.ok) {
                toast.error(
                  'Не удалось покинуть общий график. Попробуйте повторить попытку позже',
                );
              } else {
                toast.success('Вы успешно покинули общий график');
              }
            }}
          >
            Да, покинуть
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
