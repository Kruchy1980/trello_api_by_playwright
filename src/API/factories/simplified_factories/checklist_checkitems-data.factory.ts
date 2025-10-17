import { returnBooleanValue } from '@_src/API/helpers/factories/data_generators/boolean_value_generator';
import { generateRandomStringDate } from '@_src/API/helpers/factories/data_generators/date_generator';
import { generateExtendableName } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import { returnProperValue } from '@_src/API/helpers/factories/data_generators/values_generator';
import { ChecklistCheckItemDataModel } from '@_src/API/models/checklist_checkitems-data.model';

export function prepareRandomCheckItemDataSimplified(
  checkItemName?: string,
  checkItemNameLength?: number,
  dueDate?: boolean,
  days?: number,
  position?: string | number,
  status?: boolean,
): ChecklistCheckItemDataModel {
  // const name: string =
  //   checkItemName !== ''
  //     ? `${checkItemName} - ${faker.lorem.words(checkItemNameLength ?? 1)}`
  //     : checkItemName === ''
  //       ? faker.lorem.words(checkItemNameLength ?? 1)
  //       : '';
  const name: string = generateExtendableName(
    checkItemName,
    checkItemNameLength,
  );

  // const pos: string | number | undefined = position ? position : undefined;
  const pos: string | number = returnProperValue(position);

  // const due: string = dueDate
  //   ? new Date(
  //       new Date().setDate(new Date().getDate() + (days ?? 0)),
  //     ).toISOString()
  //   : '';
  const due: string = generateRandomStringDate(dueDate, days);

  const checked: boolean = returnBooleanValue(status);

  const randomChecklistCheckItemData: ChecklistCheckItemDataModel = {
    ...(checkItemName !== undefined && { name }),
    ...(pos !== '' && { pos }),
    ...(checked && { checked }),
    ...(due && { due }),
  };

  return randomChecklistCheckItemData;
}
