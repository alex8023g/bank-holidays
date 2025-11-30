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
        Gemeinsamen Plan verlassen
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>{sharedRanges.name} verlassen?</DialogTitle>
        <DialogDescription>
          Andere Teilnehmer werden Ihren Urlaubsplan nicht mehr sehen, Sie werden
          die Urlaubspläne anderer Teilnehmer nicht mehr sehen.
        </DialogDescription>
        {/* <DialogBody>
          <Field>
            <Label>Amount</Label>
            <Input name='amount' placeholder='$0.00' />
          </Field>
        </DialogBody> */}
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Abbrechen
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
                  'Gemeinsamer Plan konnte nicht verlassen werden. Bitte versuchen Sie es später erneut',
                );
              } else {
                toast.success('Sie haben den gemeinsamen Plan erfolgreich verlassen');
              }
            }}
          >
            Ja, verlassen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
