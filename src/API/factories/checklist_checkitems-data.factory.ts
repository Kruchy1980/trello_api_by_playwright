import { ChecklistCheckItemDataModel } from '@_src/API/models/checklist_checkitems-data.model';
import { faker } from '@faker-js/faker';

export function prepareRandomCheckItemData(
  checkItemName?: string,
  checkItemNameLength?: number,
  dueDate?: boolean,
  days?: number,
  position?: string | number,
  checked?: boolean,
): ChecklistCheckItemDataModel {
  const name: string =
    checkItemName !== ''
      ? `${checkItemName} - ${faker.lorem.words(checkItemNameLength ?? 1)}`
      : checkItemName === ''
        ? faker.lorem.words(checkItemNameLength ?? 1)
        : '';

  const pos: string | number | undefined = position ? position : undefined;

  const due: string = dueDate
    ? new Date(
        new Date().setDate(new Date().getDate() + (days ?? 0)),
      ).toISOString()
    : '';

  const randomChecklistCheckItemData: ChecklistCheckItemDataModel = {
    ...(name !== '' && { name }),
    ...(pos !== undefined && { pos }),
    ...(checked && { checked }),
    ...(due && { due }),
  };

  return randomChecklistCheckItemData;
}
