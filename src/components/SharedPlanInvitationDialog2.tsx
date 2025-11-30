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
        <DialogTitle>Dem gemeinsamen Urlaubsplan beitreten?</DialogTitle>
        <DialogDescription>
          Alle, die den Link zu diesem Urlaubsplan haben, können Ihren
          Urlaubsplan sehen.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Ihr Name</Label>
            <Input
              name='name'
              placeholder='Geben Sie Ihren Namen ein'
              autoFocus
              invalid={state.isError}
              defaultValue={state.name}
              onChange={(e) =>
                setState((st) => ({ ...st, name: e.target.value }))
              }
            />
            {state.isError && (
              <ErrorMessage>Dieses Feld ist erforderlich</ErrorMessage>
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
            Abbrechen
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
                    'Urlaubsplan wurde erfolgreich zum gemeinsamen Plan hinzugefügt',
                  );
                  await updatePersonalRangesUserNameById({
                    id: personalRanges.id,
                    userName: state.name,
                  });
                } else {
                  toast.error(
                    'Urlaubsplan konnte nicht zum gemeinsamen Plan hinzugefügt werden',
                  );
                }
                router.push('/');
              }
            }}
          >
            Beitreten
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
              ? 'Der Einladungslink ist abgelaufen, fordern Sie einen neuen beim Besitzer des gemeinsamen Urlaubsplans an'
              : 'Der Dienst ist vorübergehend nicht verfügbar'}
          </DialogTitle>
        }
        <DialogActions>
          <Button onClick={() => router.push('/')}>Schließen</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
