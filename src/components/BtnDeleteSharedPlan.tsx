'use client';

import { SharedRanges } from '../../generated/prisma';
import { Button } from './catalist/button';
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '@/components/catalist/dialog';
import { deleteSharedRangesById } from '@/lib/actions';
import { useState } from 'react';
import { toast } from 'sonner';
export function BtnDeleteSharedPlan({
  sharedRanges,
}: {
  sharedRanges: SharedRanges;
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
        Удалить общий график
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Удалить {sharedRanges.name}?</DialogTitle>
        <DialogDescription>
          Все участники не будут видеть планы отпусков коллег из этого общего
          графика отпусков.
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
              const res = await deleteSharedRangesById({
                id: sharedRanges.id,
              });
              if (!res.ok) {
                toast.error(
                  'Не удалось удалить общий график. Попробуйте повторить попытку позже',
                );
              } else {
                toast.success('Вы успешно удалили общий график');
              }
            }}
          >
            Да, удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
