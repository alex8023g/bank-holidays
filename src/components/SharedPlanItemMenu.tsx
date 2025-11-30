'use client';

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/catalist/dropdown';
import {
  PencilIcon,
  TrashIcon,
  UserMinusIcon,
  UserPlusIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogActions,
  DialogBody,
} from '@/components/catalist/dialog';
import { Button } from '@/components/catalist/button';
import { toast } from 'sonner';
import {
  deleteSharedRangesById,
  updateSharedRangesNameById,
} from '@/lib/actions';
import { SharedRanges } from '../../generated/prisma';
import { useState } from 'react';
import { DropdownItemCustom } from '@/components/catalist/dropdownCustom';
import { Field, Label } from '@/components/catalist/fieldset';
import { Input } from '@/components/catalist/input';
import { SharedPlanInvitationDialog2 } from './SharedPlanInvitationDialog2';

export function SharedPlanItemMenu({
  sharedRanges,
  isMyPlanShared,
  personalRangesId,
}: {
  sharedRanges: SharedRanges;
  isMyPlanShared: boolean;
  personalRangesId: string;
}) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenRenameDialog, setIsOpenRenameDialog] = useState(false);
  const [isOpenAddMyPlanDialog, setIsOpenAddMyPlanDialog] = useState(false);
  const [name, setName] = useState(sharedRanges.name);
  return (
    <>
      <Dropdown>
        <DropdownButton as='button' className='outline-none'>
          <EllipsisVerticalIcon className='h-7 w-7 text-black transition-colors duration-200 ease-in-out hover:text-gray-400' />
        </DropdownButton>
        <DropdownMenu anchor='left start' className='z-20'>
          <DropdownItem
            onClick={() => {
              setIsOpenRenameDialog(true);
            }}
          >
            <PencilIcon className='h-5 w-5' />
            <DropdownLabel>Umbenennen</DropdownLabel>
          </DropdownItem>
          {/* {isMyPlanShared ? (
            <DropdownItem>
              <UserMinusIcon className='h-5 w-5' />
              <DropdownLabel>Ihren Urlaubsplan löschen</DropdownLabel>
            </DropdownItem>
          ) : (
            <DropdownItem>
              <UserPlusIcon className='h-5 w-5' />
              <DropdownLabel onClick={() => setIsOpenAddMyPlanDialog(true)}>
                Ihren Urlaubsplan hinzufügen
              </DropdownLabel>
            </DropdownItem>
          )} */}
          <DropdownItemCustom
            className='text-red-700 data-focus:bg-red-700'
            onClick={() => {
              setIsOpenDeleteDialog(true);
            }}
          >
            {/* <TrashIcon className='h-5 w-5' stroke='#c10007' /> */}
            <TrashIcon className='h-5 w-5 stroke-[#c10007] group-hover:stroke-white' />
            <DropdownLabel>Gemeinsamen Plan löschen</DropdownLabel>
          </DropdownItemCustom>
        </DropdownMenu>
      </Dropdown>
      {/* Dialog for delete shared ranges */}
      <Dialog open={isOpenDeleteDialog} onClose={setIsOpenDeleteDialog}>
        <DialogTitle>{sharedRanges.name} löschen?</DialogTitle>
        <DialogDescription>
          Alle Teilnehmer werden die Urlaubspläne der Kollegen aus diesem gemeinsamen
          Urlaubsplan nicht mehr sehen.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={() => setIsOpenDeleteDialog(false)}>
            Abbrechen
          </Button>
          <Button
            onClick={async () => {
              setIsOpenDeleteDialog(false);
              const res = await deleteSharedRangesById({
                id: sharedRanges.id,
              });
              if (!res.ok) {
                toast.error(
                  'Gemeinsamer Plan konnte nicht gelöscht werden. Bitte versuchen Sie es später erneut',
                );
              } else {
                toast.success('Sie haben den gemeinsamen Plan erfolgreich gelöscht');
              }
            }}
          >
            Ja, löschen
          </Button>
        </DialogActions>
      </Dialog>
      {/* end Dialog for delete shared ranges */}
      {/* Dialog for rename shared ranges */}
      <Dialog open={isOpenRenameDialog} onClose={setIsOpenRenameDialog}>
        <DialogTitle>{sharedRanges.name} umbenennen?</DialogTitle>
        <DialogDescription>
          Geben Sie einen neuen Namen für den gemeinsamen Urlaubsplan ein.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Name</Label>
            <Input
              name='name'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpenRenameDialog(false)}>
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              setIsOpenRenameDialog(false);
              updateSharedRangesNameById({
                id: sharedRanges.id,
                name: name,
              });
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
      {/* end Dialog for rename shared ranges */}

      {/* Dialog for add my plan to shared ranges */}
      {/*  {isOpenAddMyPlanDialog && (
        <SharedPlanInvitationDialog2
          sharedRangesId={sharedRanges.id}
          sharedRangesName={sharedRanges.name}
          personalRangesId={personalRangesId}
          personalRangesUserName={null}
          errorMsg={null}
        />
      )} */}
      {/* end Dialog for add my plan to shared ranges */}
    </>
  );
}
