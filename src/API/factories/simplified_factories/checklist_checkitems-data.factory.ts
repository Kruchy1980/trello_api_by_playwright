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
  const name: string = generateExtendableName(
    checkItemName,
    checkItemNameLength,
  );

  const pos: string | number = returnProperValue(position);

  const due: string = generateRandomStringDate(dueDate, days);

  const checked: boolean = returnBooleanValue(status);

  const randomChecklistCheckItemData: ChecklistCheckItemDataModel = {
    ...(name !== '' && { name }),
    ...(pos !== undefined && { pos }),
    ...(checked && { checked }),
    ...(due && { due }),
  };

  return randomChecklistCheckItemData;
}
